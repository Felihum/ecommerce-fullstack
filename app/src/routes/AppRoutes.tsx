import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import BookDetailsPage from '../pages/BookDetailsPage/BookDetailsPage';
import Home from '../pages/Home';

function BookDetailsRoute() {
  const { id } = useParams<{ id: string }>();

  return <BookDetailsPage bookId={id} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books/:id" element={<BookDetailsRoute />} />
    </Routes>
  );
}

export default AppRoutes;
