# WeCall System Architecture

## Overview

WeCall is a real-time video calling application that uses WebRTC for peer-to-peer media transmission and WebSockets for signaling. The architecture is designed to be simple, scalable, and easy to understand.

## High-Level Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         Client Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Browser A  │  │   Browser B  │  │   Browser C  │        │
│  │   (React)    │  │   (React)    │  │   (React)    │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                  │                 │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │  HTTP/WS         │  HTTP/WS         │  HTTP/WS
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────────┐
│                      Signaling Server                            │
│                     (FastAPI + WebSocket)                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Room Manager: In-memory storage of rooms & peers      │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    WebRTC P2P Media
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼─────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │ Browser A │──────│ Browser B │─────│ Browser C │
    └───────────┘      └───────────┘     └───────────┘
         Peer-to-Peer Media Streams (Audio/Video)
```

## Component Details

### 1. Frontend (React Application)

#### Technology Stack
- **React 18**: UI framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Vite**: Build tool

#### Key Components

**Pages:**
- `Home.jsx`: Landing page with create/join options
- `CreateRoom.jsx`: Room creation interface
- `JoinRoom.jsx`: Room joining interface
- `Room.jsx`: Main video call interface

**Components:**
- `VideoTile.jsx`: Individual video stream display
- `VideoGrid.jsx`: Grid layout for multiple videos
- `CallControls.jsx`: Call control buttons (mute, video, leave)
- `RoomInfo.jsx`: Room information display with copy link

**Services:**
- `api.js`: REST API communication
- `webrtc.js`: WebRTC peer connection management
- `websocket.js`: WebSocket signaling communication

**Hooks:**
- `useCall.js`: Custom hook managing call state and WebRTC logic

### 2. Backend (FastAPI Application)

#### Technology Stack
- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **WebSockets**: Real-time communication
- **Pydantic**: Data validation

#### Key Modules

**main.py**: FastAPI application setup
- REST API endpoints
- CORS configuration
- WebSocket endpoint

**room_manager.py**: Room and participant management
- Room creation and deletion
- Participant tracking
- Connection management

**signaling.py**: WebSocket signaling server
- Message routing
- Offer/Answer exchange
- ICE candidate exchange
- Peer join/leave notifications

**models.py**: Data models
- Request/Response schemas
- Room information
- WebRTC signaling messages

**config.py**: Configuration management
- Environment variables
- CORS settings
- ICE server configuration

## Communication Flows

### 1. Room Creation Flow

```
User A (Browser)          Backend
     │                       │
     ├──POST /api/rooms─────►│
     │                       ├─ Generate Room ID
     │                       ├─ Create Room object
     │                       ├─ Store in memory
     │◄─────Room ID──────────┤
     │                       │
     ├──Navigate to room─────┤
     │                       │
```

### 2. Joining Room Flow

```
User B (Browser)          Backend
     │                       │
     ├─POST /api/rooms/{id}/validate─►│
     │                       ├─ Check room exists
     │                       ├─ Check not full
     │◄─────Validation───────┤
     │                       │
     ├──Connect WebSocket───►│
     │                       ├─ Assign Peer ID
     │◄─────Peer ID──────────┤
     │                       │
     ├──Send JOIN message───►│
     │   {room_id, user}     ├─ Add to room
     │                       ├─ Get existing peers
     │◄──Joined + Peers──────┤
     │                       │
```

### 3. WebRTC Connection Establishment

```
Peer A              Server              Peer B
  │                   │                   │
  ├─►Create Offer     │                   │
  │                   │                   │
  ├──OFFER────────────►                   │
  │   {target: B}     ├──OFFER───────────►│
  │                   │   {from: A}       │
  │                   │                   │
  │                   │                   │◄─Create Answer
  │                   │                   │
  │                   │◄──ANSWER──────────┤
  │◄──ANSWER──────────┤   {target: A}     │
  │   {from: B}       │                   │
  │                   │                   │
  ├──ICE Candidate───►├──ICE Candidate───►│
  │◄──ICE Candidate───┤◄──ICE Candidate───┤
  │                   │                   │
  │◄──────────────────P2P Connection─────►│
  │           (Direct Media Flow)         │
```

### 4. Media Stream Flow

Once WebRTC connection is established:

```
┌──────────┐                           ┌──────────┐
│  Peer A  │                           │  Peer B  │
│          │                           │          │
│  Camera  ├─────Media Track 1────────►│ Display  │
│  Mic     ├─────Media Track 2────────►│ Speaker  │
│          │                           │          │
│ Display  │◄────Media Track 1─────────┤  Camera  │
│ Speaker  │◄────Media Track 2─────────┤  Mic     │
│          │                           │          │
└──────────┘                           └──────────┘
      Direct P2P (No Server Involvement)
```

## Data Models

### Room Information
```python
{
    "room_id": "ABC12345",
    "room_name": "Team Meeting",
    "created_at": "2024-01-01T12:00:00",
    "participants": {
        "peer-id-1": "John Doe",
        "peer-id-2": "Jane Smith"
    }
}
```

### WebSocket Messages

**Join Room:**
```json
{
    "type": "join",
    "room_id": "ABC12345",
    "user_name": "John Doe"
}
```

**WebRTC Offer:**
```json
{
    "type": "offer",
    "target_peer_id": "peer-id-2",
    "offer": {
        "type": "offer",
        "sdp": "v=0\r\no=- ..."
    }
}
```

**ICE Candidate:**
```json
{
    "type": "ice-candidate",
    "target_peer_id": "peer-id-2",
    "candidate": {
        "candidate": "candidate:...",
        "sdpMLineIndex": 0,
        "sdpMid": "0"
    }
}
```

## Storage

### In-Memory Storage (Current)

```python
# Room Manager state
{
    "rooms": {
        "ABC12345": RoomInfo,
        "XYZ67890": RoomInfo
    },
    "connections": {
        "peer-id-1": WebSocket,
        "peer-id-2": WebSocket
    },
    "peer_to_room": {
        "peer-id-1": "ABC12345",
        "peer-id-2": "ABC12345"
    },
    "room_participants": {
        "ABC12345": ["peer-id-1", "peer-id-2"]
    }
}
```

**Limitations:**
- Data lost on server restart
- Single-server deployment only
- No persistence

**Benefits:**
- Fast access
- Simple implementation
- No database setup required

## Scalability Considerations

### Current Limitations (MVP)
- Single server instance
- In-memory storage
- Limited to server memory
- No load balancing

### Production Improvements

**1. Distributed Storage**
```
Replace in-memory with Redis:
- Shared state across servers
- Persistence option
- Pub/Sub for signaling
```

**2. Load Balancing**
```
Add load balancer + sticky sessions:
- Multiple backend instances
- WebSocket session persistence
- Health checks
```

**3. Dedicated Signaling**
```
Separate signaling from API:
- Dedicated WebSocket servers
- Scale independently
- Better resource utilization
```

**4. Media Servers (SFU)**
```
Add Selective Forwarding Unit:
- Better handling of group calls
- Bandwidth optimization
- Recording capabilities
```

## Security Architecture

### Current Security

**Transport:**
- CORS restrictions
- WebSocket validation

**Room Access:**
- Room ID required
- No persistence (temporary rooms)

### Production Security

**Recommended Additions:**
1. **HTTPS/WSS**: Encrypted transport
2. **Authentication**: User verification
3. **Room Passwords**: Private room protection
4. **Rate Limiting**: Prevent abuse
5. **Input Validation**: Sanitize all inputs
6. **Monitoring**: Track suspicious activity

## Performance

### Latency
- **Signaling**: ~50-100ms (WebSocket)
- **Media**: ~100-300ms (WebRTC P2P)
- **API**: ~20-50ms (HTTP)

### Bandwidth (per peer)
- **Video**: 0.5-2 Mbps
- **Audio**: 50-100 Kbps
- **Signaling**: <10 Kbps

### Server Resources
- **Memory**: ~1KB per participant
- **CPU**: Minimal (only signaling)
- **Connections**: Limited by OS (typically 65K)

## Technology Choices

### Why FastAPI?
- ✅ Native WebSocket support
- ✅ Fast and async
- ✅ Auto documentation
- ✅ Type hints with Pydantic

### Why React?
- ✅ Component-based UI
- ✅ Large ecosystem
- ✅ Excellent WebRTC support
- ✅ Active community

### Why WebRTC?
- ✅ Peer-to-peer (low latency)
- ✅ Browser native
- ✅ End-to-end encrypted
- ✅ Industry standard

### Why In-Memory Storage?
- ✅ Simple for MVP
- ✅ Fast access
- ✅ No database setup
- ✅ Temporary rooms by design

## Future Architecture Enhancements

### Phase 1: Basic Improvements
- [ ] Redis for state
- [ ] Docker deployment
- [ ] Environment-based config

### Phase 2: Scalability
- [ ] Multiple server instances
- [ ] Load balancer
- [ ] Health checks
- [ ] Monitoring

### Phase 3: Advanced Features
- [ ] SFU for group calls
- [ ] Recording service
- [ ] Turn server
- [ ] Database for persistent rooms

### Phase 4: Enterprise
- [ ] Authentication service
- [ ] User management
- [ ] Analytics
- [ ] CDN integration

---

**This architecture balances simplicity with functionality, making it perfect for learning and MVP deployment while providing a clear path for scaling.**
