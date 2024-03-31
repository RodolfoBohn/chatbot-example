## Chatbot - backend

Esta aplicação atende as demandas de backend do chatbot.

Para executar localmente, é necessário a criação e conexão com um banco de dados postgres. Crie seu arquivo `.env` baseado no arquivo `.env.example` apresentado, substituindo as informações pelo seu banco de dados local.

Instale as dependências do projeto com o comando `npm install` e execute o comando `npx prisma migrate dev` para a criação das tabelas necessárias. A seguir, utilize o comando `npm run start` para execução ou `npm run start:dev` para execução com hot reload. 