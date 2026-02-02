/**
 * Room Page
 * Main video call interface
 */
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCall } from '../hooks/useCall';
import VideoGrid from '../components/VideoGrid';
import CallControls from '../components/CallControls';
import RoomInfo from '../components/RoomInfo';
import { Loader, AlertCircle } from 'lucide-react';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const {
    localStream,
    remoteStreams,
    isAudioEnabled,
    isVideoEnabled,
    isConnected,
    error,
    toggleAudio,
    toggleVideo,
    leaveCall,
  } = useCall(roomId);

  const handleLeaveCall = () => {
    leaveCall();
    navigate('/');
  };

  useEffect(() => {
    // Prevent accidental page close
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!isConnected || !localStream) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader className="animate-spin w-12 h-12 text-primary-500 mx-auto mb-4" />
          <p className="text-xl text-gray-300">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Room Info */}
      <RoomInfo roomId={roomId} />

      {/* Video Grid */}
      <div className="h-screen flex items-center justify-center">
        <VideoGrid
          localStream={localStream}
          remoteStreams={remoteStreams}
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
        />
      </div>

      {/* Call Controls */}
      <CallControls
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onLeaveCall={handleLeaveCall}
      />
    </div>
  );
};

export default Room;
