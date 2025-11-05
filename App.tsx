
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MatchList from './components/MatchList';
import Player from './components/Player';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MatchList />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
