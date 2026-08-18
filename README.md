# Calistreet API

API completa para o aplicativo Calistreet, desenvolvido com **NestJS**, **Sequelize** (ORM), **PostgreSQL** e autenticação **JWT**. 
Esta API possui paginação, filtros, controle de permissões e documentação (Swagger).

## 🚀 Requisitos para Rodar

Certifique-se de ter instalado e configurado em sua máquina:

1.  **Node.js** (versão LTS ou superior)
2.  **npm** ou **Yarn**
3.  **Docker** (com dois containers rodando localmente, um para o **PostgreSQL** e outro para o **Redis**)

## ⚙️ Configuração do Ambiente

Siga os passos abaixo para configurar e iniciar o projeto.

#### Passo 1: Clone o Repositório

```bash
git clone https://github.com/soubruno/calistreet-api
cd calistreet-api
```

#### Passo 2: Instale as Dependências

- Instale todas as dependências do projeto listadas no package.json:

```bash
npm install
```

#### Passo 3: Configuração das variáveis de ambiente

- Crie um arquivo .env com as variaveis necessárias no .env.example:

```bash
cp .env.example .env
```

#### Passo 4: Inicie a Aplicação

```bash
npm run dev
```

## 🌐 Acesso à API e Documentação

### Documentação (Swagger)

Acesse a documentação completa da API (CRUD, listagens com filtros/paginação, autenticação e permissões) no seguinte endereço:

```bash
http://localhost:3000/api/docs
```

### Fluxo de Teste Interativo

Para interagir com os endpoints protegidos, como os de gerenciamento de usuários, exercícios ou profissionais, você precisa seguir o fluxo de Autenticação e Autorização.

#### Passo 1: Criar um Usuário Administrador (Admin)

- Para ter acesso a todos os endpoints, é recomendável criar um usuário com o papel de ADMIN.

- No Swagger, encontre o endpoint POST /usuarios (Criar Usuário).

- Clique em "Try it out".

- No campo Request body, utilize um JSON semelhante a este, garantindo que o campo tipo seja "ADMIN":

```bash
{
  "nome": "Admin",
  "email": "admin@calistreet.com",
  "senha": "Senha123",
  "tipo": "ADMIN" 
}
```

- Clique em "Execute". Você deve receber um Response code 201.

#### Passo 2: Obter o Token de Acesso (Login)

- Agora, você deve fazer login para receber o token JWT.

- Encontre o endpoint POST /auth/login.

- Clique em "Try it out".

- No campo Request body, insira as credenciais que você acabou de criar:

```bash
{
  "email": "admin@calistreet.com",
  "senha": "Senha123"
}
```

- Clique em "Execute". O corpo da resposta (Response body) conterá o seu access_token. Copie o valor completo do token.

#### Passo 3: Autorizar o Swagger (Usar o Token)

- Este passo é crucial para testar qualquer endpoint protegido por AuthGuard('jwt').

- No topo da página do Swagger, localize o botão "Authorize" ou o ícone de cadeado.

- Clique nele.

- Na janela que se abre (geralmente chamada BearerAuth), cole o token que você copiou no Passo 2.

  `Exemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

- Clique em "Authorize" e feche a janela. O ícone de cadeado nos endpoints deve agora aparecer fechado, indicando que você está autenticado.

#### Passo 4: Testar Permissões e Funcionalidades

- Agora que você está autenticado como ADMIN, pode testar qualquer endpoint, incluindo aqueles que requerem permissões mais elevadas.

##### Teste 1: Crie um novo usuário para simular um aluno.

- Criar o Aluno:
- No Swagger, encontre o endpoint POST /usuarios.

- Clique em "Try it out".

- No campo Request body, utilize o JSON abaixo. O usuário será um aluno se você não especificar o campo "tipo" ou se você preencher com "ALUNO": 

```bash
{
  "nome": "João",
  "email": "joao@aluno.com",
  "senha": "Senha123"
}
```
- Clique em "Execute". O corpo da resposta retornará o id do novo usuário. Guarde este ID.

##### Teste 2: Exclua esse usuário.

- Navegue até a seção Usuario no Swagger.

- Encontre o endpoint DELETE /usuarios/{id}.

- Clique em "Try it out".

- No campo id do Path Parameter, insira o ID do usuário ALUNO que você deseja apagar.

  `Exemplo: c628f86f-2399-4c17-9c98-1e42b26002f2`

- Clique em "Execute".

- Resultado Esperado (Sucesso): O código de resposta deve ser 204 No Content, indicando que a operação foi bem-sucedida porque o seu token tem a permissão ADMIN necessária.
