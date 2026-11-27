import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../api/api';
import BannerCta from '../components/BannerCta';
import BookCard, { type Book } from '../components/BookCard';
import './Home.css';

type ProductDict = {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  contentUrl?: string | null;
  discount?: number;
  imageUrl?: string | null;
};

type HomeProps = {
  onOpenAuth?: () => void;
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

function Home({ onOpenAuth }: HomeProps) {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(apiUrl('/product'));

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
          setError('Não foi possível carregar os livros da API. Verifique se ela está ativa.');
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
      <BannerCta onActionClick={onOpenAuth} />

      <section className="featured-section" aria-labelledby="featured-heading">
        <header className="section-header">
          <h1 id="featured-heading" className="section-title">
            Livros em destaque
          </h1>

          <Link to="/explorar?tab=livros" className="section-more">
            Ver mais <span aria-hidden="true">›</span>
          </Link>
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
                onSelect={(item) => navigate(`/books/${encodeURIComponent(item.id)}`)}
              />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default Home;