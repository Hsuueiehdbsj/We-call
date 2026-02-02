/**
 * Home Page
 * Landing page with options to create or join a room
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Plus, LogIn } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center max-w-4xl px-6">
        {/* Logo and Title */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="p-4 bg-primary-600 rounded-2xl">
            <Video size={48} />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          WeCall
        </h1>
        
        <p className="text-xl text-gray-300 mb-12">
          Simple, fast, and secure video calling. No login required.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-primary-500/50 w-full sm:w-auto"
          >
            <Plus size={24} />
            Create Room
          </button>

          <button
            onClick={() => navigate('/join')}
            className="flex items-center gap-3 px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg w-full sm:w-auto"
          >
            <LogIn size={24} />
            Join Room
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 bg-gray-800/50 rounded-xl">
            <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Video size={24} className="text-primary-400" />
            </div>
            <h3 className="font-semibold mb-2">HD Video Quality</h3>
            <p className="text-sm text-gray-400">Crystal clear video calls with adaptive quality</p>
          </div>

          <div className="p-6 bg-gray-800/50 rounded-xl">
            <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <LogIn size={24} className="text-primary-400" />
            </div>
            <h3 className="font-semibold mb-2">No Login Required</h3>
            <p className="text-sm text-gray-400">Start calling instantly with just a room code</p>
          </div>

          <div className="p-6 bg-gray-800/50 rounded-xl">
            <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Plus size={24} className="text-primary-400" />
            </div>
            <h3 className="font-semibold mb-2">Easy to Use</h3>
            <p className="text-sm text-gray-400">Simple interface, powerful features</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
