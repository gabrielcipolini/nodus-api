# 📋 Gerenciador de Tarefas - API

API para gerenciamento de tarefas e equipes, com autenticação por JWT, controle de permissões e estrutura pensada para escalar. Usuários podem criar contas, formar times, atribuir tarefas e acompanhar o progresso.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** com **Express.js**
- **TypeScript**
- **PostgreSQL** com **Prisma ORM**
- **Docker**
- **Zod** para validação de dados
- **JWT** para autenticação
- **Jest** para testes
- **Render** para deploy

---

## 🔐 Autenticação e Autorização

- Registro e login de usuários
- Autenticação via **JWT**
- Controle de acesso baseado em **roles**:
  - `admin`: pode gerenciar usuários, times e tarefas
  - `member`: pode gerenciar apenas as tarefas atribuídas

---

## 🚩 Gerenciamento de Times

- Apenas **admins** podem:
  - Criar e editar times
  - Adicionar ou remover membros

---

## ✅ Funcionalidades das Tarefas

- **CRUD** de tarefas
- Status:
  - `pending`
  - `in_progress`
  - `completed`
- Prioridades:
  - `high`
  - `medium`
  - `low`
- Atribuição de tarefas a membros específicos
- Visualização por usuários de acordo com o time

---

## 🗃️ Estrutura do Banco de Dados

### `users`

| Campo       | Tipo                | Descrição                        |
|-------------|---------------------|----------------------------------|
| id          | INTEGER             | Identificador único (PK)        |
| name        | VARCHAR(100)        | Nome do usuário                  |
| email       | VARCHAR(150)        | E-mail (único)                   |
| password    | VARCHAR(255)        | Senha criptografada              |
| role        | ENUM('admin','member') | Nível de acesso              |
| created_at  | TIMESTAMP           | Data de criação                  |
| updated_at  | TIMESTAMP           | Última atualização               |

### `teams`

| Campo       | Tipo          | Descrição                      |
|-------------|---------------|--------------------------------|
| id          | INTEGER       | Identificador único (PK)      |
| name        | VARCHAR(100)  | Nome do time                  |
| description | TEXT          | Descrição opcional            |
| created_at  | TIMESTAMP     | Data de criação               |
| updated_at  | TIMESTAMP     | Última atualização            |

### `team_members`

Relaciona usuários com times.

| Campo     | Tipo      | Descrição                                |
|-----------|-----------|------------------------------------------|
| id        | INTEGER   | Identificador único (PK)                |
| user_id   | INTEGER   | FK para `users.id`                      |
| team_id   | INTEGER   | FK para `teams.id`                      |
| created_at| TIMESTAMP | Data de criação                         |

### `tasks`

| Campo       | Tipo                | Descrição                                  |
|-------------|---------------------|--------------------------------------------|
| id          | INTEGER             | Identificador único (PK)                  |
| title       | VARCHAR(200)        | Título da tarefa                          |
| description | TEXT                | Descrição detalhada (opcional)           |
| status      | ENUM                | `pending` / `in_progress` / `completed`   |
| priority    | ENUM                | `high` / `medium` / `low`                 |
| assigned_to | INTEGER             | FK para `users.id`                        |
| team_id     | INTEGER             | FK para `teams.id`                        |
| created_at  | TIMESTAMP           | Data de criação                           |
| updated_at  | TIMESTAMP           | Última atualização                        |

### `task_history`

| Campo       | Tipo    | Descrição                                  |
|-------------|---------|--------------------------------------------|
| id          | INTEGER | Identificador único (PK)                  |
| task_id     | INTEGER | FK para `tasks.id`                        |
| changed_by  | INTEGER | FK para `users.id`                        |
| old_status  | ENUM    | Status anterior                           |
| new_status  | ENUM    | Novo status                               |
| changed_at  | TIMESTAMP | Data da alteração                      |

---

## 🔗 Relacionamentos Resumidos

- `users` → `teams` via `team_members`
- `users` → `tasks` via `assigned_to`
- `teams` → `tasks` via `team_id`
- `tasks` → `task_history` via `task_id`

---

## Instalação
```bash
# Clone o repositório
git clone https://github.com/gabrielcipolini/nodus-api.git

# Instale as dependências
npm install

# Rode as migrações
npx prisma migrate dev

# Inicie o servidor
npm run dev 
```

--- 

## 🧪 Testes

Para executar os testes:

```bash
npm run test:dev
```
