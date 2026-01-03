import { Server, Socket } from 'socket.io';
import { createRoom, joinRoom, leaveRoom, startGame, startTimer, pauseTimer, resetGame, updateSettings, getRoom, closeRoom } from './gameStore.js';
export const registerSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        // console.log('User connected:', socket.id);
        socket.on('create_room', ({ name }, callback) => {
            const room = createRoom(socket.id, name);
            socket.join(room.id);
            if (callback)
                callback(room);
        });
        socket.on('join_room', ({ roomId, name }, callback) => {
            const room = joinRoom(roomId, socket.id, name);
            if (room) {
                socket.join(roomId);
                io.to(roomId).emit('room_updated', room);
                if (callback)
                    callback({ success: true, room });
            }
            else {
                if (callback)
                    callback({ success: false, error: 'Room not found or game started' });
            }
        });
        socket.on('update_settings', ({ roomId, settings }) => {
            const room = updateSettings(roomId, settings);
            if (room) {
                io.to(roomId).emit('room_updated', room);
            }
        });
        socket.on('start_game', ({ roomId }) => {
            const room = startGame(roomId);
            if (room) {
                io.to(roomId).emit('room_updated', room);
            }
        });
        socket.on('start_timer', ({ roomId }) => {
            const room = startTimer(roomId);
            if (room) {
                io.to(roomId).emit('room_updated', room);
            }
        });
        socket.on('pause_timer', ({ roomId }) => {
            const room = pauseTimer(roomId);
            if (room) {
                io.to(roomId).emit('room_updated', room);
            }
        });
        socket.on('reset_game', ({ roomId }) => {
            const room = resetGame(roomId);
            if (room) {
                io.to(roomId).emit('room_updated', room);
            }
        });
        socket.on('close_room', ({ roomId }) => {
            const room = closeRoom(roomId);
            if (room) {
                io.to(roomId).emit('room_closed');
            }
        });
        socket.on('disconnecting', () => {
            const rooms = Array.from(socket.rooms);
            rooms.forEach(roomId => {
                if (roomId !== socket.id) {
                    const room = leaveRoom(roomId, socket.id);
                    if (room) {
                        io.to(roomId).emit('room_updated', room);
                    }
                }
            });
        });
    });
};
//# sourceMappingURL=socketHandlers.js.map