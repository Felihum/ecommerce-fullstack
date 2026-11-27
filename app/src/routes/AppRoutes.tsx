import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import BookDetailsPage from '../pages/BookDetailsPage/BookDetailsPage';
import Home from '../pages/Home';
import QuemSomos from '../pages/QuemSomos';
import TermosDeUso from '../pages/TermosDeUso';
import Privacidade from '../pages/Privacidade';

type AppRoutesProps = {
  onOpenAuth?: () => void;
};

function BookDetailsRoute() {
  const { id } = useParams<{ id: string }>();

  return <BookDetailsPage bookId={id} />;
}

function AppRoutes({ onOpenAuth }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<Home onOpenAuth={onOpenAuth} />} />
      <Route path="/books/:id" element={<BookDetailsRoute />} />
      <Route path="/quem-somos" element={<QuemSomos />} />
      <Route path="/termos" element={<TermosDeUso />} />
      <Route path="/privacidade" element={<Privacidade />} />
    </Routes>
  );
}

export default AppRoutes;