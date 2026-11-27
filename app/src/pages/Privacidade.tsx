import React from 'react';
import './FooterPages.css';

function Privacidade() {
  return (
    <main className="institutional-page">
      <article>
        <h1>Política de Privacidade</h1>
        <p>
          A sua privacidade é prioridade para a Ornitolivros. Este
          documento explica como coletamos, utilizamos e protegemos as suas
          informações pessoais em conformidade com a Lei Geral de Proteção de
          Dados (LGPD).
        </p>

        <h2>1. Dados Coletados</h2>
        <p>
          Coletamos apenas os dados necessários para o funcionamento da
          plataforma, como nome, e-mail, informações de autenticação e histórico
          de pedidos realizados na loja.
        </p>

        <h2>2. Finalidade do Uso dos Dados</h2>
        <p>
          As informações coletadas são utilizadas para criar e gerenciar sua
          conta, processar pagamentos, liberar o acesso aos livros digitais
          adquiridos e oferecer suporte ao cliente quando solicitado.
        </p>

        <h2>3. Compartilhamento e Segurança</h2>
        <p>
          Não comercializamos seus dados pessoais. O compartilhamento ocorre
          apenas com parceiros essenciais para a operação, como processadores de
          pagamento, sempre sob medidas técnicas de segurança e sigilo.
        </p>

        <h2>4. Seus Direitos</h2>
        <p>
          Você pode solicitar a consulta, correção ou exclusão dos seus dados
          pessoais a qualquer momento através dos nossos canais de atendimento.
        </p>
      </article>
    </main>
  );
}

export default Privacidade;