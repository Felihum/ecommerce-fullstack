import React from 'react';
import './BookPurchaseActions.css';

type BookPurchaseActionsProps = {
  onBuy?: () => void;
};

function BookPurchaseActions({ onBuy }: BookPurchaseActionsProps) {
  return (
    <div className="book-details-actions">
      <button type="button" className="book-details-buy-button" onClick={onBuy}>
        Comprar livro
      </button>
    </div>
  );
}

export default BookPurchaseActions;
