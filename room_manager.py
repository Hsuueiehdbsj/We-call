"""
Room management for video calling
Handles room creation, participant tracking, and cleanup
"""
import secrets
import string
from datetime import datetime
from typing import Dict, Optional, Set
from fastapi import WebSocket
from .models import RoomInfo
from .config import settings


class RoomManager:
    """Manages video call rooms and participants"""
    
    def __init__(self):
        # Store rooms: {room_id: RoomInfo}
        self.rooms: Dict[str, RoomInfo] = {}
        
        # Store active websocket connections: {peer_id: WebSocket}
        self.connections: Dict[str, WebSocket] = {}
        
        # Map peer_id to room_id
        self.peer_to_room: Dict[str, str] = {}
        
        # Map room_id to set of peer_ids
        self.room_participants: Dict[str, Set[str]] = {}
    
    def generate_room_id(self) -> str:
        """Generate a unique room ID"""
        while True:
            room_id = ''.join(secrets.choice(string.ascii_uppercase + string.digits) 
                            for _ in range(settings.ROOM_ID_LENGTH))
            if room_id not in self.rooms:
                return room_id
    
    def create_room(self, room_name: Optional[str] = None) -> RoomInfo:
        """Create a new room"""
        room_id = self.generate_room_id()
        room_info = RoomInfo(
            room_id=room_id,
            room_name=room_name,
            created_at=datetime.now(),
            participants={}
        )
        self.rooms[room_id] = room_info
        self.room_participants[room_id] = set()
        return room_info
    
    def get_room(self, room_id: str) -> Optional[RoomInfo]:
        """Get room information"""
        return self.rooms.get(room_id)
    
    def room_exists(self, room_id: str) -> bool:
        """Check if room exists"""
        return room_id in self.rooms
    
    def add_participant(self, room_id: str, peer_id: str, user_name: str, websocket: WebSocket) -> bool:
        """Add a participant to a room"""
        if not self.room_exists(room_id):
            return False
        
        room = self.rooms[room_id]
        
        # Check max participants
        if len(room.participants) >= settings.MAX_PARTICIPANTS_PER_ROOM:
            return False
        
        # Add participant
        room.participants[peer_id] = user_name
        self.connections[peer_id] = websocket
        self.peer_to_room[peer_id] = room_id
        self.room_participants[room_id].add(peer_id)
        
        return True
    
    def remove_participant(self, peer_id: str) -> Optional[str]:
        """Remove a participant and return room_id"""
        if peer_id not in self.peer_to_room:
            return None
        
        room_id = self.peer_to_room[peer_id]
        room = self.rooms.get(room_id)
        
        if room:
            # Remove from room
            room.participants.pop(peer_id, None)
            self.room_participants[room_id].discard(peer_id)
            
            # Clean up empty room
            if len(room.participants) == 0:
                self.delete_room(room_id)
        
        # Clean up mappings
        self.connections.pop(peer_id, None)
        self.peer_to_room.pop(peer_id, None)
        
        return room_id
    
    def delete_room(self, room_id: str):
        """Delete a room"""
        self.rooms.pop(room_id, None)
        self.room_participants.pop(room_id, None)
    
    def get_room_participants(self, room_id: str) -> Set[str]:
        """Get all participant peer_ids in a room"""
        return self.room_participants.get(room_id, set())
    
    def get_peer_connection(self, peer_id: str) -> Optional[WebSocket]:
        """Get websocket connection for a peer"""
        return self.connections.get(peer_id)
    
    def get_room_id_by_peer(self, peer_id: str) -> Optional[str]:
        """Get room_id for a peer"""
        return self.peer_to_room.get(peer_id)


# Global room manager instance
room_manager = RoomManager()
