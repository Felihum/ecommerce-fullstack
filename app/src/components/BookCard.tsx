import React from 'react';
import './BookCard.css';

export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverUrl?: string;
};

type BookCardProps = {
  book: Book;
  onSelect?: (book: Book) => void;
  onBuy?: (book: Book) => void;
};

function BookCard({ book, onSelect, onBuy }: BookCardProps) {
  return (
    <article className="book-card" onClick={() => onSelect?.(book)}>
      <figure className="book-cover">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={`Capa de ${book.title}`} />
        ) : (
          <span className="book-cover-fallback" aria-hidden="true">
            {book.title.slice(0, 2).toUpperCase()}
          </span>
        )}
      </figure>

      <section className="book-body">
        <header className="book-meta">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">{book.author}</p>
        </header>

        <p className="book-description">{book.description}</p>

        <button
          type="button"
          className="book-buy-btn"
          onClick={(event) => {
            event.stopPropagation();
            onBuy?.(book);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>Comprar livro</span>
        </button>
      </section>
    </article>
  );
}

export default BookCard;