export type Role = 'CIVILIAN' | 'SPY';

export interface Player {
    id: string;
    name: string;
    role?: Role;
    isHost: boolean;
}

export type GameState = 'LOBBY' | 'GAME' | 'REVEAL';

export interface RoomSettings {
    spyCount: number;
    timerDuration: number; // in minutes
    categories: string[];
}

export interface Room {
    id: string;
    hostId: string;
    players: Player[];
    state: GameState;
    settings: RoomSettings;
    currentWord: string;
    timerEndTime: number | null;
    isPaused: boolean;
    pausedTimeRemaining: number | null;
}
