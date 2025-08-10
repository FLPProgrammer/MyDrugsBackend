# 🚀 MyDrugs Backend

> **⚠️ AVISO IMPORTANTE**: Este projeto é **100% fictício** e foi criado **exclusivamente para fins educacionais**. É inspirado na série "How to Sell Drugs Online (Fast)" da Netflix, mas não tem nenhuma relação com atividades ilegais reais. Todo o código e funcionalidades são para aprendizado de desenvolvimento de software.

## 📖 Sobre o Projeto

O **MyDrugs Backend** é uma API REST desenvolvida em TypeScript que simula um sistema de gerenciamento de usuários para uma plataforma online. O projeto foi criado como um exercício educacional para aprender conceitos avançados de desenvolvimento backend, incluindo:

- Arquitetura em camadas (Layered Architecture)
- Autenticação e autorização com JWT
- Validação de dados com Zod
- ORM com Prisma
- Criptografia de senhas
- Padrões de projeto (Repository Pattern, Service Layer)

### 🎬 Inspiração

Este projeto foi inspirado na série alemã **"How to Sell Drugs Online (Fast)"** da Netflix, que conta a história fictícia de um adolescente que cria uma plataforma online para venda de drogas. A série aborda temas como:

- Empreendedorismo e tecnologia
- Consequências de escolhas
- Crescimento rápido de startups
- Desafios éticos e legais

**Importante**: A série é puramente ficcional e este projeto é apenas um exercício técnico para aprender desenvolvimento de software.

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura em camadas bem definida:

```
src/
├── Controllers/     # Controladores - lidam com requests/responses
├── Services/        # Lógica de negócio
├── Repositories/    # Acesso a dados
├── Routes/          # Definição de rotas
├── Schemas/         # Validação de dados (Zod)
├── Utils/           # Utilitários (JWT, etc.)
└── Server.ts        # Configuração do servidor
```

### 📋 Camadas da Aplicação

1. **Controllers**: Responsáveis por receber requisições HTTP e retornar respostas
2. **Services**: Contêm a lógica de negócio da aplicação
3. **Repositories**: Gerenciam o acesso e manipulação de dados
4. **Routes**: Definem os endpoints da API
5. **Schemas**: Validam dados de entrada usando Zod

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação tipada
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **Zod** - Validação de schemas
- **CORS** - Cross-Origin Resource Sharing

### Ferramentas de Desenvolvimento
- **ts-node-dev** - Execução em desenvolvimento com hot reload
- **Prisma CLI** - Gerenciamento de banco de dados

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 16 ou superior)
- PostgreSQL instalado e configurado
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd MyDrugs-Backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/mydrugs_db"
JWT_SECRET="sua_chave_secreta_aqui"
```

### 4. Execute as migrações do Prisma
```bash
npx prisma migrate dev
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3333`

## 📚 Documentação da API

### Base URL
```
http://localhost:3333
```

### Endpoints

#### 👤 Usuários

##### POST `/users/register`
Registra um novo usuário no sistema.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

**Response (201):**
```json
{
  "message": "Usuário cadastrado com sucesso"
}
```

##### POST `/users/login`
Autentica um usuário e retorna um token JWT.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-do-usuario",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

## 🔐 Segurança

### Autenticação
- Utiliza JWT (JSON Web Tokens) para autenticação
- Tokens expiram em 1 hora
- Senhas são criptografadas usando bcryptjs

### Validação de Dados
- Todos os dados de entrada são validados usando Zod
- Validação de email, senha e confirmação de senha
- Mensagens de erro personalizadas

## 📊 Modelo de Dados

### Tabela: User
```sql
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

## 🧪 Testando a API

### Usando cURL

**Registrar usuário:**
```bash
curl -X POST http://localhost:3333/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@email.com",
    "password": "123456",
    "confirmPassword": "123456"
  }'
```

**Fazer login:**
```bash
curl -X POST http://localhost:3333/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "123456"
  }'
```

### Usando Postman/Insomnia
Importe as seguintes requisições:

1. **Register User**
   - Method: POST
   - URL: `http://localhost:3333/users/register`
   - Body: JSON com name, email, password, confirmPassword

2. **Login User**
   - Method: POST
   - URL: `http://localhost:3333/users/login`
   - Body: JSON com email e password

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor em modo desenvolvimento
npm test            # Executa os testes (não implementado ainda)
npx prisma studio   # Abre o Prisma Studio para visualizar dados
npx prisma generate # Gera o cliente Prisma
npx prisma migrate  # Executa migrações do banco
```

## 📁 Estrutura de Arquivos

```
MyDrugs Backend/
├── prisma/
│   ├── migrations/          # Migrações do banco de dados
│   └── schema.prisma        # Schema do Prisma
├── src/
│   ├── Controllers/         # Controladores da aplicação
│   │   └── UserController.ts
│   ├── Services/            # Lógica de negócio
│   │   └── UserServices.ts
│   ├── Repositories/        # Acesso a dados
│   │   └── UserRepository.ts
│   ├── Routes/              # Definição de rotas
│   │   └── userRoutes.ts
│   ├── Schemas/             # Validação de dados
│   │   └── userSchema.ts
│   ├── Utils/               # Utilitários
│   │   └── generateToken.ts
│   └── Server.ts            # Configuração do servidor
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Funcionalidades Implementadas

- ✅ Registro de usuários
- ✅ Login com autenticação JWT
- ✅ Validação de dados com Zod
- ✅ Criptografia de senhas
- ✅ Arquitetura em camadas
- ✅ Padrão Repository
- ✅ Integração com PostgreSQL via Prisma

## 🚧 Funcionalidades Futuras

- [ ] Middleware de autenticação
- [ ] Refresh tokens
- [ ] Logout
- [ ] Atualização de perfil
- [ ] Recuperação de senha
- [ ] Upload de avatar
- [ ] Logs de auditoria
- [ ] Rate limiting
- [ ] Documentação com Swagger

## 🤝 Contribuindo

Este é um projeto educacional, mas contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## ⚠️ Disclaimer Legal

**Este projeto é puramente educacional e fictício.** Não tem nenhuma relação com atividades ilegais reais. Todo o código foi desenvolvido para fins de aprendizado de desenvolvimento de software. A inspiração na série "How to Sell Drugs Online (Fast)" é apenas temática e não promove ou endossa qualquer atividade ilegal.

## 📞 Contato

Para dúvidas sobre o projeto ou desenvolvimento:

- **Email**: [seu-email@exemplo.com]
- **LinkedIn**: [seu-linkedin]
- **GitHub**: [seu-github]

---

**Desenvolvido com ❤️ para fins educacionais** 