import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AppRoutes from './routes/AppRoutes';

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <BrowserRouter>
      <>
        <ScrollToTop />
        <Navbar onOpenAuth={() => setAuthOpen(true)} />
        <AppRoutes onOpenAuth={() => setAuthOpen(true)} />
        <Footer />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    </BrowserRouter>
  );
}

export default App;