
# Documentação dos Decorators do Swagger no NestJS

Esta documentação apresenta os principais decorators do pacote `@nestjs/swagger`, utilizados para documentar APIs no NestJS com suporte ao Swagger UI.

---

## 📌 @ApiTags

**Descrição:**  
Agrupa os endpoints de um controller em uma seção específica no Swagger UI.  
É utilizado **acima do controller**.

**Exemplo:**
```ts
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  // ...
}
```

## 📌 @ApiOperation

**Descrição:**
Define um resumo (descrição curta) do que o endpoint faz.
Aparece como título da operação no Swagger UI.

**Exemplo:**

```ts
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  findAll() {
    // ...
  }
}
```
## 📌 @ApiResponse

**Descrição:**
Documenta os possíveis retornos (status code e descrição) que um endpoint pode gerar.

**Exemplo:**

```ts
import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  findOne(@Param('id') id: string) {
    // ...
  }
}
```

## 📌 @ApiProperty

Descrição:
Usado dentro de DTOs para descrever as propriedades da classe.
Ajuda o Swagger a documentar os campos esperados no corpo da requisição/resposta.

Exemplo:

```ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'joao@email.com', description: 'E-mail do usuário' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Senha do usuário' })
  password: string;
}
```

## 📌 @ApiBody

**Descrição:**
Especifica manualmente o corpo da requisição esperada pelo endpoint.
É útil quando se usa múltiplos @Body() ou quando o Swagger não consegue inferir automaticamente.

```ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

  @Post()
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    // ...
  }
}
```

## 📦 Importações

Todos os decorators estão disponíveis no pacote @nestjs/swagger:

```ts
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiBody
} from '@nestjs/swagger';
```

📥 Instalação do Swagger no projeto NestJS
Execute o comando abaixo para instalar os pacotes necessários:


```cmd
npm install --save @nestjs/swagger
```

Caso falhe use esse comando para forçar a instalação
```cmd
npm install --save @nestjs/swagge --force
```
Iniciar o projeto

iniciar o prisma e o projeto
```cmd
npx prisma db push 
```

```cmd
-npm run start:dev
```

Após iniciar o projeto vá para a porta 3000 do swagger
```cmd
http://localhost:3000/api
```
