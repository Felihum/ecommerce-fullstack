import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <Home />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default App;