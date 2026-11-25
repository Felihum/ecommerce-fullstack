import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <main>
        <h1>Livraria & Leitura Online</h1>
      </main>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default App;