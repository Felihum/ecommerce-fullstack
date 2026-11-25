import React from 'react';
import type { Book } from '../BookCard';
import './BookCover.css';

export type BookDetails = Omit<Book, 'author'> & {
  discount?: number;
};

type BookCoverProps = {
  book: BookDetails;
};

function BookCover({ book }: BookCoverProps) {
  return (
    <figure className="book-details-cover">
      {book.coverUrl ? (
        <img src={book.coverUrl} alt={`Capa de ${book.title}`} />
      ) : (
        <span className="book-details-cover-fallback" aria-hidden="true">
          {book.title.slice(0, 2).toUpperCase()}
        </span>
      )}
    </figure>
  );
}

export default BookCover;
