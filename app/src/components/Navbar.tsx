import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';
import './Navbar.css';

type NavbarProps = {
  onOpenAuth: () => void;
};

function Navbar({ onOpenAuth }: NavbarProps) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand" aria-label="Página inicial">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>

        <div className="navbar-search">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar título ou autor..."
            aria-label="Buscar livros"
          />
        </div>
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
              <button type="button" className="dropdown-item">
                Livros
              </button>
              <button type="button" className="dropdown-item">
                Autores
              </button>
              <button type="button" className="dropdown-item">
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