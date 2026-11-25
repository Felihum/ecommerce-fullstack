import React from 'react';
import './BookSynopsis.css';

type BookSynopsisProps = {
  description: string;
};

function BookSynopsis({ description }: BookSynopsisProps) {
  return (
    <section className="book-details-synopsis" aria-labelledby="book-synopsis-heading">
      <h2 id="book-synopsis-heading">Sinopse</h2>
      <p>{description}</p>
    </section>
  );
}

export default BookSynopsis;
