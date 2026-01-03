import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './SocketContext';
import { Layout } from './Layout';
import { Home } from './views/Home';
import { Lobby } from './views/Lobby';
import { Game } from './views/Game';

// Placeholder components until implemented
// const Lobby = () => <div>Lobby (Coming Soon)</div>;
// const Game = () => <div>Game (Coming Soon)</div>;

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game" element={<Game />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
