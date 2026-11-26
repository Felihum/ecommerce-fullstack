import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AppRoutes from './AppRoutes';

const product = {
  id: 'book-123',
  title: 'Livro de rotas',
  description: 'Descrição do livro de rotas.',
  price: 42,
  discount: 0,
  imageUrl: null,
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('opens details only from the product button and returns home through the logo', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => [product],
  } as Response);

  render(
    <MemoryRouter initialEntries={['/']}>
      <Navbar onOpenAuth={() => undefined} />
      <AppRoutes />
    </MemoryRouter>,
  );

  fireEvent.click(await screen.findByRole('heading', { name: product.title }));
  expect(screen.getByRole('heading', { name: 'Livros em destaque' })).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: product.title, level: 1 }),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Comprar livro' }));

  expect(
    await screen.findByRole('heading', { name: product.title, level: 1 }),
  ).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith('/product');

  fireEvent.click(screen.getByRole('link', { name: 'Página inicial' }));

  expect(
    await screen.findByRole('heading', { name: 'Livros em destaque' }),
  ).toBeInTheDocument();
});
