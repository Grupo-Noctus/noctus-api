# Etapa 1: Imagem base (Node 22.14.0)
FROM node:22.14.0-alpine AS builder

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json e o package-lock.json para o container
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código da aplicação para o container
COPY . .

# Construir o projeto
RUN npm run build

# Etapa 2: Imagem de produção (Node 22.14.0)
FROM node:22.14.0-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos necessários da etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./


# Expor a porta 3000 para acesso externo
EXPOSE 3000

# Comando para rodar o app
CMD ["node", "dist/main"]