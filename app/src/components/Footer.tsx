import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <section className="footer-content" aria-label="Informações do rodapé">
        <p className="footer-brand">Ornitolivros</p>

        <nav className="footer-nav" aria-label="Navegação do rodapé">
          <ul className="footer-list">
            <li>
              <Link to="/quem-somos">Quem somos</Link>
            </li>
            <li>
              <Link to="/termos">Termos de uso</Link>
            </li>
            <li>
              <Link to="/privacidade">Privacidade</Link>
            </li>
          </ul>
        </nav>
      </section>

      <p className="footer-copy">
        © {new Date().getFullYear()} Todos os direitos reservados.
      </p>
    </footer>
  );
}

export default Footer;