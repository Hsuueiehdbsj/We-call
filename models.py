"""
Data models for WeCall application
"""
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class RoomCreate(BaseModel):
    """Model for room creation request"""
    room_name: Optional[str] = None


class RoomResponse(BaseModel):
    """Model for room creation response"""
    room_id: str
    room_name: Optional[str] = None
    created_at: str
    participant_count: int


class JoinRoomRequest(BaseModel):
    """Model for joining room request"""
    room_id: str
    user_name: Optional[str] = "Anonymous"


class WebRTCSignal(BaseModel):
    """Model for WebRTC signaling messages"""
    type: str  # offer, answer, ice-candidate, join, leave
    room_id: str
    peer_id: str
    data: Optional[Dict[str, Any]] = None


class RoomInfo(BaseModel):
    """Model for room information"""
    room_id: str
    room_name: Optional[str] = None
    created_at: datetime
    participants: Dict[str, str]  # peer_id: user_name
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
