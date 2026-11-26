import type { BookDetails } from '../components/BookCover/BookCover';

const paymentDemoBook: BookDetails = {
  id: 'payment-demo-book',
  title: 'O Jardim das Histórias',
  description: 'Um livro de demonstração para testar o fluxo do modal de pagamento.',
  price: 89.9,
  discount: 20,
};

export function getPaymentDemoBook(): BookDetails | undefined {
  if (process.env.NODE_ENV !== 'development') {
    return undefined;
  }

  const isPaymentDemo =
    new URLSearchParams(window.location.search).get('demo') === 'payment';

  return isPaymentDemo ? paymentDemoBook : undefined;
}
