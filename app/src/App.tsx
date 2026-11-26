import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Footer from './components/Footer';
import BookDetailsPage from './pages/BookDetailsPage/BookDetailsPage';
import { getPaymentDemoBook } from './dev/paymentDemo';

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const paymentDemoBook = getPaymentDemoBook();

  return (
    <>
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <BookDetailsPage book={paymentDemoBook} />
      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default App;