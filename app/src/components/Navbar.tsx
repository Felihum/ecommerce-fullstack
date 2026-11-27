import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../logo.png';
import './Navbar.css';

type NavbarProps = {
  onOpenAuth: () => void;
};

type ExploreTab = 'livros' | 'autores' | 'editoras';

function Navbar({ onOpenAuth }: NavbarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get('q') ?? '');
  }, [searchParams]);

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const currentTab = searchParams.get('tab');
    const validTab: ExploreTab =
      currentTab === 'autores' || currentTab === 'editoras'
        ? currentTab
        : 'livros';

    const params = new URLSearchParams({ tab: validTab });
    const trimmed = search.trim();

    if (trimmed) {
      params.set('q', trimmed);
    }

    setMenuOpen(false);
    navigate(`/explorar?${params.toString()}`);
  }

  function handleSelectCategory(tab: ExploreTab) {
    const params = new URLSearchParams({ tab });
    const trimmed = search.trim();

    if (trimmed) {
      params.set('q', trimmed);
    }

    setMenuOpen(false);
    navigate(`/explorar?${params.toString()}`);
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand" aria-label="Página inicial">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>

        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar título ou autor..."
            aria-label="Buscar livros"
          />
        </form>
      </div>

      <div className="navbar-actions">
        <div className="explore-wrapper">
          <button
            type="button"
            className="explore-btn"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span>Explorar</span>
            <svg
              className={`chevron-icon ${menuOpen ? 'open' : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {menuOpen && (
            <div className="explore-dropdown">
              <button
                type="button"
                className="dropdown-item"
                onClick={() => handleSelectCategory('livros')}
              >
                Livros
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => handleSelectCategory('autores')}
              >
                Autores
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => handleSelectCategory('editoras')}
              >
                Editoras
              </button>
            </div>
          )}
        </div>

        <button type="button" className="login-btn" onClick={onOpenAuth}>
          Entrar
        </button>
      </div>
    </header>
  );
}

export default Navbar;