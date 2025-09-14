# Sistema de Gestão de Requisições de Compra

Sistema para gerenciamento de requisições de compra, permitindo que usuários criem, editem e acompanhem o status de suas solicitações através de um fluxo de aprovação.

## 🚀 Funcionalidades

- **Autenticação**: Registro e login de usuários com JWT
- **Gestão de Requisições**: Criação, edição, visualização e exclusão de requisições
- **Controle de Status**: Fluxo de aprovação (DRAFT → SUBMITTED → APPROVED/REJECTED)
- **Diferentes Perfis**: Usuários comuns e aprovadores
- **Relatórios**: Resumo de requisições por status
- **Histórico**: Rastreamento de mudanças de status

## 🛠️ Tecnologias Utilizadas

- **Runtime**: Node.js 22
- **Framework**: Fastify 5.6.0
- **Banco de Dados**: MySQL 8.4 com Prisma ORM
- **Validação**: Zod para schemas e validações
- **Autenticação**: JWT com argon2 para hash de senhas
- **Documentação**: Swagger/OpenAPI com Scalar
- **Containerização**: Docker Compose

## 📋 Pré-requisitos

- Node.js 22+
- Docker e Docker Compose
- MySQL 8.4 (ou usar via Docker)

## ⚙️ Configuração do Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/zlucasftw/desafio_gestao_e_requisicao_compras_node.git
cd desafio_gestao_e_requisicao_compras_node
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

### 4. Inicie o banco de dados
```bash
docker-compose up -d
```

### 5. Execute as migrações
```bash
npx prisma migrate dev
```

### 6. Inicie o servidor
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`

## 📖 Documentação da API

Com o servidor rodando, acesse:
- **Scalar Docs**: `http://localhost:3333/docs`
- **Swagger UI**: `http://localhost:3333/v2/docs`

## 🗃️ Estrutura do Banco de Dados

- **Users**: Usuários do sistema (USER/APPROVER)
- **PurchaseRequests**: Requisições de compra
- **RequestItems**: Itens das requisições
- **ApprovalHistory**: Histórico de aprovações

## 🔄 Fluxo de Status

1. **DRAFT**: Toda requisição criada era atribuída com o status DRAFT, que idealmente pode ser editada (não implementado), mas para este desafio, a edição é permitida apenas nesse status, mas com alteração somente de um usuário com a role ou perfil APPROVER
2. **SUBMITTED**: Enviada para aprovação, não pode ser editada (não implementado a não edição) mas com alteração somente de um usuário com a role ou perfil APPROVER
3. **APPROVED**: Aprovada por um usuário com perfil APPROVER e se pasou pelo status anterior de SUBMITTED
4. **REJECTED**: Rejeitada por um usuário com perfil APPROVER e se passou pelo status anterior de SUBMITTED

## 🧪 Testes

Use o arquivo client.http para testar os endpoints da API.
Mas é possível testar com os endpoints do Swagger ou Scalar.
Além da utilização de um aplicativo como Postman ou Insomnia.

## 🤖 Uso de IA no Desenvolvimento

### Consultas e Aprendizado
- Utilizei LLMs para esclarecer dúvidas sobre estruturação do projeto e lógica de negócio
- Pesquisas no Google com resumos de IA para compreensão de conceitos
- Consulta à documentação oficial das bibliotecas, StackOverflow, discussões no GitHub

### GitHub Copilot
- Usado esporadicamente para sugestões inline
- Sempre analisando e validando código sugerido
- Desativado quando fugia de minha lógica e começava a atrapalhar e não servir como ferramenta de auxílio/aumento de produtividade

### Abordagem Geral
- **Não houve cópia direta** de código gerado por IA
- Scripts sugeridos por LLMs foram analisados e descartados, ainda mais quando introduziam complexidade desnecessária, então foram feitas questões apenas para tirar dúvidas pontuais e impedimentos
- Utilizei projetos anteriores como referência para tecnologias similares
- Ajustes manuais para problemas específicos (validações, queries Prisma, migrações)

### Geração por IA
- **README.md**: Este arquivo foi gerado por IA e posteriormente revisado e ajustado manualmente

## 📝 Licença

ISC License