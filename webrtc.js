/**
 * WebRTC Service
 * Handles peer connections and media streams
 */

class WebRTCService {
  constructor() {
    this.localStream = null;
    this.peerConnections = new Map(); // Map<peerId, RTCPeerConnection>
    this.remoteStreams = new Map(); // Map<peerId, MediaStream>
    this.iceServers = [];
    this.onRemoteStreamCallback = null;
    this.onRemoteStreamRemovedCallback = null;
  }

  setIceServers(iceServers) {
    this.iceServers = iceServers;
  }

  async getLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  createPeerConnection(peerId, onIceCandidateCallback) {
    const config = {
      iceServers: this.iceServers,
    };

    const peerConnection = new RTCPeerConnection(config);

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        onIceCandidateCallback(peerId, event.candidate);
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      this.remoteStreams.set(peerId, remoteStream);
      
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(peerId, remoteStream);
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state for ${peerId}:`, peerConnection.connectionState);
      
      if (peerConnection.connectionState === 'disconnected' || 
          peerConnection.connectionState === 'failed' ||
          peerConnection.connectionState === 'closed') {
        this.removePeerConnection(peerId);
      }
    };

    this.peerConnections.set(peerId, peerConnection);
    return peerConnection;
  }

  async createOffer(peerId, onIceCandidateCallback) {
    const peerConnection = this.createPeerConnection(peerId, onIceCandidateCallback);
    
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  async handleOffer(peerId, offer, onIceCandidateCallback) {
    const peerConnection = this.createPeerConnection(peerId, onIceCandidateCallback);
    
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error('Error handling offer:', error);
      throw error;
    }
  }

  async handleAnswer(peerId, answer) {
    const peerConnection = this.peerConnections.get(peerId);
    
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  }

  async addIceCandidate(peerId, candidate) {
    const peerConnection = this.peerConnections.get(peerId);
    
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }

  removePeerConnection(peerId) {
    const peerConnection = this.peerConnections.get(peerId);
    
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(peerId);
    }

    const remoteStream = this.remoteStreams.get(peerId);
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStreams.delete(peerId);
      
      if (this.onRemoteStreamRemovedCallback) {
        this.onRemoteStreamRemovedCallback(peerId);
      }
    }
  }

  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  cleanup() {
    // Close all peer connections
    this.peerConnections.forEach((pc, peerId) => {
      this.removePeerConnection(peerId);
    });

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    this.peerConnections.clear();
    this.remoteStreams.clear();
  }

  onRemoteStream(callback) {
    this.onRemoteStreamCallback = callback;
  }

  onRemoteStreamRemoved(callback) {
    this.onRemoteStreamRemovedCallback = callback;
  }
}

export default new WebRTCService();
