/**
 * VideoTile Component
 * Displays a single video stream
 */
import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, User } from 'lucide-react';

const VideoTile = ({ stream, isLocal = false, userName = 'User', isMuted = false, isVideoOff = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="video-tile">
      {/* Video Element */}
      {stream && !isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center mx-auto mb-4">
              <User size={48} />
            </div>
            <p className="text-lg font-medium">{userName}</p>
          </div>
        </div>
      )}

      {/* Overlay Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-2">
            {userName}
            {isLocal && <span className="text-xs text-gray-400">(You)</span>}
          </span>
          
          <div className="flex gap-2">
            {isMuted ? (
              <div className="p-1.5 bg-red-500 rounded-full">
                <MicOff size={14} />
              </div>
            ) : (
              <div className="p-1.5 bg-green-500 rounded-full">
                <Mic size={14} />
              </div>
            )}
            
            {isVideoOff && (
              <div className="p-1.5 bg-red-500 rounded-full">
                <VideoOff size={14} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTile;
