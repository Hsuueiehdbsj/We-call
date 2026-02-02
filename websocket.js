/**
 * WebSocket Service for Signaling
 */
import { WS_URL } from './config';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.peerId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000;
    this.messageHandlers = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(WS_URL);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
        };

        this.ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
          
          // Resolve promise when we receive peer-id
          if (message.type === 'peer-id') {
            this.peerId = message.peer_id;
            resolve(message.peer_id);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.handleReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
    }
  }

  handleMessage(message) {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
  }

  on(messageType, handler) {
    this.messageHandlers.set(messageType, handler);
  }

  off(messageType) {
    this.messageHandlers.delete(messageType);
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  joinRoom(roomId, userName = 'Anonymous') {
    this.send({
      type: 'join',
      room_id: roomId,
      user_name: userName,
    });
  }

  sendOffer(targetPeerId, offer) {
    this.send({
      type: 'offer',
      target_peer_id: targetPeerId,
      offer: offer,
    });
  }

  sendAnswer(targetPeerId, answer) {
    this.send({
      type: 'answer',
      target_peer_id: targetPeerId,
      answer: answer,
    });
  }

  sendIceCandidate(targetPeerId, candidate) {
    this.send({
      type: 'ice-candidate',
      target_peer_id: targetPeerId,
      candidate: candidate,
    });
  }

  leaveRoom() {
    this.send({
      type: 'leave',
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
  }
}

export default new WebSocketService();
