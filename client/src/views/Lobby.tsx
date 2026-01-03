import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../SocketContext';
// CATEGORIES removed
// We assume CATEGORIES comes from types or we duplicate it. 
// Actually CATEGORIES is data. Let's hardcode the keys for the selector or fetch from server.
// For now, I'll hardcode the Category List keys.

const CATEGORY_LIST = ['Locations', 'Objects', 'Nature', 'Food', 'Animals'];

export const Lobby = () => {
    const { room, updateSettings, startGame, leaveRoom, closeRoom, socket } = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        if (!room) {
            navigate('/');
        } else if (room.state === 'GAME' || room.state === 'REVEAL') {
            navigate('/game');
        }
    }, [room, navigate]);

    if (!room) return null;

    const isHost = room.hostId === socket?.id;

    const handleSettingChange = (key: string, value: any) => {
        if (!isHost) return;
        updateSettings(room.id, { [key]: value });
    };

    const toggleCategory = (category: string) => {
        if (!isHost) return;
        const currentCategories = room.settings.categories || [];
        let newCategories;
        if (currentCategories.includes(category)) {
            newCategories = currentCategories.filter(c => c !== category);
        } else {
            newCategories = [...currentCategories, category];
        }
        updateSettings(room.id, { categories: newCategories });
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', paddingBottom: '2rem', animation: 'fadeIn 0.6s ease-out' }}>
            {/* Mission ID Card */}
            <div className="card" style={{
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        fontWeight: '600'
                    }}>
                        🎯 Mission ID
                    </div>
                    <div style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '8px',
                        textShadow: '0 0 40px rgba(102, 126, 234, 0.3)'
                    }}>
                        {room.id}
                    </div>
                </div>
            </div>

            {/* Players & Settings Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Players Card */}
                <div className="card">
                    <h3 style={{
                        marginBottom: '1.5rem',
                        color: 'var(--text-white)',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ fontSize: '1.3rem' }}>👥</span>
                        Players ({room.players.length})
                    </h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {room.players.map(p => (
                            <li key={p.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                background: p.isHost ? 'rgba(102, 126, 234, 0.1)' : 'rgba(30, 41, 59, 0.3)',
                                borderRadius: '10px',
                                border: p.isHost ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(100, 150, 255, 0.1)',
                                transition: 'all 0.2s ease'
                            }}>
                                <span style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: p.isHost ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'var(--text-muted)',
                                    boxShadow: p.isHost ? '0 0 10px rgba(102, 126, 234, 0.5)' : 'none'
                                }}></span>
                                <span style={{
                                    flex: 1,
                                    color: p.isHost ? 'var(--text-white)' : 'var(--text-primary)',
                                    fontWeight: p.isHost ? '600' : '400'
                                }}>
                                    {p.name} {p.id === socket?.id && '(You)'}
                                </span>
                                {p.isHost && (
                                    <span style={{
                                        fontSize: '0.7rem',
                                        padding: '0.25rem 0.5rem',
                                        background: 'rgba(102, 126, 234, 0.2)',
                                        borderRadius: '4px',
                                        color: 'var(--accent-blue-light)',
                                        fontWeight: '600'
                                    }}>
                                        HOST
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Settings Card */}
                <div className="card">
                    <h3 style={{
                        marginBottom: '1.5rem',
                        color: 'var(--text-white)',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ fontSize: '1.3rem' }}>⚙️</span>
                        Settings
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Spy Count */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                marginBottom: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontWeight: '600'
                            }}>
                                🕵️ Spy Count
                            </label>
                            {isHost ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => handleSettingChange('spyCount', Math.max(1, room.settings.spyCount - 1))}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            padding: 0,
                                            fontSize: '1.2rem',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        −
                                    </button>
                                    <span style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: 'var(--text-white)',
                                        minWidth: '40px',
                                        textAlign: 'center'
                                    }}>
                                        {room.settings.spyCount}
                                    </span>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => handleSettingChange('spyCount', Math.min(5, room.settings.spyCount + 1))}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            padding: 0,
                                            fontSize: '1.2rem',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <span style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: 'var(--text-white)',
                                    display: 'block',
                                    textAlign: 'center'
                                }}>
                                    {room.settings.spyCount}
                                </span>
                            )}
                        </div>

                        {/* Timer Duration */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                marginBottom: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontWeight: '600'
                            }}>
                                ⏱️ Timer (Minutes)
                            </label>
                            {isHost ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => handleSettingChange('timerDuration', Math.max(1, room.settings.timerDuration - 1))}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            padding: 0,
                                            fontSize: '1.2rem',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        −
                                    </button>
                                    <span style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: 'var(--text-white)',
                                        minWidth: '40px',
                                        textAlign: 'center'
                                    }}>
                                        {room.settings.timerDuration}
                                    </span>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => handleSettingChange('timerDuration', Math.min(15, room.settings.timerDuration + 1))}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            padding: 0,
                                            fontSize: '1.2rem',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <span style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: 'var(--text-white)',
                                    display: 'block',
                                    textAlign: 'center'
                                }}>
                                    {room.settings.timerDuration}m
                                </span>
                            )}
                        </div>

                        {/* Categories */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                marginBottom: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontWeight: '600'
                            }}>
                                📂 Categories
                            </label>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                maxHeight: '150px',
                                overflowY: 'auto',
                                padding: '0.5rem'
                            }}>
                                {CATEGORY_LIST.map(c => {
                                    const isSelected = (room.settings.categories || []).includes(c);
                                    return (
                                        <label
                                            key={c}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                cursor: isHost ? 'pointer' : 'default',
                                                padding: '0.5rem',
                                                background: isSelected ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                                                borderRadius: '8px',
                                                border: isSelected ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid transparent',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleCategory(c)}
                                                disabled={!isHost}
                                                style={{
                                                    accentColor: 'var(--accent-blue)',
                                                    width: '18px',
                                                    height: '18px',
                                                    cursor: isHost ? 'pointer' : 'default'
                                                }}
                                            />
                                            <span style={{
                                                color: isSelected ? 'var(--text-white)' : 'var(--text-secondary)',
                                                fontWeight: isSelected ? '500' : '400',
                                                fontSize: '0.9rem'
                                            }}>
                                                {c}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {isHost ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        className="btn-primary"
                        style={{ width: '100%', padding: '1.2rem', fontSize: '1.05rem', fontWeight: '600' }}
                        onClick={() => startGame(room.id)}
                    >
                        🚀 START MISSION
                    </button>
                    <button
                        onClick={() => closeRoom(room.id)}
                        style={{
                            width: '100%',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            padding: '1rem',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                        }}
                    >
                        ⚠️ QUIT GAME
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        padding: '1.5rem',
                        border: '2px dashed rgba(100, 150, 255, 0.2)',
                        borderRadius: '12px',
                        background: 'rgba(30, 41, 59, 0.2)'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                        <div style={{ fontSize: '0.9rem' }}>Waiting for host to start mission...</div>
                    </div>
                    <button
                        onClick={leaveRoom}
                        className="btn-secondary"
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: '1px solid rgba(100, 150, 255, 0.2)',
                            color: 'var(--text-secondary)',
                            padding: '1rem'
                        }}
                    >
                        ← Leave Room
                    </button>
                </div>
            )}
        </div>
    );
};
