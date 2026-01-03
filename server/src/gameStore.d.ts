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
    timerDuration: number;
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
export declare const CATEGORIES: Record<string, string[]>;
export declare const createRoom: (hostId: string, hostName: string) => Room;
export declare const getRoom: (roomId: string) => Room | undefined;
export declare const joinRoom: (roomId: string, playerId: string, playerName: string) => Room | null;
export declare const leaveRoom: (roomId: string, playerId: string) => Room | null;
export declare const updateSettings: (roomId: string, settings: Partial<RoomSettings>) => Room | null;
export declare const startGame: (roomId: string) => Room | null;
export declare const startTimer: (roomId: string) => Room | null;
export declare const pauseTimer: (roomId: string) => Room | null;
export declare const resetGame: (roomId: string) => Room | null;
export declare const closeRoom: (roomId: string) => Room | null;
//# sourceMappingURL=gameStore.d.ts.map