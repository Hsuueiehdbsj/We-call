"""
WebSocket signaling server for WebRTC connections
Handles offer/answer exchange and ICE candidates
"""
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Any
import json
import secrets
import logging
from .room_manager import room_manager

logger = logging.getLogger(__name__)


class SignalingServer:
    """Handles WebRTC signaling via WebSocket"""
    
    async def handle_connection(self, websocket: WebSocket):
        """Handle a new WebSocket connection"""
        await websocket.accept()
        peer_id = self.generate_peer_id()
        
        # Send peer_id to client
        await websocket.send_json({
            "type": "peer-id",
            "peer_id": peer_id
        })
        
        try:
            while True:
                # Receive message from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different message types
                await self.handle_message(peer_id, websocket, message)
                
        except WebSocketDisconnect:
            logger.info(f"Peer {peer_id} disconnected")
            await self.handle_disconnect(peer_id)
        except Exception as e:
            logger.error(f"Error handling connection: {e}")
            await self.handle_disconnect(peer_id)
    
    async def handle_message(self, peer_id: str, websocket: WebSocket, message: Dict[str, Any]):
        """Handle incoming WebSocket messages"""
        msg_type = message.get("type")
        
        if msg_type == "join":
            await self.handle_join(peer_id, websocket, message)
        
        elif msg_type == "offer":
            await self.handle_offer(peer_id, message)
        
        elif msg_type == "answer":
            await self.handle_answer(peer_id, message)
        
        elif msg_type == "ice-candidate":
            await self.handle_ice_candidate(peer_id, message)
        
        elif msg_type == "leave":
            await self.handle_leave(peer_id)
    
    async def handle_join(self, peer_id: str, websocket: WebSocket, message: Dict[str, Any]):
        """Handle room join request"""
        room_id = message.get("room_id")
        user_name = message.get("user_name", "Anonymous")
        
        # Add participant to room
        success = room_manager.add_participant(room_id, peer_id, user_name, websocket)
        
        if success:
            # Notify the user of successful join
            await websocket.send_json({
                "type": "joined",
                "room_id": room_id,
                "peer_id": peer_id
            })
            
            # Get all other participants in the room
            participants = room_manager.get_room_participants(room_id)
            other_participants = [p for p in participants if p != peer_id]
            
            # Send list of existing participants to the new user
            await websocket.send_json({
                "type": "participants",
                "participants": other_participants
            })
            
            # Notify all other participants about the new user
            for other_peer_id in other_participants:
                other_ws = room_manager.get_peer_connection(other_peer_id)
                if other_ws:
                    try:
                        await other_ws.send_json({
                            "type": "peer-joined",
                            "peer_id": peer_id
                        })
                    except:
                        pass
        else:
            await websocket.send_json({
                "type": "error",
                "message": "Failed to join room. Room may be full or not exist."
            })
    
    async def handle_offer(self, peer_id: str, message: Dict[str, Any]):
        """Forward WebRTC offer to target peer"""
        target_peer_id = message.get("target_peer_id")
        offer = message.get("offer")
        
        target_ws = room_manager.get_peer_connection(target_peer_id)
        if target_ws:
            try:
                await target_ws.send_json({
                    "type": "offer",
                    "peer_id": peer_id,
                    "offer": offer
                })
            except Exception as e:
                logger.error(f"Error sending offer: {e}")
    
    async def handle_answer(self, peer_id: str, message: Dict[str, Any]):
        """Forward WebRTC answer to target peer"""
        target_peer_id = message.get("target_peer_id")
        answer = message.get("answer")
        
        target_ws = room_manager.get_peer_connection(target_peer_id)
        if target_ws:
            try:
                await target_ws.send_json({
                    "type": "answer",
                    "peer_id": peer_id,
                    "answer": answer
                })
            except Exception as e:
                logger.error(f"Error sending answer: {e}")
    
    async def handle_ice_candidate(self, peer_id: str, message: Dict[str, Any]):
        """Forward ICE candidate to target peer"""
        target_peer_id = message.get("target_peer_id")
        candidate = message.get("candidate")
        
        target_ws = room_manager.get_peer_connection(target_peer_id)
        if target_ws:
            try:
                await target_ws.send_json({
                    "type": "ice-candidate",
                    "peer_id": peer_id,
                    "candidate": candidate
                })
            except Exception as e:
                logger.error(f"Error sending ICE candidate: {e}")
    
    async def handle_leave(self, peer_id: str):
        """Handle peer leaving the room"""
        await self.handle_disconnect(peer_id)
    
    async def handle_disconnect(self, peer_id: str):
        """Handle peer disconnection"""
        room_id = room_manager.get_room_id_by_peer(peer_id)
        
        if room_id:
            # Get other participants before removing
            participants = room_manager.get_room_participants(room_id)
            other_participants = [p for p in participants if p != peer_id]
            
            # Remove participant from room
            room_manager.remove_participant(peer_id)
            
            # Notify other participants
            for other_peer_id in other_participants:
                other_ws = room_manager.get_peer_connection(other_peer_id)
                if other_ws:
                    try:
                        await other_ws.send_json({
                            "type": "peer-left",
                            "peer_id": peer_id
                        })
                    except:
                        pass
    
    def generate_peer_id(self) -> str:
        """Generate a unique peer ID"""
        return secrets.token_urlsafe(16)


# Global signaling server instance
signaling_server = SignalingServer()
