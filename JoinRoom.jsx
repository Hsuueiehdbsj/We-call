/**
 * JoinRoom Page
 * Join an existing video call room
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, LogIn, Loader } from 'lucide-react';
import apiService from '../utils/api';

const JoinRoom = () => {
  const navigate = useNavigate();
  const { roomId: urlRoomId } = useParams();
  const [roomId, setRoomId] = useState(urlRoomId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urlRoomId) {
      setRoomId(urlRoomId);
    }
  }, [urlRoomId]);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const validation = await apiService.validateRoom(roomId.trim().toUpperCase());
      
      if (validation.valid) {
        navigate(`/room/${roomId.trim().toUpperCase()}`);
      } else {
        setError(validation.message || 'Invalid room ID');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to join room. Please check the room ID.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Join Room</h1>
            <p className="text-gray-400">Enter the room code to join the call</p>
          </div>

          <form onSubmit={handleJoinRoom}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Enter room code (e.g., ABC12345)"
                className="input-field font-mono text-lg tracking-wider"
                disabled={loading}
                maxLength={8}
                required
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !roomId.trim()}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Joining...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Join Room
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
