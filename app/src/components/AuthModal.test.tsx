import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AuthModal from './AuthModal';

afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

test('sends login requests through the configured API path', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }),
  } as Response);

  render(<AuthModal isOpen onClose={() => undefined} />);

  fireEvent.change(screen.getByLabelText('E-mail'), {
    target: { value: 'reader@example.com' },
  });
  fireEvent.change(screen.getByLabelText('Senha'), {
    target: { value: 'Password1!' },
  });
  fireEvent.click(screen.getAllByRole('button', { name: 'Entrar' })[1]);

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'reader@example.com',
        password: 'Password1!',
      }),
    });
  });
});

test('sends registration requests through the configured API path', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({}),
  } as Response);

  render(<AuthModal isOpen onClose={() => undefined} />);

  fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));
  fireEvent.change(screen.getByLabelText('Nome'), {
    target: { value: 'Leitor' },
  });
  fireEvent.change(screen.getByLabelText('CPF'), {
    target: { value: '12345678909' },
  });
  fireEvent.change(screen.getByLabelText('E-mail'), {
    target: { value: 'reader@example.com' },
  });
  fireEvent.change(screen.getByLabelText('Senha'), {
    target: { value: 'Password1!' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: '12345678909',
        email: 'reader@example.com',
        name: 'Leitor',
        password: 'Password1!',
      }),
    });
  });
});
