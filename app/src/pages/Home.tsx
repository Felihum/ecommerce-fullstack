import React, { useEffect, useState } from 'react';
import BookCard, { type Book } from '../components/BookCard';
import './Home.css';

const API_URL = 'http://localhost:3001';
const PRODUCTS_ENDPOINT = '/product';

type ProductDict = {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  contentUrl?: string | null;
  discount?: number;
  imageUrl?: string | null;
};

function mapProductToBook(raw: ProductDict, index: number): Book {
  return {
    id: String(raw.id ?? index + 1),
    title: raw.title?.trim() || 'Título indisponível',
    author: 'Acervo Editorial',
    description: raw.description?.trim() || 'Descrição indisponível no momento.',
    price: Number(raw.price ?? 0),
    coverUrl: raw.imageUrl || undefined,
  };
}

function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_URL}${PRODUCTS_ENDPOINT}`);

        if (!response.ok) {
          throw new Error('Falha ao carregar produtos da API.');
        }

        const data: unknown = await response.json();
        const list = Array.isArray(data)
          ? (data as ProductDict[])
          : Array.isArray((data as { items?: unknown })?.items)
            ? ((data as { items: ProductDict[] }).items)
            : Array.isArray((data as { data?: unknown })?.data)
              ? ((data as { data: ProductDict[] }).data)
              : [];

        if (active) {
          setBooks(list.map((item, idx) => mapProductToBook(item, idx)));
        }
      } catch {
        if (active) {
          setError('Não foi possível carregar os livros da API em localhost:3001.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="home-page">
      <section className="featured-section" aria-labelledby="featured-heading">
        <header className="section-header">
          <h1 id="featured-heading" className="section-title">
            Livros em destaque
          </h1>

          <a href="#catalogo" className="section-more">
            Ver mais <span aria-hidden="true">›</span>
          </a>
        </header>

        {loading && <p className="home-status">Carregando livros...</p>}

        {!loading && error && <p className="home-status">{error}</p>}

        {!loading && !error && books.length === 0 && (
          <p className="home-status">Nenhum livro encontrado no catálogo.</p>
        )}

        {!loading && !error && books.length > 0 && (
          <section className="books-grid" aria-label="Vitrine de livros em destaque">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={(item) => setFeedback(`Visualizando detalhes de "${item.title}".`)}
                onBuy={(item) => setFeedback(`"${item.title}" adicionado para compra.`)}
              />
            ))}
          </section>
        )}
      </section>

      {feedback && (
        <aside className="home-toast" aria-live="polite">
          <p>{feedback}</p>
          <button type="button" onClick={() => setFeedback('')}>
            Fechar
          </button>
        </aside>
      )}
    </main>
  );
}

export default Home;