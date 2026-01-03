import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../SocketContext';

export const Home = () => {
    const { createRoom, joinRoom, room, error } = useSocket();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [mode, setMode] = useState<'INITIAL' | 'JOIN'>('INITIAL');

    useEffect(() => {
        if (room) {
            navigate('/lobby');
        }
    }, [room, navigate]);

    const handleCreate = () => {
        if (!name) return alert('Please enter your name');
        createRoom(name);
    };

    const handleJoin = () => {
        if (!name) return alert('Please enter your name');
        if (!roomId) return alert('Please enter Room ID');
        joinRoom(roomId.toUpperCase(), name);
    };

    return (
        <div style={{
            maxWidth: '450px',
            margin: '0 auto',
            paddingTop: '10vh',
            animation: 'fadeIn 0.6s ease-out'
        }}>
            {/* Logo/Title Section */}
            <div style={{
                textAlign: 'center',
                marginBottom: '3rem',
            }}>
                <div style={{
                    fontSize: '3.5rem',
                    marginBottom: '0.5rem',
                    filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
                }}>
                    🕵️
                </div>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem',
                    letterSpacing: '1px'
                }}>
                    ShadowSpy
                </h1>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    letterSpacing: '0.5px'
                }}>
                    {mode === 'INITIAL' ? 'Welcome, Agent' : 'Join the Mission'}
                </p>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Agent Codename
                        </label>
                        <input
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={12}
                            style={{ fontSize: '1rem' }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: '#ef4444',
                            textAlign: 'center',
                            padding: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    {mode === 'INITIAL' ? (
                        <>
                            <button
                                className="btn-primary"
                                onClick={handleCreate}
                                disabled={!name}
                                style={{ width: '100%', fontSize: '1rem', padding: '1.1rem' }}
                            >
                                🎯 CREATE NEW MISSION
                            </button>

                            <div style={{
                                textAlign: 'center',
                                color: 'var(--text-muted)',
                                fontSize: '0.85rem',
                                position: 'relative',
                                padding: '0.5rem 0'
                            }}>
                                <span style={{
                                    background: 'var(--card-bg)',
                                    padding: '0 1rem',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    OR
                                </span>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: 0,
                                    right: 0,
                                    height: '1px',
                                    background: 'rgba(100, 150, 255, 0.15)',
                                    zIndex: 0
                                }} />
                            </div>

                            <button
                                className="btn-secondary"
                                onClick={() => setMode('JOIN')}
                                style={{ width: '100%', fontSize: '1rem', padding: '1.1rem' }}
                            >
                                🔗 JOIN EXISTING MISSION
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Mission ID
                                </label>
                                <input
                                    placeholder="Enter 6-digit code"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    style={{
                                        textTransform: 'uppercase',
                                        letterSpacing: '3px',
                                        textAlign: 'center',
                                        fontSize: '1.3rem',
                                        fontWeight: '600'
                                    }}
                                    maxLength={6}
                                />
                            </div>

                            <button
                                className="btn-primary"
                                onClick={handleJoin}
                                disabled={!name || !roomId}
                                style={{ width: '100%', fontSize: '1rem', padding: '1.1rem' }}
                            >
                                🚀 JOIN MISSION
                            </button>

                            <button
                                className="btn-secondary"
                                onClick={() => setMode('INITIAL')}
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    padding: '0.8rem'
                                }}
                            >
                                ← Back
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
