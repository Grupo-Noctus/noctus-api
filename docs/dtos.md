# 📄 DTOs e Validações - Padrões do Projeto

## 🎯 Objetivo
Definir diretrizes claras para a criação e validação de DTOs (Data Transfer Objects), assegurando consistência, clareza de mensagens e segurança dos dados trafegados pela API NestJS.

---

## 📦 Estrutura de Diretórios

```bash
src/
└── modules/
    └── user/
        ├── dto/
        │   ├── user-register.dto.ts
        │   └── login-request.dto.ts
        └── entities/
        └── controllers/
        └── services/
```

> 📌 **Regra:** Cada módulo deve conter seu próprio diretório `dto` com todos os Data Transfer Objects.

---

## 🛡️ Validações obrigatórias

Utilizar `class-validator` e `class-transformer` em todos os campos.

### ✅ Regras padrão

| Regra                  | Decorator                                 | Exemplo                                                                 |
|------------------------|--------------------------------------------|-------------------------------------------------------------------------|
| Campo obrigatório      | `@IsNotEmpty()`                             | `@IsNotEmpty({ message: 'Field is required.' })`                        |
| Tipo texto             | `@IsString()`                              | `@IsString({ message: 'Field must be a string.' })`                     |
| Email válido           | `@IsEmail()`                               | `@IsEmail({}, { message: 'Invalid email format.' })`                   |
| Enum                   | `@IsEnum(Enum)`                            | `@IsEnum(Gender, { message: 'Invalid gender option.' })`               |
| Booleano               | `@IsBoolean()`                             | `@IsBoolean({ message: 'Must be a boolean value.' })`                  |
| URL                    | `@IsUrl()`                                 | `@IsUrl(undefined, { message: 'Invalid URL format.' })`                |
| Mínimo de caracteres   | `@MinLength(n)`                            | `@MinLength(6, { message: 'Password must be at least 6 characters.' })` |
| Regex personalizado    | `@Matches(regex)`                          | `@Matches(/^[a-zA-Z0-9._]{3,}$/)`                                       |

---

## 💬 Mensagens de Erro

- Sempre usar mensagens personalizadas em **inglês**.
- Mensagens devem ser objetivas e legíveis.
- Nunca exibir detalhes que possam expor informações sensíveis ou lógicas de banco.


## 🔁 DTOs compostos

Utilizar `@ValidateNested()` e `@Type(() => Classe)` para campos aninhados.

### Exemplo:
```ts
export class RegisterDto {
  @ApiProperty({ type: () => UserRegisterDto })
  @ValidateNested()
  @Type(() => UserRegisterDto)
  user: UserRegisterDto;

  @ApiPropertyOptional({ type: () => StudentRegisterDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => StudentRegisterDto)
  student?: StudentRegisterDto;
}
```

---

## 🔧 Extras

- Prefixo `Dto` no nome da classe é **obrigatório**.
- Todos os campos devem ser documentados com `@ApiProperty` ou `@ApiPropertyOptional`.
- DTOs devem estar prontos para uso com Swagger (`@nestjs/swagger`).

---

## 📚 DTOs no Projeto

- `LoginRequestDto`
- `UserRegisterDto`
- `StudentRegisterDto`
- `RegisterDto` (composto)


