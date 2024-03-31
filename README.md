## Chatbot

Este repositório apresenta uma implementação de um chatbot simples, utilizando as seguintes tecnologias:

### Frontend
 - React
 - React to web component
 - Web component
 - Socket.io client (WebSocket)

### Backend
 - NestJS
 - Prisma (conexão com banco de dados postgres)
 - Socket.io (WebSocket)

## Para executar

Recomendo a utilização do arquivo `docker-compose.yml` presente na raiz do projeto. O mesmo irá prover containers necessário de banco de dados, backend e front-end. Utilize o comando `docker compose up --build`. Após a criação dos containers, acesse a aplicação em [http://localhost:3000](http://localhost:3000), onde será apresentado o frontend da aplicação. Também é possível rodar localmente cada uma das aplicações individualmente, as quais possuem orientações em seus respectivos `README.md`.