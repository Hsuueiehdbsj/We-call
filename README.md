# WeCall - Real-time Video Calling Application

![WeCall](https://img.shields.io/badge/WeCall-v1.0.0-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern, real-time video calling application built with Python (FastAPI) backend and React frontend. No authentication required - just create or join a room and start calling!

## 🎯 Features

- **🎥 HD Video Calling**: High-quality video calls with adaptive quality
- **🔒 No Login Required**: Start calling instantly with just a room code
- **👥 Multi-Participant**: Support for multiple participants per room
- **🎤 Audio Controls**: Mute/unmute microphone
- **📹 Video Controls**: Turn camera on/off
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🌐 WebRTC**: Peer-to-peer connections for low latency
- **🎨 Modern UI**: Clean, professional interface with dark theme

## 🏗️ Architecture

### System Overview

```
┌─────────────┐         WebSocket (Signaling)        ┌─────────────┐
│             │◄─────────────────────────────────────►│             │
│   Client A  │                                       │   Backend   │
│  (Browser)  │         HTTP (Room Management)        │  (FastAPI)  │
│             │◄─────────────────────────────────────►│             │
└─────────────┘                                       └─────────────┘
       ▲                                                      ▲
       │                                                      │
       │              WebRTC (Media P2P)                      │
       │                                                      │
       ▼                                                      ▼
┌─────────────┐         WebSocket (Signaling)        ┌─────────────┐
│             │◄─────────────────────────────────────►│             │
│   Client B  │                                       │   Backend   │
│  (Browser)  │         HTTP (Room Management)        │             │
│             │◄─────────────────────────────────────►│             │
└─────────────┘                                       └─────────────┘
```

### Components

#### Backend (Python + FastAPI)
- **FastAPI**: Web framework for HTTP endpoints
- **WebSockets**: Real-time signaling between clients
- **Room Manager**: In-memory room and participant management
- **Signaling Server**: WebRTC offer/answer/ICE candidate exchange

#### Frontend (React + Tailwind CSS)
- **React**: UI framework
- **Tailwind CSS**: Styling
- **WebRTC API**: Browser media capture and peer connections
- **React Router**: Client-side routing

### Data Flow

1. **Room Creation**
   - User clicks "Create Room"
   - Backend generates unique Room ID
   - User is redirected to room page

2. **Joining Room**
   - User enters Room ID
   - Backend validates room exists and has space
   - User joins via WebSocket

3. **WebRTC Connection**
   - Client A connects to signaling server
   - Client B joins the same room
   - Server notifies A about B
   - A creates offer and sends to B via server
   - B creates answer and sends to A via server
   - ICE candidates exchanged
   - Peer-to-peer connection established
   - Media streams flow directly between peers

## 📁 Project Structure

```
wecall/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration settings
│   │   ├── models.py            # Data models
│   │   ├── room_manager.py      # Room management logic
│   │   └── signaling.py         # WebSocket signaling server
│   ├── tests/
│   ├── requirements.txt
│   └── run.py                   # Entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CallControls.jsx   # Call control buttons
│   │   │   ├── VideoGrid.jsx      # Video tile grid
│   │   │   ├── VideoTile.jsx      # Individual video tile
│   │   │   └── RoomInfo.jsx       # Room information display
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── CreateRoom.jsx     # Create room page
│   │   │   ├── JoinRoom.jsx       # Join room page
│   │   │   └── Room.jsx           # Video call room
│   │   ├── hooks/
│   │   │   └── useCall.js         # Custom hook for call state
│   │   ├── utils/
│   │   │   ├── api.js             # API service
│   │   │   ├── webrtc.js          # WebRTC service
│   │   │   ├── websocket.js       # WebSocket service
│   │   │   └── config.js          # Configuration
│   │   ├── styles/
│   │   │   └── index.css          # Global styles
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python run.py
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📖 API Documentation

### REST Endpoints

#### Create Room
```http
POST /api/rooms
Content-Type: application/json

{
  "room_name": "Team Meeting"  // optional
}

Response:
{
  "room_id": "ABC12345",
  "room_name": "Team Meeting",
  "created_at": "2024-01-01T12:00:00",
  "participant_count": 0
}
```

#### Validate Room
```http
POST /api/rooms/{room_id}/validate

Response:
{
  "valid": true,
  "room_id": "ABC12345",
  "room_name": "Team Meeting",
  "participant_count": 2
}
```

#### Get Room Info
```http
GET /api/rooms/{room_id}

Response:
{
  "room_id": "ABC12345",
  "room_name": "Team Meeting",
  "created_at": "2024-01-01T12:00:00",
  "participant_count": 2,
  "participants": ["User1", "User2"]
}
```

#### Get Configuration
```http
GET /api/config

Response:
{
  "ice_servers": [
    {"urls": "stun:stun.l.google.com:19302"}
  ],
  "max_participants": 10
}
```

### WebSocket Protocol

Connect to: `ws://localhost:8000/ws`

#### Message Types

**Server → Client: Peer ID Assignment**
```json
{
  "type": "peer-id",
  "peer_id": "unique-peer-id"
}
```

**Client → Server: Join Room**
```json
{
  "type": "join",
  "room_id": "ABC12345",
  "user_name": "John Doe"
}
```

**Server → Client: Joined Successfully**
```json
{
  "type": "joined",
  "room_id": "ABC12345",
  "peer_id": "your-peer-id"
}
```

**Server → Client: Existing Participants**
```json
{
  "type": "participants",
  "participants": ["peer-id-1", "peer-id-2"]
}
```

**Server → Client: New Peer Joined**
```json
{
  "type": "peer-joined",
  "peer_id": "new-peer-id"
}
```

**Client → Server: WebRTC Offer**
```json
{
  "type": "offer",
  "target_peer_id": "peer-id",
  "offer": { /* SDP offer */ }
}
```

**Server → Client: WebRTC Offer**
```json
{
  "type": "offer",
  "peer_id": "sender-peer-id",
  "offer": { /* SDP offer */ }
}
```

**Client → Server: WebRTC Answer**
```json
{
  "type": "answer",
  "target_peer_id": "peer-id",
  "answer": { /* SDP answer */ }
}
```

**Server → Client: WebRTC Answer**
```json
{
  "type": "answer",
  "peer_id": "sender-peer-id",
  "answer": { /* SDP answer */ }
}
```

**Client → Server: ICE Candidate**
```json
{
  "type": "ice-candidate",
  "target_peer_id": "peer-id",
  "candidate": { /* ICE candidate */ }
}
```

**Server → Client: ICE Candidate**
```json
{
  "type": "ice-candidate",
  "peer_id": "sender-peer-id",
  "candidate": { /* ICE candidate */ }
}
```

**Server → Client: Peer Left**
```json
{
  "type": "peer-left",
  "peer_id": "leaving-peer-id"
}
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/app/config.py`:

```python
class Settings(BaseSettings):
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Room settings
    MAX_PARTICIPANTS_PER_ROOM: int = 10
    ROOM_ID_LENGTH: int = 8
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
    ]
    
    # ICE Servers
    ICE_SERVERS: list = [
        {"urls": "stun:stun.l.google.com:19302"},
    ]
```

### Frontend Configuration

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📦 Production Deployment

### Backend

1. Use production ASGI server:
```bash
gunicorn app.main:app -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

2. Set environment variables:
```bash
export DEBUG=False
export CORS_ORIGINS=["https://yourdomain.com"]
```

### Frontend

1. Build for production:
```bash
npm run build
```

2. Serve the `dist` folder with a web server (nginx, apache, etc.)

### Docker Deployment

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d
```

## 🔒 Security Considerations

### Current Implementation
- No authentication (by design for simplicity)
- In-memory room storage (rooms are temporary)
- Public STUN servers (for NAT traversal)

### Production Recommendations
1. **Add TURN servers** for better connectivity
2. **Implement rate limiting** on API endpoints
3. **Add room passwords** for private calls
4. **Use HTTPS/WSS** for encrypted connections
5. **Implement user authentication** for persistent rooms
6. **Add monitoring and logging**

## 🎨 Customization

### Changing Colors

Edit `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#0ea5e9',  // Change this
    600: '#0284c7',
  },
}
```

### Changing Max Participants

Edit `backend/app/config.py`:

```python
MAX_PARTICIPANTS_PER_ROOM: int = 10  # Change this
```

## 🐛 Troubleshooting

### Issue: "Failed to access media devices"
**Solution**: Ensure you're using HTTPS or localhost, and grant browser permissions.

### Issue: "WebSocket connection failed"
**Solution**: Check that the backend server is running and the WebSocket URL is correct.

### Issue: "Room not found"
**Solution**: Rooms are temporary and deleted when empty. Create a new room.

### Issue: "Cannot connect to peer"
**Solution**: Check firewall settings. Consider adding TURN servers for restrictive networks.

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- FastAPI for the excellent Python web framework
- React team for the UI library
- WebRTC for real-time communication standards
- Tailwind CSS for the utility-first CSS framework

## 📧 Support

For issues and questions:
- GitHub Issues: [your-repo/issues]
- Email: your-email@example.com

## 🗺️ Roadmap

- [ ] Screen sharing
- [ ] Chat functionality
- [ ] Recording feature
- [ ] Virtual backgrounds
- [ ] Room passwords
- [ ] Persistent rooms with authentication
- [ ] Mobile app (React Native)
- [ ] End-to-end encryption

---

**Built with ❤️ using Python and React**
