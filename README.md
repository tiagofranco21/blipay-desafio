# Desafio Blipay – Motor de Crédito

## Descrição

Este projeto implementa um **motor de crédito** que calcula um score com base nas informações fornecidas por um usuário e determina se o crédito é **aprovado** ou **reprovado**.

### Tecnologias utilizadas

- **Frontend:** Angular
- **Backend:** Flask
- **Banco de dados:** SQLite
- **Proxy reverso:** Nginx

---

## Arquitetura

```plaintext
               Usuário (navegador)
                      ↓
                  Requisição
                      ↓
              [ NGINX (porta 80) ]

       ┌──────────────┴──────────────┐
       │                             │
Frontend Angular           Proxy reverso para /api
                                     ↓
                        Backend Flask (porta interna 5000)
                                     ↓
                        Requisições externas à OpenWeather
```

- Se você quiser mudar a porta do projeto, só precisa alterar a porta de saída do serviço `nginx` no `docker-compose.yml`.

---

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone git@github.com:tiagofranco21/blipay-desafio.git
cd blipay-desafio
```

### 2. Configure a chave da API

Crie um arquivo `.env` na pasta blipay-backend baseado em `base.env`, é necessario mudar especialmente:

```env
OPENWEATHER_API_KEY=sua_chave_aqui
```

---

### 3. Suba os containers com Docker Compose

```bash
docker compose up --build
```

Acesse o sistema pela URL:

```
http://localhost:80
```

---

## Executar os testes

O projeto está preparado com testes automatizados para frontend e backend.

### Backend Flask

```bash
docker compose -f docker-compose-backend.test.yml up --abort-on-container-exit --exit-code-from backend-tests
```

### Frontend Angular

```bash
docker compose -f docker-compose-frontend.test.yml up --abort-on-container-exit --exit-code-from frontend-tests
```

---

## Documentação da API (Swagger)

Você pode acessar a documentação interativa da API em:

```
http://localhost:5000/api/docs
```

> A porta do backend é exposta na `5000` apenas para facilitar testes locais e acessar o Swagger. Porém, pode ser deixada inteira visto que é acessada via o proxy reverso (porta `80/api`).
