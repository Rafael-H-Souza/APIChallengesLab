# Projeto de implementação de API em Node 

## - Descrição
O objetivo desta API é **receber um arquivo desnormalizado** de pedidos de um sistema legado, processar seus dados e **retornar um JSON normalizado** via API REST, permitindo consultas gerais e filtradas.

Esta API foi desenvolvida para efetuar **leitura de arquivos `.txt`**  
As principais funcionalidades incluem:
- Leitura e interpretação do arquivo
- Validação das informações
- Registro de status do processo
- Conversão dos dados para JSON estruturado
- Armazenamento das informações em banco de dados **MongoDB**

---

## - Características dos Objetos

### **Usuário**
- Possui permissões sobre seus dados e arquivos vinculados
- Pode incluir, visualizar, modificar e excluir arquivos gerados

### **Histórico de Operação**
- Registro de logs de todas as operações executadas na aplicação
- Finalidade de rastreio e validação

### **Arquivo**
- Registro dos dados de log e auditoria
- Armazenamento do próprio arquivo no banco de dados

---

## - Objetivo
- Receber um arquivo de pedidos via upload na API
- Processar e converter o arquivo para JSON estruturado
- Disponibilizar o resultado via API REST
- Suportar filtros por:
  - **ID do pedido**
  - **Intervalo de datas**

---

## -  Tecnologias Utilizadas
- **Node.js** + **TypeScript**
- **Express.js** (API REST)
- **MongoDB** (armazenamento de logs/resultados)
- **Jest** (testes unitários e integração)
- **Dotenv** (configurações de ambiente)
- **Multer** (upload de arquivos)
- **ESLint + Prettier** (padrões de código)
- **Docker** (containerização do código)

---

## Sumário

* [Arquitetura em alto nível](#arquitetura-em-alto-nível)
* [Tecnologias](#tecnologias)
* [Como rodar](#como-rodar)

  * [Pré‑requisitos](#pré-requisitos)
  * [Local (npm)](#local-npm)
  * [Docker e Docker Compose](#docker-e-docker-compose)
* [Configuração (.env)](#configuração-env)
* [Swagger (OpenAPI) — Documentação e Rotas](#swagger-openapi--documentação-e-rotas)

  * [Como o Swagger está plugado no app](#como-o-swagger-está-plugado-no-app)
  * [Como a documentação fica sincronizada com as rotas](#como-a-documentação-fica-sincronizada-com-as-rotas)
  * [Exemplos de definição no `swagger.json`](#exemplos-de-definição-no-swaggerjson)
  * [Testando via Swagger UI](#testando-via-swagger-ui)
* [Módulos e Pastas](#módulos-e-pastas)
* [Fluxo de processamento](#fluxo-de-processamento)
* [Formato de entrada (TXT) → Parsing](#formato-de-entrada-txt--parsing)
* [Endpoints principais](#endpoints-principais)
* [Autenticação (opcional)](#autenticação-opcional)
* [Tratamento de erros](#tratamento-de-erros)
* [Logs e Decorators](#logs-e-decorators)
* [Testes (Jest) e Cobertura](#testes-jest-e-cobertura)
* [CI/CD (GitHub Actions)](#cicd-github-actions)
* [Padrões de código](#padrões-de-código)
* [Contribuição](#contribuição)
* [Licença](#licença)

---

## Arquitetura em alto nível

```mermaid
flowchart TD
  A[Cliente] -->|Upload .txt| B[API REST]
  B --> C[Upload Controller]
  C --> D[Pedido Service]
  D --> E[Validação e Parsing]
  E --> F[Conversão p/ JSON]
  F --> G[(MongoDB)]
  G --> H[Consulta REST /pedidos]
  H -->|JSON| A
```

A aplicação segue camadas:

* **Controllers**: recebem a requisição HTTP, validam entrada básica, chamam services e retornam respostas padronizadas.
* **Services**: regras de negócio (parsing do TXT, validação, filtros, etc.).
* **Repositories**: acesso a dados via Mongoose (MongoDB).
* **Middlewares**: autenticação, tratamento de erros, upload (Multer).
* **Models**: schemas Mongoose.
* **Decorators**: cross‑cutting (ex.: `@LogMethod`).

---

## Tecnologias

* **Node.js** + **TypeScript**
* **Express.js** (API REST)
* **MongoDB** (Mongoose)
* **Multer** (upload de arquivos)
* **dotenv** (variáveis de ambiente)
* **Jest** (testes unitários e integração)
* **ESLint + Prettier** (lint/format)
* **Swagger UI** (documentação interativa: `/api-docs`)
* **Docker / Docker Compose** (containerização)

---

## Como rodar

### Pré‑requisitos

* Node 18+
* Docker e Docker Compose (opcional, recomendado)
* MongoDB local **ou** usar o do Compose

### Local (npm)

```bash
# 1) Instalar deps
npm install

# 2) Gerar build TypeScript
npm run build

# 3a) Iniciar em modo produção (usa dist/)
npm start

# 3b) Ou modo dev (ts-node + nodemon)
npm run dev
```

Aplicação sobe (por padrão) em `http://localhost:3000`.

### Docker e Docker Compose

```bash
# Sobe app + MongoDB
docker-compose up --build

# Rodar em background
docker-compose up -d --build

# Logs
docker-compose logs -f


```


# imagem Docker

* A apicação contém um containercom a nomenclatura de api-logistica-lab que contem a divisão de banco (db_lab_logistica) e a logica da aplicação (api_logistica_container)

<img src="./docs/img/image-docker.png" alt="Available authorizations - TOKEN" width="800"/>


> O compose define o `MONGO_URI` e aguarda o banco estar pronto antes de iniciar o servidor.

---

## Configuração (.env)

Crie um arquivo `.env` na raiz. Exemplo:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://root:rootLab@db_lab_logistica:27017/db_Homologacao?authSource=admin
JWT_SECRET=troque-isto-se-ativar-auth
UPLOAD_DIR=./uploads
```

---

## Swagger (OpenAPI) — Documentação e Rotas

A documentação da API está em `src/swagger/swagger.json` (copiado para `dist/swagger/swagger.json` no build). O **Swagger UI** é servido em **`/api-docs`**.

## Rotas e Swagger

Principais endpoints (prefixo sugerido /):

### Pedidos

* GET /pedidos – Lista pedidos (filtros)

* GET /pedidos/:id – Detalhe por ID

* POST /pedidos – Cria manualmente (quando necessário)

* PUT /pedidos/:id – Atualiza

* DELETE /pedidos/:id – Remove

## Upload

### POST /upload – Recebe arquivo .txt (multipart/form-data campo file) e processa.

<img src="./docs/img/img-update-file.png" alt="POST /user/register" width="600"/>

## Usuários 

### * POST /user/register

<img src="./docs/img/image.png" alt="POST /user/register" width="600"/>

### * GET /user/login

<img src="./docs/img/image-1.png" alt="GET /user/login" width="600"/>


### * Available authorizations - TOKEN

<img src="./docs/img/image-2.png" alt="Available authorizations - TOKEN" width="600"/>

### * GET /user/lista
<img src="./docs/img/img-get-lista-users.png" alt="GET /user/login" width="600"/>

```

* Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTRlMThiODNhZTYzYWM5YjkzMDg3MiIsImlhdCI6MTc1NTYzNjEzOCwiZXhwIjoxNzU1NjM5NzM4fQ.wYHgLKla1-XjKhQeU1zA6Wizz1c_HoUELB0blBCAFJE 

```

Swagger UI: exposto em /api-docs.


### Como o Swagger está plugado no app

**`src/app.ts` (exemplo de integração):**

```ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json"; // caminho relativo à pasta src

export class App {
  public app = express();

  constructor() {
    this.config();
    this.routes();
    this.swagger();
  }

  private config() {
    this.app.use(express.json());
  }

  private routes() {
    // this.app.use("/pedidos", PedidoRoutes.getRouter());
    // this.app.use("/upload", UploadRoutes.getRouter());
    // this.app.use("/users", UserRoutes.getRouter());
  }

  private swagger() {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}
```

### Como a documentação fica sincronizada com as rotas

* Cada **rota** criada em `src/routes/*.ts` deve ter uma **entrada correspondente** em `src/swagger/swagger.json` dentro de `paths`.
* Para **parâmetros** (query/path/body) e **schemas** (modelos de resposta), use `components.schemas` no `swagger.json` de forma reutilizável.
* Ao **adicionar/alterar** endpoints, **atualize** o `swagger.json` para refletir os parâmetros, tipos e exemplos. Assim o Swagger UI exibe e **permite testar** as rotas com os mesmos contratos usados pelo backend.

### Exemplos de definição no `swagger.json`

**1) Upload de arquivo TXT**

```json
{
  "paths": {
    "/upload/pedidos": {
      "post": {
        "summary": "Upload de arquivo .txt de pedidos",
        "tags": ["Upload"],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": { "type": "string", "format": "binary" }
                },
                "required": ["file"]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Arquivo processado com sucesso",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/UploadResult" }
              }
            }
          },
          "400": { "description": "Arquivo inválido" },
          "500": { "description": "Erro interno" }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "UploadResult": {
        "type": "object",
        "properties": {
          "processed": { "type": "number" },
          "stored": { "type": "number" },
          "invalid": { "type": "number" },
          "logId": { "type": "string" }
        }
      }
    }
  }
}
```

**2) Consulta de pedidos com filtros (paginações e datas)**

```json
{
  "paths": {
    "/pedidos": {
      "get": {
        "summary": "Listar pedidos",
        "tags": ["Pedidos"],
        "parameters": [
          { "in": "query", "name": "page", "schema": { "type": "integer", "default": 1 } },
          { "in": "query", "name": "limit", "schema": { "type": "integer", "default": 20 } },
          { "in": "query", "name": "order", "schema": { "type": "string", "enum": ["asc","desc"], "default": "desc" } },
          { "in": "query", "name": "orderId", "schema": { "type": "integer" } },
          { "in": "query", "name": "dateFrom", "schema": { "type": "string", "format": "date" } },
          { "in": "query", "name": "dateTo", "schema": { "type": "string", "format": "date" } }
        ],
        "responses": {
          "200": {
            "description": "Lista paginada",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/PedidoPage" }
              }
            }
          }
        }
      }
    },
    "/pedidos/{id}": {
      "get": {
        "summary": "Obter pedido por ID",
        "tags": ["Pedidos"],
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Pedido" } } } },
          "404": { "description": "Não encontrado" }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Pedido": {
        "type": "object",
        "properties": {
          "_id": { "type": "string" },
          "orderId": { "type": "integer" },
          "userId": { "type": "integer" },
          "userName": { "type": "string" },
          "productId": { "type": "integer" },
          "value": { "type": "number" },
          "date": { "type": "string", "format": "date" },
          "createdAt": { "type": "string", "format": "date-time" }
        }
      },
      "PedidoPage": {
        "type": "object",
        "properties": {
          "items": { "type": "array", "items": { "$ref": "#/components/schemas/Pedido" } },
          "page": { "type": "integer" },
          "limit": { "type": "integer" },
          "total": { "type": "integer" }
        }
      }
    }
  }
}
```

> **Dica**: para **rotas protegidas**, adicione `securitySchemes` (Bearer) em `components`, e `security: [{ bearerAuth: [] }]` no endpoint.

### Testando via Swagger UI

1. Rode o projeto e acesse **`http://localhost:3000/api-docs`**.
2. Use o botão **Try it out** para enviar requisições reais.
3. Se a rota for de **upload**, o Swagger permite anexar o arquivo `.txt`.

---

## Módulos e Pastas

Estrutura principal (resumo do diretório `Api-Logistica-lab/`):

* **`src/`**: código-fonte TS

  * `config/` — conexão Mongo (`database.ts`)
  * `controllers/` — `pedido.controller.ts`, `upload.controller.ts`, `user.controller.ts`
  * `decorators/` — `logger.decorator.ts`
  * `interfaces/` — contratos TS (`IPedido`, `IUser`, `ILog`)
  * `middlewares/` — `auth.middeware.ts`, `error.middleware.ts`
  * `models/` — Mongoose schemas (`pedido.model.ts`, etc.)
  * `repositories/` — acesso a dados
  * `routes/` — roteadores Express (ex.: `pedido.routes.ts`)
  * `services/` — regra de negócio (`pedido.service.ts`, `logger.service.ts`)
  * `swagger/` — `swagger.json`
  * `app.ts` / `server.ts` — bootstrap
* **`dist/`**: build JS
* **`tests/`**: Jest (integração e e2e)
* **`uploads/`**: diretório de uploads (quando não usa GridFS)
* **`.github/workflows/`**: CI/CD (`docker-ci.yml`, `docker-cd.yml`)

---

## Fluxo de processamento

1. **Upload** (`POST /upload/pedidos`) recebe arquivo `.txt` via **Multer**.
2. **Service** lê o conteúdo (sincrono/assincrono) e **quebra por linhas**.
3. **Parsing** de **largura fixa** (slices por coluna) → monta objetos `Pedido`.
4. **Validação**: tipos numéricos, datas, regras de negócio.
5. **Persistência** em MongoDB (coleções `pedidos`, `method_logs`, etc.).
6. **Resposta** com contagem processada e ID de log.
7. **Consulta** (`GET /pedidos`) com filtros/paginação retorna JSON.

---

## Formato de entrada (TXT) → Parsing

Exemplo de **mapeamento de colunas** (ajuste conforme seu legado):

| Campo       | Posição (slice) | Tipo       | Observação                    |
| ----------- | --------------- | ---------- | ----------------------------- |
| `userId`    | `0..10`         | inteiro    | `parseInt(line.slice(0,10))`  |
| `userName`  | `11..55`        | string     | `line.slice(11,55).trim()`    |
| `orderId`   | `55..65`        | inteiro    | ID do pedido                  |
| `productId` | `65..75`        | inteiro    | ID do produto                 |
| `value`     | `75..87`        | número     | Pode vir com zeros à esquerda |
| `date`      | `87..95`        | `YYYYMMDD` | Converter para `YYYY-MM-DD`   |

**Exemplo (trecho de service):**

```ts
const lines = raw.split(/\r?\n/).filter(l => l.trim() !== "");

const docs = lines.map((line) => {
  const userId = parseInt(line.slice(0, 10).trim(), 10);
  const userName = line.slice(11, 55).trim();
  const orderId = parseInt(line.slice(55, 65).trim(), 10);
  const productId = parseInt(line.slice(65, 75).trim(), 10);

  const valueStr = line.slice(75, 87).trim();
  const value = Number(valueStr);

  const rawDate = line.slice(87, 95).trim(); // YYYYMMDD
  const date = rawDate.length === 8
    ? `${rawDate.slice(0,4)}-${rawDate.slice(4,6)}-${rawDate.slice(6,8)}`
    : undefined;

  return { userId, userName, orderId, productId, value, date };
});
```

> **Observação**: se precisar **persistir o arquivo original**, use **GridFS** ou armazene `Buffer`/`base64` + metadados em uma coleção `uploads`.

---

## Endpoints principais

### Healthcheck

* `GET /health` → status do servidor e do MongoDB.

### Upload

* `POST /upload/pedidos` → recebe arquivo `.txt` (multipart/form-data) e processa.

  * **Body**: `file` (tipo arquivo)
  * **Resposta**: `{ processed, stored, invalid, logId }`

### Pedidos

* `GET /pedidos` → lista com **paginação** e **filtros**:

  * `page` (default: 1)
  * `limit` (default: 20)
  * `order` (`asc`|`desc`, default: `desc`)
  * `orderId` (igualdade)
  * `dateFrom` / `dateTo` (formato `YYYY-MM-DD`)
* `GET /pedidos/:id` → pedido por ID (Mongo `_id`).
* `POST /pedidos` → criar manualmente (opcional).
* `PUT /pedidos/:id` → atualizar (opcional).
* `DELETE /pedidos/:id` → remover (opcional).

**Exemplos cURL**

```bash
# Upload
curl -X POST http://localhost:3000/upload/pedidos \
  -H "Content-Type: multipart/form-data" \
  -F "file=@./desafio-tecnico-docs/data_1.txt"

# Consulta paginada
curl "http://localhost:3000/pedidos?page=1&limit=20&order=desc&dateFrom=2025-01-01&dateTo=2025-12-31"

# Por orderId
curl "http://localhost:3000/pedidos?orderId=123456"
```

---

## Autenticação (opcional)

Há um `auth.middeware.ts` para proteger rotas com **Bearer token**. Quando ativado:

* Adicione em `app.ts` o middleware em rotas sensíveis.
* No `swagger.json`, inclua:

```json
{
  "components": {
    "securitySchemes": {
      "bearerAuth": { "type": "http", "scheme": "bearer", "bearerFormat": "JWT" }
    }
  }
}
```

E nos endpoints protegidos:

```json
"security": [{ "bearerAuth": [] }]
```

---

## Tratamento de erros

* Middleware global `error.middleware.ts` padroniza respostas:

```json
{
  "message": "Descrição do erro",
  "code": "ERR_CODE",
  "details": { }
}
```

* Em produção, retornar mensagens amigáveis e **logar stacktrace** via `logger.service`.

---

## Logs e Decorators

* `logger.decorator.ts` fornece `@LogMethod` para registrar **sucesso/erro** de métodos (classe, método, tempo de execução, payload reduzido):

```ts
export function LogMethod(): MethodDecorator { /* ... */ }
```

* `logger.service.ts` persiste em `method_logs` com Mongoose.

---

## Testes (Jest) e Cobertura

* **Pasta**: `tests/integration/` com `pedido.service.spec.ts` e `pedidos.e2e.spec.ts`.
* **Scripts** (exemplo `package.json`):

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "test": "jest",
    "test:unit": "jest --selectProjects unit",
    "test:integration": "jest --selectProjects integration",
    "lint": "eslint 'src/**/*.{ts,tsx}' --max-warnings=0",
    "format": "prettier --write ."
  }
}
```

* **Cobertura**: gerada em `coverage/` (abrir `coverage/lcov-report/index.html`).
* Há um `docker-compose.test.yml` para rodar testes em ambiente isolado de CI.

---

## CI/CD (GitHub Actions)

* **`docker-ci.yml`**: pipeline de **CI** (lint, build, test, cobertura, build de imagem).
* **`docker-cd.yml`**: **CD** (push de imagem para registry e/ou deploy no ambiente alvo).
* Passos típicos:

  1. Checkout + Node setup
  2. Cache de dependências
  3. `npm ci` → `npm run lint` → `npm test`
  4. Build Docker → push (se branch principal/tag)

> Ajuste segredos (ex.: `REGISTRY_URL`, `REGISTRY_USER`, `REGISTRY_TOKEN`) nos **Secrets** do repositório.

---

## Padrões de código

* **ESLint + Prettier** configurados para manter padronização (imports, aspas, trailing commas, etc.).
* Commits sugeridos (Conventional Commits): `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `build`, `ci`.

---

## Contribuição

1. Faça um fork/branch a partir de `main`.
2. Rode `npm run lint` e `npm test` antes de abrir PR.
3. Atualize o `swagger.json` se alterar endpoints.
4. Inclua exemplos de request/response no PR.

---

## Licença

Defina a licença do projeto (ex.: MIT) no arquivo `LICENSE`.

---

### Anexos úteis

* **Abrir Swagger UI**: `http://localhost:3000/api-docs`
* **Abrir cobertura**: `coverage/lcov-report/index.html`
* **Arquivos de exemplo**: `desafio-tecnico-docs/data_1.txt`, `data_2.txt`

---

> **Objetivo:** Receber um arquivo **desnormalizado** (formato `.txt`) de um sistema legado, processar e **converter para JSON normalizado**, persistir em **MongoDB** e expor **consultas REST** com filtros (ID do pedido, intervalo de datas, etc.).

---
