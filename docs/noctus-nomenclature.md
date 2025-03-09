# Nomenclatura

## Variáveis

Por padrão, camelCase.

Exemplo:

typescript
let minhaVariavel = 10;


Existem variáveis que são consideradas constantes no sistema que usam o UPPER_SNAKE_CASE (SCREAMING_SNAKE_CASE).

Exemplo:

typescript
const OPEN_AI_KEY = 'sua-chave-aqui'; // Carregada dinamicamente no início da aplicação através de um select no banco


## Funções

Por padrão, camelCase.

Exemplo:

typescript
function minhaFuncao() {
    // código aqui
}


## Classes

Por padrão, PascalCase.

Exemplo:

typescript
class MinhaClasse {
    // código aqui
}


## Tipagem

### Uso de type

Por padrão, é colocado a letra T em maiúsculo como prefixo.

Exemplo:

typescript
type TWorkspaceProjects = {
    id: number;
    name: string;
    description?: string;
};


### Uso de interface

Por padrão, é colocado a letra I em maiúsculo como prefixo.

Exemplo:

typescript
interface IProjects {
    id: number;
    name: string;
    description?: string;
}


## Pastas

Por padrão, é usado o kebab-case.

Exemplo:


customer-support


## Arquivos

Por padrão, é usado o kebab-case.

Exemplo:


customer-support.module.ts


## Estrutura e Formatação de Código

Fica a cargo da configuração padrão do lint, editor config e prettier no projeto.

Links para instalar as extensões.

https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

## Organização de Pastas e Arquivos

É tomado como base o padrão do NestJS.


|src
 \
   |novo-modulo
    \
     |controllers
     \
        |exemplo.controller.ts
     |dto
     \
        |input
        \
         |request-exemplo.dto.ts
        |output
        \
         |response-exemplo.dto.ts
     |entities
     \
        |exemplo.entity.ts
     |services
        \
         |exemplo.service.ts
     |novo-modulo.module.ts
     |...
|...


## Comentários

-   Usar comentários para explicar o porquê, e não o como do código.
-   Evitar comentários excessivos, apenas comente quando for adicionar valor.
-   Usar comentários no idioma inglês.

## Boas Práticas

### Imports

Manter uma organização clara dos imports:

-   Bibliotecas externas primeiro.
-   Imports locais por último, organizados alfabeticamente.

### Funções e Métodos

Funções devem ter no máximo 50-70 linhas. Caso contrário, considere dividi-las.
Nome de função deve indicar claramente o que ela faz.

Exemplo:

typescript
function getUserProfile() {
    // código aqui
}

### Reuso de Código

Evitar duplicação de código. Sempre buscar reutilizar funções e componentes já existentes.

### Espaçamento

Inserir uma linha em branco entre blocos de código ou entre métodos de uma classe para melhorar a legibilidade.