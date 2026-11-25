import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Footer from './components/Footer';

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <Home />
      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default App;