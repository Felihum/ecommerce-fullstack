import React from 'react';
import './DiscountBadge.css';

type DiscountBadgeProps = {
  discount: number;
};

function DiscountBadge({ discount }: DiscountBadgeProps) {
  if (discount <= 0) {
    return null;
  }

  return (
    <span className="book-details-discount-badge">
      {discount}% OFF
    </span>
  );
}

export default DiscountBadge;
