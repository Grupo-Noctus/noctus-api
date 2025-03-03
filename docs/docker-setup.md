# 🐳 Instalação e Gerenciamento do Docker no WSL  

Este guia contém os passos para instalar o **Docker CLI** no **WSL 2**, além dos comandos essenciais para gerenciar o serviço do Docker.  

## 📥 Instalando os Programas

### 🔹 1. Instalar o WSL
```cmd
wsl --install
```

#### 📌 Obs.: Reinicie o PC após a instalação.

Para verificar se o WSL 2 foi instalado corretamente:
```cmd
wsl --list --verbose
```

Caso o WSL 2 não tenha sido instalado, atualize a distribuição:
```cmd
wsl --set-version Ubuntu 2
```

### 🐳 2. Instalar o Docker CLI dentro do WSL
```wsl
sudo apt update
sudo apt install -y docker.io
```

## 🔑 Configuração de Permissões

Adicione seu usuário ao grupo docker para rodar comandos sem sudo:
```wsl
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

Verifique se o Docker está funcionando sem sudo:
```wsl
docker --version
```

## ⚙️ Gerenciamento do Docker

### ▶️ Iniciar o Docker:
```wsl
sudo service docker start
```

### 🔄 Iniciar o Docker automaticamente ao abrir o WSL (opcional):
```wsl
sudo service docker start > /dev/null 2>&1
```

### ⏹ Parar o Docker:
```wsl
sudo service docker stop
```

### 🔄 Reiniciar o Docker:
```wsl
sudo service docker restart
```

### 🔹 Instalar o Docker Compose
```wsl
sudo apt install -y docker-compose
```

## ✅ Testando a Instalação
```wsl
docker run hello-world
```

## 🛢 Conexão com o DBeaver

Para conectar o DBeaver ao banco de dados no WSL, siga os passos abaixo:

### 1. Obter o IP do WSL
Execute o comando abaixo para encontrar o IP do WSL:
```wsl
ip addr show eth0
```
O IP estará no campo `inet`, por exemplo: `inet 172.31.216.21`.

### 2. Configuração no DBeaver
- **Host:** Use o IP obtido no passo anterior.
- **Porta:** Utilize a porta padrão do mysql `3306`.
- **Banco de dados:** No arquivo `.env` inserir o valor de `DB_NAME`.
- **Usuário:** No arquivo `.env` inserir o valor de `DB_USER_ROOT`.
- **Senha:** No arquivo `.env` inserir o valor de `MYSQL_ROOT_PASSWORD`.

Agora o DBeaver estará configurado para se conectar ao banco de dados dentro do WSL. 🚀
