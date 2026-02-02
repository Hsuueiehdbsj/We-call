"""
Main FastAPI application
"""
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .models import RoomCreate, RoomResponse, JoinRoomRequest
from .room_manager import room_manager
from .signaling import signaling_server
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Real-time video calling application"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "rooms": len(room_manager.rooms),
        "active_connections": len(room_manager.connections)
    }


@app.post("/api/rooms", response_model=RoomResponse)
async def create_room(room_data: RoomCreate):
    """Create a new video call room"""
    try:
        room_info = room_manager.create_room(room_data.room_name)
        logger.info(f"Created room: {room_info.room_id}")
        
        return RoomResponse(
            room_id=room_info.room_id,
            room_name=room_info.room_name,
            created_at=room_info.created_at.isoformat(),
            participant_count=0
        )
    except Exception as e:
        logger.error(f"Error creating room: {e}")
        raise HTTPException(status_code=500, detail="Failed to create room")


@app.get("/api/rooms/{room_id}")
async def get_room(room_id: str):
    """Get room information"""
    room = room_manager.get_room(room_id)
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    return {
        "room_id": room.room_id,
        "room_name": room.room_name,
        "created_at": room.created_at.isoformat(),
        "participant_count": len(room.participants),
        "participants": list(room.participants.values())
    }


@app.post("/api/rooms/{room_id}/validate")
async def validate_room(room_id: str):
    """Validate if room exists and is joinable"""
    room = room_manager.get_room(room_id)
    
    if not room:
        return JSONResponse(
            status_code=404,
            content={"valid": False, "message": "Room not found"}
        )
    
    if len(room.participants) >= settings.MAX_PARTICIPANTS_PER_ROOM:
        return JSONResponse(
            status_code=403,
            content={"valid": False, "message": "Room is full"}
        )
    
    return {
        "valid": True,
        "room_id": room.room_id,
        "room_name": room.room_name,
        "participant_count": len(room.participants)
    }


@app.get("/api/config")
async def get_config():
    """Get client configuration"""
    return {
        "ice_servers": settings.ICE_SERVERS,
        "max_participants": settings.MAX_PARTICIPANTS_PER_ROOM
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for signaling"""
    await signaling_server.handle_connection(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
