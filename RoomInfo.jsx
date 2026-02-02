/**
 * RoomInfo Component
 * Displays room information and copy link button
 */
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const RoomInfo = ({ roomId }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const roomLink = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-4 left-4 z-40">
      <div className="bg-gray-800/90 backdrop-blur rounded-lg px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-gray-400">Room ID</p>
            <p className="text-lg font-bold font-mono">{roomId}</p>
          </div>
          <button
            onClick={copyToClipboard}
            className="p-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            title="Copy room link"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
