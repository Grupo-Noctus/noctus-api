# Padrão de Branches e Commits

Este documento descreve os padrões de **branches** e **mensagens de commit** a serem seguidos em nosso projeto, com ênfase nos prefixos utilizados para cada tipo de alteração. 🚀

## Prefixos de Commit 🔧

### 1. **feat**: Novas Funcionalidades ✨
- **Uso**: Utilizado para o desenvolvimento de novas funcionalidades.
- **Exemplo**:
  - `feat: adicionar tela de login`
  - `feat: integrar sistema de pagamentos`

### 2. **fix**: Correções de Bugs 🐞
- **Uso**: Utilizado para corrigir problemas no código ou bugs identificados.
- **Exemplo**:
  - `fix: corrigir erro de validação no formulário`
  - `fix: corrigir falha na autenticação de usuários`

### 3. **docs**: Documentação 📚
- **Uso**: Utilizado para alterações e atualizações na documentação do projeto, como README, guias e manuais.
- **Exemplo**:
  - `docs: atualizar README com informações de configuração`
  - `docs: adicionar instruções para ambiente de desenvolvimento`

### 4. **chore**: Tarefas Gerais e Configurações do Projeto 🛠️
- **Uso**: Utilizado para mudanças no ambiente de desenvolvimento ou configuração do projeto, como atualização de dependências, ajustes em CI/CD, entre outros.
- **Exemplo**:
  - `chore: atualizar dependências`
  - `chore: ajustar configuração do Dockerfile`

### 5. **perf**: Melhorias de Performance ⚡
- **Uso**: Utilizado para otimizações de desempenho no código.
- **Exemplo**:
  - `perf: otimizar consulta no banco de dados`
  - `perf: reduzir tempo de resposta da API`

### 6. **style**: Alterações de Estilo (sem alteração funcional) 🎨
- **Uso**: Utilizado para ajustes no estilo do código, como formatação, espaçamento e adição de ponto e vírgula, sem impactar a lógica do código.
- **Exemplo**:
  - `style: corrigir indentação no arquivo de configuração`
  - `style: remover espaços em branco extras`

### 7. **refactor**: Refatoração de Código 🔄
- **Uso**: Utilizado quando o código é reescrito ou reorganizado para melhorar a legibilidade ou estrutura, sem mudar o comportamento.
- **Exemplo**:
  - `refactor: refatorar função de login`
  - `refactor: reorganizar estrutura de pastas do projeto`

### 8. **test**: Testes 🧪
- **Uso**: Utilizado para adicionar ou alterar testes, sejam testes unitários, de integração, etc.
- **Exemplo**:
  - `test: adicionar testes para a API de autenticação`
  - `test: corrigir testes de integração`

### 9. **hotfix**: Correções Urgentes 🚑
- **Uso**: Utilizado para correções rápidas e urgentes, geralmente aplicadas diretamente em produção.
- **Exemplo**:
  - `hotfix: corrigir erro crítico no login de usuários`
  - `hotfix: corrigir falha no sistema de pagamentos em produção`

### 10. **config**: Configuração do Projeto ⚙️
- **Uso**: Utilizado para mudanças nas configurações do projeto, como arquivos de configuração, ajustes em ferramentas de build, infraestrutura e variáveis de ambiente.
- **Exemplo**:
  - `config: atualizar variáveis de ambiente para produção`
  - `config: adicionar script de build para frontend`

### 11. **build**: Alterações no Sistema de Build 🏗️
- **Uso**: Utilizado para alterações nos arquivos de build, como ajustes no Webpack, Gulp, ou configurações relacionadas à compilação.
- **Exemplo**:
  - `build: ajustar configuração do Webpack para produção`
  - `build: adicionar suporte a novos arquivos no processo de build`

### 12. **release**: Preparação de Versão 🎉
- **Uso**: Utilizado quando você está preparando uma nova versão do código para ser liberada.
- **Exemplo**:
  - `release: versão 1.0.0`
  - `release: versão 2.0.0`

---

## Padrão de Branches 🌿

Além dos commits, as branches devem seguir os seguintes padrões para garantir consistência.

### 1. **Branches Principais** 🌟
   - **`main`**: A branch principal contendo a versão de produção do código.
   - **`develop`**: A branch de integração onde as novas funcionalidades são mescladas antes de serem lançadas.

### 2. **Branches de Funcionalidade (Feature) 🚀**
   - **Formato**: `feature/nome-da-feature`
   - **Uso**: Para o desenvolvimento de novas funcionalidades.
   - **Exemplo**:
     - `feature/criar-pagina-de-login`

### 3. **Branches de Correção de Bug 🐞**
   - **Formato**: `bugfix/nome-do-bug`
   - **Uso**: Para correção de bugs.
   - **Exemplo**:
     - `bugfix/corrigir-erro-no-login`

### 4. **Branches de Hotfix 🚑**
   - **Formato**: `hotfix/nome-do-hotfix`
   - **Uso**: Para correções urgentes diretamente em produção.
   - **Exemplo**:
     - `hotfix/corrigir-erro-de-pagamento-em-producao`

### 5. **Branches de Configuração do Projeto ⚙️**
   - **Formato**: `config/nome-da-configuracao`
   - **Uso**: Para mudanças nas configurações do projeto.
   - **Exemplo**:
     - `config/ajustes-no-dockerfile`

### 6. **Branches de Documentação 📚**
   - **Formato**: `docs/nome-da-documentacao`
   - **Uso**: Para mudanças ou melhorias na documentação do projeto.
   - **Exemplo**:
     - `docs/atualizar-readme`
     - `docs/adicionar-guia-de-configuracao`

### 7. **Branches de Release 🎉**
   - **Formato**: `release/versao`
   - **Uso**: Para preparar e testar novas versões antes de liberá-las.
   - **Exemplo**:
     - `release/1.0.0`

