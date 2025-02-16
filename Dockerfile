# Usa a versão estável do Node.js
FROM node:latest

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (se houver)
COPY package*.json ./

# Instala as dependências
RUN npm install --force

# Copia o restante da aplicação
COPY . .

# Expõe a porta que a aplicação usará
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
