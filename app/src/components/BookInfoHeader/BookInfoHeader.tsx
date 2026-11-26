import React from 'react';
import './BookInfoHeader.css';

type BookInfoHeaderProps = {
  title: string;
};

function BookInfoHeader({ title }: BookInfoHeaderProps) {
  return (
    <header className="book-details-info-header">
      <h1 className="book-details-title">{title}</h1>
    </header>
  );
}

export default BookInfoHeader;
