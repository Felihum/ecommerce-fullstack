import React, { useEffect, useState } from 'react';
import BookCover, { type BookDetails } from '../BookCover/BookCover';
import './PayamentModal.css';

type PixPayment = {
  copyPaste: string;
  qrCode: string;
  expiresAt: string;
};

type PayamentModalProps = {
  isOpen: boolean;
  book: BookDetails;
  onClose: () => void;
  onPay: () => void;
};

const API_URL = 'http://localhost:3001';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPixPayment(value: unknown): value is PixPayment {
  if (!isRecord(value)) return false;

  return (
    typeof value.copyPaste === 'string' &&
    typeof value.qrCode === 'string' &&
    typeof value.expiresAt === 'string' &&
    Number.isFinite(Date.parse(value.expiresAt))
  );
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

function PayamentModal({ isOpen, book, onClose, onPay }: PayamentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [pixPayment, setPixPayment] = useState<PixPayment | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const discount = book.discount ?? 0;
  const finalPrice = book.price - (book.price * discount / 100);

  async function handlePay() {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setFeedback('Entre na sua conta antes de iniciar o pagamento.');
      return;
    }

    setIsSubmitting(true);
    setFeedback('');

    try {
      const response = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ bookId: book.id }),
      });
      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          isRecord(data) && typeof data.message === 'string'
            ? data.message
            : `A API respondeu com o status ${response.status}.`;
        setFeedback(`Não foi possível iniciar o pagamento. ${message}`);
        return;
      }

      if (!isPixPayment(data)) {
        setFeedback('A API retornou os dados do Pix em um formato inválido.');
        return;
      }

      setPixPayment(data);
      onPay();
    } catch (error) {
      const reason = error instanceof Error ? ` ${error.message}` : '';
      setFeedback(
        `Não foi possível conectar à API. Verifique se ela está ativa e se o CORS permite esta origem.${reason}`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className="payment-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      onClick={onClose}
    >
      <article className="payment-modal-card" onClick={(event) => event.stopPropagation()}>
        <header className="payment-modal-header">
          <h2 id="payment-modal-title">Finalizar compra</h2>
          <button
            type="button"
            className="payment-modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </header>

        <div className="payment-modal-content">
          <section className="payment-modal-product" aria-label="Produto">
            <BookCover book={book} />
            <div className="payment-modal-product-info">
              <h3>{book.title}</h3>
            </div>
          </section>

          <section className="payment-modal-summary" aria-label="Resumo do pedido">
            <h3>Resumo do pedido</h3>
            <dl>
              <div>
                <dt>Preço</dt>
                <dd>{formatPrice(book.price)}</dd>
              </div>
              <div>
                <dt>Desconto ({discount}%)</dt>
                <dd>-{formatPrice(book.price - finalPrice)}</dd>
              </div>
              <div className="payment-modal-total">
                <dt>Total</dt>
                <dd>{formatPrice(finalPrice)}</dd>
              </div>
            </dl>
          </section>

          {!pixPayment && (
            <fieldset className="payment-modal-methods">
              <legend>Forma de pagamento</legend>
              <label className="payment-modal-method">
                <input type="radio" name="payment-method" value="pix" defaultChecked />
                <span>
                  <strong>Pix</strong>
                  <small>Pagamento instantâneo</small>
                </span>
              </label>
            </fieldset>
          )}
        </div>

        {feedback && (
          <p className="payment-modal-feedback" role="alert">
            {feedback}
          </p>
        )}

        {pixPayment ? (
          <section className="payment-modal-pix-result" aria-label="Dados do Pix">
            <h3>Pix gerado</h3>
            <p>
              Válido até{' '}
              {new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
              }).format(new Date(pixPayment.expiresAt))}
            </p>
            <label htmlFor="payment-pix-code">Código Pix copia e cola</label>
            <textarea id="payment-pix-code" value={pixPayment.copyPaste} readOnly rows={3} />
            <p>QR Code retornado pela API: {pixPayment.qrCode}</p>
          </section>
        ) : (
          <button
            type="button"
            className="payment-modal-submit"
            onClick={handlePay}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Gerando Pix...' : `Pagar ${formatPrice(finalPrice)}`}
          </button>
        )}
      </article>
    </section>
  );
}

export default PayamentModal;
