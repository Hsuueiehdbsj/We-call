/**
 * Custom hook for managing call state
 */
import { useState, useEffect, useCallback } from 'react';
import webrtcService from '../utils/webrtc';
import websocketService from '../utils/websocket';
import apiService from '../utils/api';

export const useCall = (roomId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const initializeCall = useCallback(async () => {
    try {
      // Get ICE servers configuration
      const config = await apiService.getConfig();
      webrtcService.setIceServers(config.ice_servers);

      // Get local media stream
      const stream = await webrtcService.getLocalStream();
      setLocalStream(stream);

      // Connect to WebSocket
      await websocketService.connect();

      // Setup WebRTC callbacks
      webrtcService.onRemoteStream((peerId, stream) => {
        setRemoteStreams(prev => new Map(prev).set(peerId, stream));
      });

      webrtcService.onRemoteStreamRemoved((peerId) => {
        setRemoteStreams(prev => {
          const newMap = new Map(prev);
          newMap.delete(peerId);
          return newMap;
        });
      });

      // Setup WebSocket message handlers
      setupWebSocketHandlers();

      // Join room
      websocketService.joinRoom(roomId);
      setIsConnected(true);

    } catch (err) {
      console.error('Error initializing call:', err);
      setError(err.message);
    }
  }, [roomId]);

  const setupWebSocketHandlers = useCallback(() => {
    // Handle existing participants
    websocketService.on('participants', async (message) => {
      const participants = message.participants;
      
      // Create offer for each existing participant
      for (const peerId of participants) {
        try {
          const offer = await webrtcService.createOffer(peerId, (pId, candidate) => {
            websocketService.sendIceCandidate(pId, candidate);
          });
          websocketService.sendOffer(peerId, offer);
        } catch (error) {
          console.error('Error creating offer:', error);
        }
      }
    });

    // Handle new peer joined
    websocketService.on('peer-joined', async (message) => {
      console.log('Peer joined:', message.peer_id);
      // The new peer will send us an offer
    });

    // Handle incoming offer
    websocketService.on('offer', async (message) => {
      try {
        const answer = await webrtcService.handleOffer(
          message.peer_id,
          message.offer,
          (peerId, candidate) => {
            websocketService.sendIceCandidate(peerId, candidate);
          }
        );
        websocketService.sendAnswer(message.peer_id, answer);
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    });

    // Handle incoming answer
    websocketService.on('answer', async (message) => {
      try {
        await webrtcService.handleAnswer(message.peer_id, message.answer);
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    });

    // Handle ICE candidate
    websocketService.on('ice-candidate', async (message) => {
      try {
        await webrtcService.addIceCandidate(message.peer_id, message.candidate);
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    });

    // Handle peer left
    websocketService.on('peer-left', (message) => {
      console.log('Peer left:', message.peer_id);
      webrtcService.removePeerConnection(message.peer_id);
    });
  }, []);

  const toggleAudio = useCallback(() => {
    const newState = !isAudioEnabled;
    webrtcService.toggleAudio(newState);
    setIsAudioEnabled(newState);
  }, [isAudioEnabled]);

  const toggleVideo = useCallback(() => {
    const newState = !isVideoEnabled;
    webrtcService.toggleVideo(newState);
    setIsVideoEnabled(newState);
  }, [isVideoEnabled]);

  const leaveCall = useCallback(() => {
    websocketService.leaveRoom();
    websocketService.disconnect();
    webrtcService.cleanup();
    setIsConnected(false);
  }, []);

  useEffect(() => {
    initializeCall();

    return () => {
      leaveCall();
    };
  }, []);

  return {
    localStream,
    remoteStreams,
    isAudioEnabled,
    isVideoEnabled,
    isConnected,
    error,
    toggleAudio,
    toggleVideo,
    leaveCall,
  };
};
