import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import BookDetailsPage from './BookDetailsPage';
import type { BookDetails } from '../../components/BookCover/BookCover';

const book: BookDetails = {
  id: 'book-1',
  title: 'Livro de teste',
  description: 'Descrição do livro de teste.',
  price: 100,
  discount: 20,
  coverUrl: 'https://example.com/book.jpg',
};

afterEach(() => {
  localStorage.removeItem('accessToken');
  jest.restoreAllMocks();
});

test('opens the payment modal with the discounted book details', () => {
  render(<BookDetailsPage book={book} />);

  fireEvent.click(screen.getByRole('button', { name: 'Comprar livro' }));

  const dialog = screen.getByRole('dialog', { name: 'Finalizar compra' });
  const modal = within(dialog);

  expect(modal.getByRole('heading', { name: 'Livro de teste' })).toBeInTheDocument();
  expect(modal.getByText(/R\$\s*100,00/)).toBeInTheDocument();
  expect(modal.getByText(/20\s*%/)).toBeInTheDocument();
  expect(modal.getByRole('radio', { name: /Pix/ })).toBeChecked();
  expect(modal.getByRole('button', { name: /Pagar R\$\s*80,00/ })).toBeEnabled();
});

test('creates an order and keeps the modal open with the returned Pix details', async () => {
  localStorage.setItem('accessToken', 'test-access-token');
  const onBuy = jest.fn();
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    status: 201,
    json: async () => ({
      copyPaste: 'pix-copy-paste-code',
      qrCode: 'mock-qr-code',
      expiresAt: '2026-11-25T22:00:00.000Z',
    }),
  } as Response);

  render(<BookDetailsPage book={book} onBuy={onBuy} />);
  fireEvent.click(screen.getByRole('button', { name: 'Comprar livro' }));

  const dialog = screen.getByRole('dialog', { name: 'Finalizar compra' });
  fireEvent.click(within(dialog).getByRole('button', { name: /Pagar R\$\s*80,00/ }));

  expect(await within(dialog).findByText('pix-copy-paste-code')).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-access-token',
    },
    body: JSON.stringify({ bookId: book.id }),
  });
  expect(onBuy).toHaveBeenCalledWith(book);
  expect(within(dialog).getByText(/QR Code retornado pela API/)).toBeInTheDocument();
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
