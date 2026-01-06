# 📦 Fast Feet API

> Sistema de gestão de encomendas para uma transportadora.

Esta é uma API REST desenvolvida em **NestJS** com alta performance, escalabilidade e arquitetura limpa. O projeto gerencia desde o cadastro de entregadores e destinatários até o fluxo completo de entrega com geolocalização e assinaturas digitais.

---

### 📖 Documentação da API (Swagger)

Acesse a documentação completa dos endpoints em: [![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)](https://api.fastfeet.claudioneto.dev/docs)

---

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma 7](https://www.prisma.io/)
- **Banco de Dados:** PostgreSQL (Docker)
- **Validação:** Zod
- **Infraestrutura:** AWS EC2 & Docker Compose
- **Segurança:** SSL (Certbot/Let's Encrypt) & Nginx Reverse Proxy
- **Armazenamento:** Cloudflare R2 (S3 Compatible)
- **CI/CD:** GitHub Actions

---

## 📋 Regras de Negócio & Funcionalidades

### 🔐 Autenticação & Papéis

- **Administrador:** Gerencia entregadores, destinatários e encomendas.
- **Entregador:** Visualiza e gerencia suas próprias entregas.

### 🚚 Fluxo de Encomendas

- **CRUD de Entregadores e Destinatários:** Apenas administradores.
- **Ciclo de Vida das encomendas:**
  - `Aguardando Retirada`: Criada pelo admin.
  - `Em Trânsito`: Marcada por um entregador (`startDate`).
  - `Entregue`: Confirmada com foto da assinatura (`endDate` + `signatureId`).
  - `Cancelada/Devolvida`: Marcada em caso de falha (`canceladedAt`).
- **Geolocalização:** Entregadores só podem visualizar encomendas em um raio de 10km de sua posição atual.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Docker & Docker Compose
- Node.js (v24 recomendado)

### Instalação

1. Clone o repositório:
   ```bash
   git clone [https://github.com/claudiofsn/fast-feet.git](https://github.com/claudiofsn/fast-feet.git)
   cd fast-feet
   ```
2. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
3. Suba o ambiente com Docker:
   ```bash
   docker compose up -d
   ```
4. Popule o banco de dados (Massa de Testes):
   ```bash
   npx prisma db seed
   ```

## 🌐 Deploy & Manutenção

A aplicação está em produção em: https://api.fastfeet.claudioneto.dev

- Auto-Reset: O banco de dados é resetado e populado com uma massa de testes limpa a cada 2 horas via Cron Job na AWS EC2, garantindo um ambiente de demonstração sempre funcional.

- SSL: Certificado renovado automaticamente via Certbot.

## 🧪 Massa de Testes (Credenciais)

Para testar as funcionalidades, utilize os dados gerados pelo seed:

| Role           | Email                     | Senha    | CPF           |
| :------------- | :------------------------ | :------- | :------------ |
| **Admin**      | `admin@fastfeet.com`      | `123456` | `00011122233` |
| **Entregador** | `entregador@fastfeet.com` | `123456` | `55566677788` |

### 📍 Localização para Testes (Geofencing)

Para testar a rota de **Encomendas Próximas** (`GET /orders/nearby`), utilize as coordenadas abaixo. As ordens foram semeadas na região da Av. Paulista, SP:

- **Latitude:** `-23.56168`
- **Longitude:** `-46.65591`

> **Dica:** Ao testar no Swagger ou Postman, envie esses valores como query parameters para retornar as ordens em um raio de até 10km.

## 👨‍💻 Autor

**Cláudio Neto** - Desenvolvedor Full Stack.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/claudio-felix)

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=about.me&logoColor=white)](https://claudioneto.dev)
