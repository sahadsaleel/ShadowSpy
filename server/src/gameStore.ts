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
    pausedTimeRemaining: number | null; // ms remaining when paused
}

// Data
export const CATEGORIES: Record<string, string[]> = {
    'Locations': ['Beach', 'Hospital', 'School', 'Casino', 'Airplane', 'Pirate Ship', 'Circus', 'Bank', 'Spa', 'Embassy'],
    'Objects': ['Camera', 'Phone', 'Watch', 'Umbrella', 'Shoe', 'Laptop', 'Guitar', 'Book', 'Key', 'Wallet'],
    'Nature': ['Forest', 'Desert', 'Mountain', 'River', 'Volcano', 'Cave', 'Ocean', 'Waterfall', 'Jungle', 'Glacier'],
    'Food': ['Pizza', 'Sushi', 'Burger', 'Tacos', 'Pasta', 'Ice Cream', 'Steak', 'Salad', 'Curry', 'Sandwich'],
    'Animals': ['Lion', 'Elephant', 'Penguin', 'Kangaroo', 'Octopus', 'Snake', 'Eagle', 'Shark', 'Panda', 'Tiger']
};

const rooms: Record<string, Room> = {};

export const createRoom = (hostId: string, hostName: string): Room => {
    // Generate 6-digit number string
    const roomId = Math.floor(100000 + Math.random() * 900000).toString();
    const newRoom: Room = {
        id: roomId,
        hostId,
        players: [{ id: hostId, name: hostName, isHost: true }],
        state: 'LOBBY',
        settings: {
            spyCount: 1,
            timerDuration: 5,
            categories: ['Locations']
        },
        currentWord: '',
        timerEndTime: null,
        isPaused: false,
        pausedTimeRemaining: null
    };
    rooms[roomId] = newRoom;
    return newRoom;
};

export const getRoom = (roomId: string): Room | undefined => {
    return rooms[roomId];
};

export const joinRoom = (roomId: string, playerId: string, playerName: string): Room | null => {
    const room = rooms[roomId];
    if (!room) return null;
    if (room.state !== 'LOBBY') return null; // Can't join if game started
    if (room.players.find(p => p.id === playerId)) return room; // Already joined

    room.players.push({ id: playerId, name: playerName, isHost: false });
    return room;
};

export const leaveRoom = (roomId: string, playerId: string): Room | null => {
    const room = rooms[roomId];
    if (!room) return null;

    room.players = room.players.filter(p => p.id !== playerId);

    // If host left, assign new host or delete room
    if (room.players.length === 0) {
        delete rooms[roomId];
        return null; // Room deleted
    }

    if (room.hostId === playerId) {
        const newHost = room.players[0];
        if (newHost) {
            newHost.isHost = true;
            room.hostId = newHost.id;
        }
    }

    return room;
};

export const updateSettings = (roomId: string, settings: Partial<RoomSettings>): Room | null => {
    const room = rooms[roomId];
    if (!room) return null;
    room.settings = { ...room.settings, ...settings };
    return room;
};

export const startGame = (roomId: string): Room | null => {
    const room = rooms[roomId];
    if (!room) return null;
    if (room.players.length < 3) {
        // Minimum 3 players? Let's say yes. Spy + 2 Civilians
        // For testing, let's allow it but logic implies 3.
        // pass-through
    }

    const { categories, spyCount } = room.settings;

    let allWords: string[] = [];
    categories.forEach(cat => {
        const catWords = CATEGORIES[cat];
        if (catWords) {
            allWords = [...allWords, ...catWords];
        }
    });

    if (allWords.length === 0) {
        // Fallback if no valid categories
        allWords = CATEGORIES['Locations'] || [];
    }

    if (allWords.length === 0) return null; // Should not happen

    const word = allWords[Math.floor(Math.random() * allWords.length)];
    if (!word) return null;
    room.currentWord = word;

    // Assign roles
    // Shuffle players
    const shuffled = [...room.players].sort(() => 0.5 - Math.random());
    // Assign spies
    const spies = shuffled.slice(0, spyCount);
    const civilians = shuffled.slice(spyCount);

    spies.forEach(p => {
        const original = room.players.find(pl => pl.id === p.id);
        if (original) original.role = 'SPY';
    });
    civilians.forEach(p => {
        const original = room.players.find(pl => pl.id === p.id);
        if (original) original.role = 'CIVILIAN';
    });

    room.state = 'GAME'; // Or 'REVEAL' ?
    // Let's us REVEAL state for the "Pass the phone" or "Role Reveal" phase.
    // But since it's online, everyone reveals simultaneously on their screens.
    // So 'GAME' state is fine, the UI handles the "Tap to reveal".

    // Start Timer
    // room.timerEndTime = Date.now() + room.settings.timerDuration * 60 * 1000;
    // Actually, maybe host starts timer manually? 
    // Requirement: "3. Game Timer Screen... Pause / Resume button... Message: The game ends when the timer warns"
    // Requirement 2: "Role Reveal Flow... After reveal... 3. Game Timer Screen"

    // Let's simpler flow:
    // START GAME -> ROLES ASSIGNED (State: REVEAL)
    // Players tap card.
    // HOST has button "Start Timer" -> State: GAME (Timer running)

    room.state = 'REVEAL';
    room.timerEndTime = null;

    return room;
};

export const startTimer = (roomId: string): Room | null => {
    const room = rooms[roomId];
    if (!room) return null;

    room.state = 'GAME';
    const durationMs = room.settings.timerDuration * 60 * 1000;
    room.timerEndTime = Date.now() + durationMs;
    room.isPaused = false;

    return room;
};

export const pauseTimer = (roomId: string): Room | null => {
    const room = rooms[roomId];
    if (!room || !room.timerEndTime) return null;

    if (room.isPaused) {
        // Resume
        if (room.pausedTimeRemaining) {
            room.timerEndTime = Date.now() + room.pausedTimeRemaining;
            room.pausedTimeRemaining = null;
            room.isPaused = false;
        }
    } else {
        // Pause
        room.pausedTimeRemaining = room.timerEndTime - Date.now();
        room.isPaused = true;
    }
    return room;
}

export const resetGame = (roomId: string): Room | null => {
    const room = rooms[roomId];
    if (!room) return null;

    room.state = 'LOBBY';
    room.players.forEach(p => delete p.role);
    room.currentWord = '';
    room.timerEndTime = null;
    room.isPaused = false;
    room.pausedTimeRemaining = null;

    return room;
};

export const closeRoom = (roomId: string): Room | null => {
    const room = rooms[roomId];
    if (!room) return null;
    delete rooms[roomId];
    return room;
};
