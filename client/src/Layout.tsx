import type { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="container">
            <header style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
                <h1 style={{ color: 'var(--text-white)', fontSize: '2rem' }}>SHADOW<span style={{ color: 'var(--accent)' }}>SPY</span></h1>
            </header>
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <footer style={{ textAlign: 'center', marginTop: '2rem', color: '#555', fontSize: '0.8rem' }}>
                &copy; SpyRoom 2024
            </footer>
        </div>
    );
};
