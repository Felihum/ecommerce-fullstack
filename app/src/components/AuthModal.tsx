import React, { useState } from 'react';
import './AuthModal.css';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AuthMode = 'login' | 'register';

const API_URL = 'http://localhost:3001';

function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFeedback('');
    setLoading(true);

    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    const payload =
      mode === 'login'
        ? { email, password }
        : { cpf, email, name, password };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setFeedback(data?.message || 'Não foi possível concluir. Verifique os dados.');
        return;
      }

      if (data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      if (data?.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      setFeedback(
        mode === 'login' ? 'Login realizado com sucesso!' : 'Conta criada com sucesso!'
      );
      onClose();
    } catch {
      setFeedback('Erro ao conectar com a API em localhost:3001. Verifique se ela está rodando.');
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setFeedback('');
  }

  return (
    <section className="auth-backdrop" role="dialog" aria-modal="true" aria-label="Conta">
      <article className="auth-card">
        <header className="auth-header">
          <h2>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h2>
          <button type="button" className="auth-close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </header>

        <nav className="auth-tabs" aria-label="Alternar entre entrar e criar conta">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Criar conta
          </button>
        </nav>

        <form className="auth-form" onSubmit={handleSubmit}>
          <fieldset className="auth-fields" disabled={loading}>
            {mode === 'register' && (
              <>
                <label className="auth-field">
                  <span>Nome</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </label>

                <label className="auth-field">
                  <span>CPF</span>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    required
                  />
                </label>
              </>
            )}

            <label className="auth-field">
              <span>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                required
              />
            </label>

            <label className="auth-field">
              <span>Senha</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
          </fieldset>

          {feedback && <p className="auth-feedback">{feedback}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? 'Aguarde...'
              : mode === 'login'
                ? 'Entrar'
                : 'Cadastrar'}
          </button>
        </form>
      </article>
    </section>
  );
}

export default AuthModal;