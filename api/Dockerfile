# ==========================================
# Estágio 1: Instalação e Compilação
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@12.18.0 --activate

# Copia os arquivos de configuração
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instala dependências de desenvolvimento e produção
RUN pnpm install --frozen-lockfile

# Copia o restante do projeto
COPY . .

# Compila o NestJS
RUN pnpm build


# ==========================================
# Estágio 2: Produção
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@12.18.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instala somente dependências de produção
RUN pnpm install --frozen-lockfile --prod

# Copia os arquivos compilados
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]