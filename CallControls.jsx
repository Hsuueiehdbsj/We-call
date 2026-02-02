/**
 * CallControls Component
 * Floating control bar with call actions
 */
import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

const CallControls = ({ isAudioEnabled, isVideoEnabled, onToggleAudio, onToggleVideo, onLeaveCall }) => {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-800 rounded-full shadow-2xl px-6 py-4 flex items-center gap-4">
        {/* Microphone Toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-4 rounded-full transition-all duration-200 ${
            isAudioEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
          title={isAudioEnabled ? 'Mute' : 'Unmute'}
        >
          {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={onToggleVideo}
          className={`p-4 rounded-full transition-all duration-200 ${
            isVideoEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
        </button>

        {/* Leave Call */}
        <button
          onClick={onLeaveCall}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200"
          title="Leave call"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};

export default CallControls;
