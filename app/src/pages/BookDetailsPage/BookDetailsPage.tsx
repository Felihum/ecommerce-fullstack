import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../api/api';
import BookCover, { type BookDetails } from '../../components/BookCover/BookCover';
import DiscountBadge from '../../components/DiscountBadge/DiscountBadge';
import BookInfoHeader from '../../components/BookInfoHeader/BookInfoHeader';
import BookSynopsis from '../../components/BookSynopsis/BookSynopsis';
import BookPurchaseActions from '../../components/BookPurchaseActions/BookPurchaseActions';
import PayamentModal from '../../components/PayamentModal/PayamentModal';
import './BookDetailsPage.css';

type BookDetailsPageProps = {
  book?: BookDetails;
  bookId?: string;
  onBuy?: (book: BookDetails) => void;
};

/*
const defaultBook: BookDetails = {
  id: 'book-details-example',
  title: 'Título do livro',
  description: 'A sinopse deste livro será exibida aqui.',
  price: 0,
  discount: 0,
};
*/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function mapProductToBook(value: unknown): BookDetails {
  if (!isRecord(value)) {
    throw new Error('A API retornou um produto em formato inválido.');
  }

  const { id, title, description, price, discount, imageUrl } = value;
  const productDiscount = discount ?? 0;

  if (
    typeof id !== 'string' ||
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    !Number.isFinite(price) ||
    typeof productDiscount !== 'number' ||
    !Number.isFinite(productDiscount) ||
    productDiscount < 0 ||
    productDiscount > 100 ||
    (imageUrl != null && typeof imageUrl !== 'string')
  ) {
    throw new Error('A API retornou dados inválidos para o produto.');
  }

  return {
    id,
    title,
    description,
    price,
    discount: productDiscount,
    coverUrl: typeof imageUrl === 'string' ? imageUrl : undefined,
  };
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

function BookDetailsPage({
  book,
  bookId,
  onBuy,
}: BookDetailsPageProps) {
  const [apiBook, setApiBook] = useState<BookDetails | null>(null);
  const [isLoading, setIsLoading] = useState(!book);
  const [loadError, setLoadError] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    if (book) {
      setIsLoading(false);
      setLoadError('');
      return;
    }

    let active = true;

    async function loadBook() {
      setIsLoading(true);
      setLoadError('');
      setApiBook(null);

      try {
        const response = await fetch(apiUrl('/product'));

        if (!response.ok) {
          throw new Error(`A API respondeu com o status ${response.status}.`);
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('A API retornou uma lista de produtos em formato inválido.');
        }

        const product = bookId
          ? data.find(
              (item: unknown) => isRecord(item) && item.id === bookId,
            )
          : data[0];

        if (active && product !== undefined) {
          setApiBook(mapProductToBook(product));
        }
      } catch (error) {
        if (active) {
          const reason = error instanceof Error ? ` ${error.message}` : '';
          setLoadError(
            `Não foi possível carregar os livros da API. Verifique se ela está ativa.${reason}`
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      active = false;
    };
  }, [book, bookId]);

  const displayedBook = book ?? apiBook;

  if (isLoading) {
    return (
      <main className="book-details-page">
        <p className="book-details-status" role="status">
          Carregando livro...
        </p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="book-details-page">
        <p className="book-details-status" role="alert">
          {loadError}
        </p>
      </main>
    );
  }

  if (!displayedBook) {
    return (
      <main className="book-details-page">
        <p className="book-details-status" role="status">
          Nenhum livro encontrado no catálogo.
        </p>
      </main>
    );
  }

  const discount = displayedBook.discount ?? 0;
  const finalPrice = discount > 0
    ? displayedBook.price - (displayedBook.price * discount / 100)
    : displayedBook.price;

  return (
    <main className="book-details-page">
      <article className="book-details-card">
        <section className="book-details-left">
          <DiscountBadge discount={discount} />
          <BookCover book={displayedBook} />
        </section>

        <section className="book-details-content">
          <BookInfoHeader title={displayedBook.title} />

          <div className="book-details-price-area">
            {discount > 0 && (
              <p className="book-details-original-price">
                De <span>{formatPrice(displayedBook.price)}</span>
              </p>
            )}
            <p className="book-details-price">{formatPrice(finalPrice)}</p>
            {discount > 0 && (
              <p className="book-details-discount">
                Economize {formatPrice(displayedBook.price - finalPrice)}
              </p>
            )}
          </div>

          <BookSynopsis description={displayedBook.description} />

          <BookPurchaseActions
            onBuy={() => setIsPaymentOpen(true)}
          />
        </section>
      </article>
      <PayamentModal
        isOpen={isPaymentOpen}
        book={displayedBook}
        onClose={() => setIsPaymentOpen(false)}
        onPay={() => onBuy?.(displayedBook)}
      />
    </main>
  );
}

export default BookDetailsPage;
