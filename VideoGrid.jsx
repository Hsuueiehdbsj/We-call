/**
 * VideoGrid Component
 * Displays video tiles in a responsive grid
 */
import React from 'react';
import VideoTile from './VideoTile';

const VideoGrid = ({ localStream, remoteStreams, isAudioEnabled, isVideoEnabled }) => {
  const totalStreams = 1 + remoteStreams.size;
  
  // Calculate grid layout
  const getGridClass = () => {
    if (totalStreams === 1) return 'grid-cols-1';
    if (totalStreams === 2) return 'grid-cols-1 md:grid-cols-2';
    if (totalStreams <= 4) return 'grid-cols-1 md:grid-cols-2';
    if (totalStreams <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  return (
    <div className={`grid ${getGridClass()} gap-4 w-full h-full p-4`}>
      {/* Local Stream */}
      <VideoTile
        stream={localStream}
        isLocal={true}
        userName="You"
        isMuted={!isAudioEnabled}
        isVideoOff={!isVideoEnabled}
      />

      {/* Remote Streams */}
      {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
        <VideoTile
          key={peerId}
          stream={stream}
          userName={`Participant ${peerId.substring(0, 4)}`}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
