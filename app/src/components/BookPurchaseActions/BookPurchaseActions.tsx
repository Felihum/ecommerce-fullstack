import React from 'react';
import './BookPurchaseActions.css';

type BookPurchaseActionsProps = {
  onBuy?: () => void;
  onAddToCart?: () => void;
};

function BookPurchaseActions({
  onBuy,
  onAddToCart,
}: BookPurchaseActionsProps) {
  return (
    <div className="book-details-actions">
      <button type="button" className="book-details-buy-button" onClick={onBuy}>
        Comprar livro
      </button>
      <button type="button" className="book-details-cart-button" onClick={onAddToCart}>
        Adicionar ao carrinho
      </button>
    </div>
  );
}

export default BookPurchaseActions;
