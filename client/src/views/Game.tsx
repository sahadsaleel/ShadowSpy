import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../SocketContext';

export const Game = () => {
    const { room, startTimer, pauseTimer, resetGame, socket } = useSocket();
    const navigate = useNavigate();

    // UI Local State
    const [revealOpen, setRevealOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!room) {
            navigate('/');
            return;
        }
        if (room.state === 'LOBBY') {
            navigate('/lobby');
            return;
        }
    }, [room, navigate]);

    // Timer Logic
    useEffect(() => {
        if (!room || !room.timerEndTime || room.isPaused) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, room.timerEndTime! - now);
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                // Timer finished
            }
        }, 1000);

        // Initial set
        const remaining = Math.max(0, room.timerEndTime! - Date.now());
        setTimeLeft(remaining);

        return () => clearInterval(interval);
    }, [room?.timerEndTime, room?.isPaused]);

    useEffect(() => {
        // If room is paused, show remaining static time if available
        if (room?.isPaused && room.pausedTimeRemaining) {
            setTimeLeft(room.pausedTimeRemaining);
        }
    }, [room?.isPaused, room?.pausedTimeRemaining]);

    if (!room) return null;

    const isHost = room.hostId === socket?.id;
    const myPlayer = room.players.find(p => p.id === socket?.id);
    const myRole = myPlayer?.role; // 'CIVILIAN' | 'SPY'
    const isSpy = myRole === 'SPY';

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>

            {/* Reveal Phase Card */}
            {room.state === 'REVEAL' ? (
                <div
                    className="card"
                    onClick={() => setRevealOpen(!revealOpen)}
                    style={{
                        minHeight: '400px', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
                        background: revealOpen ? (isSpy ? '#8b1e1e' : '#1c1c1c') : '#1c1c1c',
                        border: revealOpen ? `2px solid ${isSpy ? 'red' : '#444'}` : '2px dashed #444',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {!revealOpen ? (
                        <>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🕵️</div>
                            <h2 style={{ color: 'var(--text-white)' }}>TAP TO REVEAL</h2>
                            <p style={{ color: '#777' }}>Keep your screen hidden</p>
                        </>
                    ) : (
                        <div style={{ animation: 'fadeIn 0.5s' }}>
                            <div style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '0.5rem' }}>YOUR ROLE</div>
                            <h1 style={{
                                fontSize: '3rem',
                                color: isSpy ? 'white' : 'var(--accent)',
                                fontWeight: 'bold', marginBottom: '2rem'
                            }}>
                                {isSpy ? 'SPY' : 'CIVILIAN'}
                            </h1>

                            <div style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '0.5rem' }}>SECRET LOCATION</div>
                            <h2 style={{
                                fontSize: '2.5rem', color: 'white',
                                borderBottom: '1px solid #555', paddingBottom: '1rem'
                            }}>
                                {isSpy ? '???' : room.currentWord}
                            </h2>

                            <p style={{ marginTop: '2rem', color: '#777', fontSize: '0.9rem' }}>Tap again to hide</p>
                        </div>
                    )}
                </div>
            ) : (
                // GAME Phase
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem 0' }}>

                    {/* Timer */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            fontSize: '5rem', fontWeight: 'bold', color: 'var(--text-white)',
                            textShadow: '0 0 20px rgba(255,255,255,0.1)'
                        }}>
                            {timeLeft !== null ? formatTime(timeLeft) : '0:00'}
                        </div>
                        {room.isPaused && (
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                background: 'rgba(0,0,0,0.8)', padding: '0.5rem 1rem', borderRadius: '4px',
                                color: 'yellow', fontWeight: 'bold'
                            }}>
                                PAUSED
                            </div>
                        )}
                        <p style={{ color: '#777' }}>Time Remaining</p>
                    </div>

                    <div className="card">
                        <p style={{ fontStyle: 'italic', color: '#aaa' }}>
                            "The Spy is among us. Ask questions, find inconsistencies, but don't give away the location!"
                        </p>
                    </div>
                </div>
            )}

            {/* Host Controls */}
            {isHost && (
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {room.state === 'REVEAL' && (
                        <button className="btn-primary" onClick={() => startTimer(room.id)}>
                            START TIMER
                        </button>
                    )}

                    {room.state === 'GAME' && (
                        <button className="btn-secondary" onClick={() => pauseTimer(room.id)}>
                            {room.isPaused ? 'RESUME' : 'PAUSE'}
                        </button>
                    )}

                    <button className="btn-secondary" style={{ border: '1px solid #444' }} onClick={() => resetGame(room.id)}>
                        END MISSION
                    </button>
                </div>
            )}

            {/* Quick Role Peek (Small) for Game Phase */}
            {room.state === 'GAME' && (
                <div
                    style={{
                        marginTop: '3rem', padding: '1rem', borderTop: '1px solid #333',
                        cursor: 'pointer', userSelect: 'none'
                    }}
                    onClick={() => setRevealOpen(!revealOpen)}
                >
                    <span style={{ color: '#555' }}>
                        {revealOpen ? (
                            <span style={{ color: isSpy ? 'red' : 'var(--accent)', fontWeight: 'bold' }}>
                                {isSpy ? 'YOU ARE THE SPY' : `LOCATION: ${room.currentWord}`}
                            </span>
                        ) : (
                            'Tap and hold to remind role'
                        )}
                    </span>
                </div>
            )}
        </div>
    );
};
