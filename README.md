# Calistreet API

API completa para o aplicativo Calistreet, desenvolvido com **NestJS**, **Sequelize** (ORM), **PostgreSQL** e autenticação **JWT**. 
Esta API possui paginação, filtros, controle de permissões (RBAC) e documentação OpenAPI (Swagger).

## 🚀 Requisitos para Rodar

Certifique-se de ter instalado em sua máquina:

1.  **Node.js** (versão LTS ou superior)
2.  **npm** ou **Yarn**
3.  **Docker** (ou um servidor **PostgreSQL** rodando localmente)

## ⚙️ Configuração do Ambiente

Siga os passos abaixo para configurar e iniciar o projeto.

### Passo 1: Clone o Repositório

```bash
git clone [https://github.com/soubruno/calistreet-api](https://github.com/soubruno/calistreet-api)
cd calistreet-api
```

### Passo 2: Instale as Dependências

Instale todas as dependências do projeto listadas no package.json:

```bash
npm install
```

### Passo 3: Configuração das variáveis de ambiente

Crie um arquivo .env com as variaveis necessárias no .env.example:

```bash
cp .env.example .env
```

### Passo 4: Inicie a Aplicação

```bash
npm start dev
```