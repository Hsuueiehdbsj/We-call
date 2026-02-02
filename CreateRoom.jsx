/**
 * CreateRoom Page
 * Create a new video call room
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Loader } from 'lucide-react';
import apiService from '../utils/api';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const room = await apiService.createRoom(roomName || null);
      navigate(`/room/${room.room_id}`);
    } catch (err) {
      setError('Failed to create room. Please try again.');
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
              <Plus size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Room</h1>
            <p className="text-gray-400">Start a new video call session</p>
          </div>

          <form onSubmit={handleCreateRoom}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Name (Optional)
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g., Team Meeting, Study Session"
                className="input-field"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Leave blank for auto-generated name
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Create Room
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
