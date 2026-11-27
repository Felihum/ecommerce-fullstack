import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import BookDetailsPage from '../pages/BookDetailsPage/BookDetailsPage';
import Home from '../pages/Home';
import QuemSomos from '../pages/QuemSomos';
import TermosDeUso from '../pages/TermosDeUso';
import Privacidade from '../pages/Privacidade';

function BookDetailsRoute() {
  const { id } = useParams<{ id: string }>();

  return <BookDetailsPage bookId={id} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books/:id" element={<BookDetailsRoute />} />
      <Route path="/quem-somos" element={<QuemSomos />} />
      <Route path="/termos" element={<TermosDeUso />} />
      <Route path="/privacidade" element={<Privacidade />} />
    </Routes>
  );
}

export default AppRoutes;