/**
 * API Service for backend communication
 */
import { API_BASE_URL } from './config';

class ApiService {
  async createRoom(roomName = null) {
    const response = await fetch(`${API_BASE_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ room_name: roomName }),
    });

    if (!response.ok) {
      throw new Error('Failed to create room');
    }

    return response.json();
  }

  async validateRoom(roomId) {
    const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/validate`, {
      method: 'POST',
    });

    return response.json();
  }

  async getRoomInfo(roomId) {
    const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`);

    if (!response.ok) {
      throw new Error('Room not found');
    }

    return response.json();
  }

  async getConfig() {
    const response = await fetch(`${API_BASE_URL}/api/config`);
    return response.json();
  }
}

export default new ApiService();
