import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Room } from './types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

interface SocketContextProps {
    socket: Socket | null;
    room: Room | null;
    createRoom: (name: string) => void;
    joinRoom: (roomId: string, name: string) => void;
    updateSettings: (roomId: string, settings: any) => void;
    startGame: (roomId: string) => void;
    startTimer: (roomId: string) => void;
    pauseTimer: (roomId: string) => void;
    resetGame: (roomId: string) => void;
    leaveRoom: () => void;
    closeRoom: (roomId: string) => void;
    error: string | null;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });

        newSocket.on('room_updated', (updatedRoom: Room) => {
            setRoom(updatedRoom);
            setError(null);
        });

        // Cleanup
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const createRoom = (name: string) => {
        if (!socket) return;
        socket.emit('create_room', { name }, (response: Room) => {
            setRoom(response);
        });
    };

    const joinRoom = (roomId: string, name: string) => {
        if (!socket) return;
        socket.emit('join_room', { roomId, name }, (response: { success: boolean; room?: Room; error?: string }) => {
            if (response.success && response.room) {
                setRoom(response.room);
                setError(null);
            } else {
                setError(response.error || 'Failed to join room');
            }
        });
    };

    const updateSettings = (roomId: string, settings: any) => {
        if (!socket) return;
        socket.emit('update_settings', { roomId, settings });
    };

    const startGame = (roomId: string) => {
        if (!socket) return;
        socket.emit('start_game', { roomId });
    };

    const startTimer = (roomId: string) => {
        if (!socket) return;
        socket.emit('start_timer', { roomId });
    };

    const pauseTimer = (roomId: string) => {
        if (!socket) return;
        socket.emit('pause_timer', { roomId });
    };

    const resetGame = (roomId: string) => {
        if (!socket) return;
        socket.emit('reset_game', { roomId });
    };

    const leaveRoom = () => {
        if (!socket) return;
        socket.disconnect();
        setRoom(null);
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);
    };

    const closeRoom = (roomId: string) => {
        if (!socket) return;
        socket.emit('close_room', { roomId });
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('room_closed', () => {
            // Host closed the room
            setRoom(null);
            // We might want to show a message or just redirect to home
            // Since room is null, the Lobby/Game views should redirect to Home automatically via their useEffects
        });

        return () => {
            socket.off('room_closed');
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{
            socket, room, createRoom, joinRoom, updateSettings,
            startGame, startTimer, pauseTimer, resetGame, leaveRoom, closeRoom, error
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
