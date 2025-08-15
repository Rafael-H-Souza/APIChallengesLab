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

## - Visão Inicial da Aplicação
```mermaid
flowchart TD
    A[Cliente] -->|Upload de Arquivo .txt| B[API REST]
    B --> C[Processador de Arquivo]
    C --> D[Validação e Parsing]
    D --> E[Conversão para JSON]
    E --> F[MongoDB - Armazenamento]
    F --> G[Consulta de Dados]
    G -->|Resposta JSON| A
