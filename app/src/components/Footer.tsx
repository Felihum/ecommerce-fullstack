import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <section className="footer-content" aria-label="Informações do rodapé">
        <p className="footer-brand">Livraria Digital</p>

        <nav className="footer-nav" aria-label="Navegação do rodapé">
          <ul className="footer-list">
            <li><a href="#quem-somos">Quem somos</a></li>
            <li><a href="#termos">Termos de uso</a></li>
            <li><a href="#privacidade">Privacidade</a></li>
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