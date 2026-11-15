import { AuthenticatedUserOutput } from
  '../../../application/modules/auth/use-cases/authenticate-access-token.use-case';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserOutput;
    }
  }
}

export {};