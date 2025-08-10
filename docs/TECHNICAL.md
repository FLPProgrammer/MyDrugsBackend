# 🔧 Documentação Técnica - MyDrugs Backend

## Visão Geral Técnica

Este documento fornece detalhes técnicos sobre a implementação, configurações e decisões arquiteturais do projeto MyDrugs Backend.

## 🛠️ Stack Tecnológica

### Core Technologies
- **Node.js** v18+ - Runtime JavaScript
- **TypeScript** v5.8+ - Linguagem de programação
- **Express.js** v5.1+ - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Prisma** v6.7+ - ORM moderno

### Dependencies Principais
```json
{
  "@prisma/client": "^6.7.0",
  "bcryptjs": "^3.0.2",
  "cors": "^2.8.5",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "zod": "^3.24.3"
}
```

### Dev Dependencies
```json
{
  "@types/bcrypt": "^5.0.2",
  "@types/cors": "^2.8.17",
  "@types/express": "^5.0.1",
  "@types/jsonwebtoken": "^9.0.9",
  "@types/node": "^22.15.3",
  "prisma": "^6.7.0",
  "ts-node-dev": "^2.0.0",
  "typescript": "^5.8.3"
}
```

## 📁 Estrutura de Arquivos Detalhada

```
MyDrugs Backend/
├── prisma/
│   ├── migrations/
│   │   └── 20250430152300_init/
│   │       └── migration.sql
│   ├── migration_lock.toml
│   └── schema.prisma
├── src/
│   ├── Controllers/
│   │   └── UserController.ts          # Controlador de usuários
│   ├── Services/
│   │   └── UserServices.ts            # Lógica de negócio
│   ├── Repositories/
│   │   └── UserRepository.ts          # Acesso a dados
│   ├── Routes/
│   │   └── userRoutes.ts              # Definição de rotas
│   ├── Schemas/
│   │   └── userSchema.ts              # Validação com Zod
│   ├── Utils/
│   │   └── generateToken.ts           # Geração de JWT
│   └── Server.ts                      # Configuração do servidor
├── docs/
│   ├── ARCHITECTURE.md                # Documentação da arquitetura
│   ├── INSPIRATION.md                 # Inspiração da série
│   └── TECHNICAL.md                   # Este arquivo
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## 🔧 Configurações

### TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Prisma (schema.prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

## 🚀 Scripts de Desenvolvimento

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### Prisma Scripts
```bash
npx prisma generate    # Gera o cliente Prisma
npx prisma migrate dev # Executa migrações
npx prisma studio     # Abre interface visual do banco
npx prisma db push    # Sincroniza schema com banco
```

## 🔐 Implementação de Segurança

### JWT (JSON Web Tokens)
```typescript
// src/Utils/generateToken.ts
import jwt from 'jsonwebtoken';

export function generateToken(payload: object) {
  return jwt.sign(payload, 'secretMyDrugs', { expiresIn: '1h' });
}
```

**Configurações:**
- **Algorithm**: HS256 (padrão)
- **Expiration**: 1 hora
- **Secret**: 'secretMyDrugs' (deve ser movido para variável de ambiente)

### Criptografia de Senhas
```typescript
// src/Services/UserServices.ts
import bcrypt from 'bcryptjs';

// Hash da senha
const hashedPassword = await bcrypt.hash(data.password, 8);

// Verificação da senha
const isPasswordValid = await bcrypt.compare(data.password, user.password);
```

**Configurações:**
- **Algorithm**: bcrypt
- **Salt Rounds**: 8
- **Library**: bcryptjs (versão JavaScript pura)

### Validação de Dados
```typescript
// src/Schemas/userSchema.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(4, "Your name must be at least 4 characters long"),
  email: z.string().email("Invalid email address!"),
  password: z.string().min(6, "Your password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Your password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
```

## 📊 Modelo de Dados

### Entidade User
```typescript
interface User {
  id: string;           // UUID v4
  name: string;         // Nome completo
  email: string;        // Email único
  password: string;     // Hash bcrypt
  createdAt: Date;      // Timestamp ISO
}
```

### DTOs (Data Transfer Objects)
```typescript
interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
}
```

## 🔄 Fluxo de Dados Detalhado

### Registro de Usuário
```mermaid
sequenceDiagram
    participant C as Client
    participant R as Routes
    participant CT as Controller
    participant S as Service
    participant REP as Repository
    participant DB as Database

    C->>R: POST /users/register
    R->>CT: register(req, res)
    CT->>CT: validate data (Zod)
    CT->>S: register(data)
    S->>S: check if email exists
    S->>S: hash password (bcrypt)
    S->>REP: save(user)
    REP->>DB: INSERT INTO users
    DB-->>REP: user created
    REP-->>S: user data
    S-->>CT: success message
    CT-->>R: 201 response
    R-->>C: JSON response
```

### Login de Usuário
```mermaid
sequenceDiagram
    participant C as Client
    participant R as Routes
    participant CT as Controller
    participant S as Service
    participant REP as Repository
    participant DB as Database

    C->>R: POST /users/login
    R->>CT: login(req, res)
    CT->>CT: validate data (Zod)
    CT->>S: login(data)
    S->>REP: findUserByEmail(email)
    REP->>DB: SELECT * FROM users
    DB-->>REP: user data
    REP-->>S: user or null
    S->>S: compare passwords (bcrypt)
    S->>S: generate JWT token
    S-->>CT: {token, user}
    CT-->>R: 200 response
    R-->>C: JSON response
```

## 🧪 Testes (Planejados)

### Estrutura de Testes
```
src/
├── tests/
│   ├── unit/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   └── Repositories/
│   ├── integration/
│   │   └── api/
│   └── e2e/
└── __mocks__/
```

### Ferramentas de Teste (Recomendadas)
- **Jest** - Framework de testes
- **Supertest** - Testes de API
- **@types/jest** - Tipos TypeScript
- **ts-jest** - Suporte TypeScript

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mydrugs_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Server
PORT=3333
NODE_ENV=development

# Logging
LOG_LEVEL=info
```

### Configuração do Banco
```sql
-- Criar banco de dados
CREATE DATABASE mydrugs_db;

-- Criar usuário (opcional)
CREATE USER mydrugs_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mydrugs_db TO mydrugs_user;
```

## 🚀 Deploy

### Produção
```bash
# Build do projeto
npm run build

# Instalar dependências de produção
npm ci --only=production

# Executar migrações
npx prisma migrate deploy

# Iniciar servidor
npm start
```

### Docker (Recomendado)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3333

CMD ["npm", "start"]
```

## 📈 Monitoramento e Logs

### Logs Estruturados
```typescript
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
}
```

### Métricas Importantes
- **Response Time**: Tempo de resposta das APIs
- **Error Rate**: Taxa de erros
- **User Registration**: Novos usuários
- **Login Success Rate**: Taxa de sucesso no login
- **Database Connections**: Conexões ativas

## 🔒 Segurança Avançada

### Implementações Futuras
1. **Rate Limiting**
   ```typescript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 100 // limite por IP
   });
   ```

2. **Helmet.js**
   ```typescript
   import helmet from 'helmet';
   app.use(helmet());
   ```

3. **CORS Configurado**
   ```typescript
   app.use(cors({
     origin: ['http://localhost:3000'],
     credentials: true
   }));
   ```

4. **Input Sanitization**
   ```typescript
   import xss from 'xss-clean';
   app.use(xss());
   ```

## 📚 Referências Técnicas

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT.io](https://jwt.io/)
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js/)
- [Zod Documentation](https://zod.dev/)

## 🎯 Próximos Passos

1. **Implementar Testes**
   - Unit tests para Services
   - Integration tests para APIs
   - E2E tests para fluxos completos

2. **Melhorar Segurança**
   - Rate limiting
   - Input sanitization
   - Security headers

3. **Adicionar Funcionalidades**
   - Refresh tokens
   - Password reset
   - User profile management

4. **Otimizações**
   - Caching (Redis)
   - Database indexing
   - Query optimization

5. **Monitoramento**
   - Application logging
   - Performance metrics
   - Error tracking
