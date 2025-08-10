# 🏗️ Arquitetura do MyDrugs Backend

## Visão Geral

O MyDrugs Backend foi desenvolvido seguindo princípios de **Clean Architecture** e **SOLID**, organizando o código em camadas bem definidas para facilitar manutenção, testes e escalabilidade.

## 📐 Padrão Arquitetural

### Arquitetura em Camadas (Layered Architecture)

```
┌─────────────────────────────────────┐
│           Presentation Layer        │ ← Controllers & Routes
├─────────────────────────────────────┤
│           Business Layer            │ ← Services
├─────────────────────────────────────┤
│           Data Access Layer         │ ← Repositories
├─────────────────────────────────────┤
│           Database Layer            │ ← Prisma + PostgreSQL
└─────────────────────────────────────┘
```

## 🎯 Responsabilidades de Cada Camada

### 1. Presentation Layer (Controllers & Routes)

**Responsabilidades:**
- Receber requisições HTTP
- Validar dados de entrada
- Chamar serviços apropriados
- Retornar respostas HTTP
- Tratar erros de apresentação

**Arquivos:**
- `src/Controllers/UserController.ts`
- `src/Routes/userRoutes.ts`

**Exemplo:**
```typescript
export class UserController {
  async register(req: Request, res: Response) {
    try {
      const data = createUserSchema.parse(req.body); // Validação
      const result = await userService.register(data); // Chama service
      res.status(201).json(result); // Retorna resposta
    } catch (error: any) {
      res.status(400).json({ error: error.message }); // Trata erro
    }
  }
}
```

### 2. Business Layer (Services)

**Responsabilidades:**
- Implementar regras de negócio
- Orquestrar operações complexas
- Validar lógica de negócio
- Interagir com múltiplos repositories

**Arquivos:**
- `src/Services/UserServices.ts`

**Exemplo:**
```typescript
export class UserService {
  async register(data: CreateUserDTO) {
    // Regra de negócio: verificar se email já existe
    const existing = await this.repo.findUserByEmail(data.email);
    if (existing) throw new Error('Email já cadastrado');

    // Regra de negócio: criptografar senha
    const hashedPassword = await bcrypt.hash(data.password, 8);

    // Criar usuário
    const newUser = { /* ... */ };
    await this.repo.save(newUser);
    
    return { message: 'Usuário cadastrado com sucesso' };
  }
}
```

### 3. Data Access Layer (Repositories)

**Responsabilidades:**
- Abstrair acesso a dados
- Implementar operações CRUD
- Gerenciar conexões com banco
- Isolar lógica de persistência

**Arquivos:**
- `src/Repositories/UserRepository.ts`

**Exemplo:**
```typescript
export class UserRepository {
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async save(user: UserData) {
    return await prisma.user.create({ data: user });
  }
}
```

### 4. Database Layer (Prisma + PostgreSQL)

**Responsabilidades:**
- Definir schema do banco
- Gerenciar migrações
- Fornecer ORM
- Otimizar queries

**Arquivos:**
- `prisma/schema.prisma`
- `prisma/migrations/`

## 🔄 Fluxo de Dados

### Registro de Usuário
```
1. Request → Routes → Controller
2. Controller → Schema Validation (Zod)
3. Controller → Service
4. Service → Repository
5. Repository → Prisma → PostgreSQL
6. Response ← Controller ← Service ← Repository
```

### Login de Usuário
```
1. Request → Routes → Controller
2. Controller → Schema Validation (Zod)
3. Controller → Service
4. Service → Repository (buscar usuário)
5. Service → bcrypt (comparar senhas)
6. Service → JWT (gerar token)
7. Response ← Controller ← Service
```

## 🛡️ Segurança

### Autenticação JWT
- **Geração**: Token criado no login com payload do usuário
- **Expiração**: 1 hora
- **Secret**: Chave secreta para assinatura
- **Uso**: Enviado no header Authorization

### Criptografia de Senhas
- **Algoritmo**: bcryptjs
- **Salt Rounds**: 8
- **Armazenamento**: Hash no banco de dados
- **Verificação**: Comparação com hash armazenado

### Validação de Dados
- **Biblioteca**: Zod
- **Campos validados**: name, email, password, confirmPassword
- **Regras**: formato de email, tamanho mínimo, confirmação de senha

## 📊 Modelo de Dados

### Entidade User
```typescript
interface User {
  id: string;           // UUID gerado automaticamente
  name: string;         // Nome do usuário (min 4 chars)
  email: string;        // Email único
  password: string;     // Hash da senha
  createdAt: Date;      // Timestamp de criação
}
```

### Schema Prisma
```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

## 🎨 Padrões de Projeto Utilizados

### 1. Repository Pattern
- **Objetivo**: Abstrair acesso a dados
- **Benefícios**: Facilita testes, troca de implementação
- **Implementação**: Classe UserRepository

### 2. Service Layer Pattern
- **Objetivo**: Centralizar lógica de negócio
- **Benefícios**: Reutilização, manutenibilidade
- **Implementação**: Classe UserService

### 3. Dependency Injection
- **Objetivo**: Reduzir acoplamento
- **Benefícios**: Testabilidade, flexibilidade
- **Implementação**: Injeção de Repository no Service

### 4. Data Transfer Objects (DTOs)
- **Objetivo**: Transferir dados entre camadas
- **Benefícios**: Tipagem, validação
- **Implementação**: CreateUserDTO, LoginDTO

## 🔧 Configurações

### Express.js
- **CORS**: Habilitado para desenvolvimento
- **JSON Parser**: Para requisições JSON
- **Porta**: 3333

### Prisma
- **Provider**: PostgreSQL
- **Migrations**: Automáticas
- **Client**: Gerado automaticamente

### TypeScript
- **Target**: ES2020
- **Module**: CommonJS
- **Strict**: true

## 🚀 Escalabilidade

### Pontos de Melhoria
1. **Middleware de Autenticação**: Para proteger rotas
2. **Rate Limiting**: Para prevenir abuso
3. **Logging**: Para monitoramento
4. **Cache**: Para melhorar performance
5. **Testes**: Unitários e integração
6. **Documentação**: Swagger/OpenAPI

### Estrutura Futura
```
src/
├── middlewares/          # Middlewares customizados
├── config/              # Configurações
├── types/               # Tipos TypeScript
├── tests/               # Testes
├── logs/                # Logs da aplicação
└── docs/                # Documentação
```

## 📚 Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practices-performance.html)
