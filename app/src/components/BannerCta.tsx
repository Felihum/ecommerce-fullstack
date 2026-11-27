import React from 'react';
import './BannerCta.css';

type BannerCtaProps = {
  onActionClick?: () => void;
};

function BannerCta({ onActionClick }: BannerCtaProps) {
  return (
    <section className="promo-banner" aria-label="Convite da Ornitolivros">
      <div className="promo-banner__inner">
        <div className="promo-banner__icon" aria-hidden="true">
          📚
        </div>

        <div className="promo-banner__text">
          <h2 className="promo-banner__title">
            A sua livraria digital para descobrir novas leituras
          </h2>
          <p className="promo-banner__subtitle">
            Na Ornitolivros você encontra obras selecionadas, acompanha suas
            aquisições e monta sua biblioteca digital com facilidade.
          </p>
        </div>

        <button
          type="button"
          className="promo-banner__btn"
          onClick={onActionClick}
        >
          Criar minha conta
        </button>
      </div>
    </section>
  );
}

export default BannerCta;