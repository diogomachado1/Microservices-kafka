import express from 'express';
import cors from 'cors';

import routes from './routes';

const app = express();

/**
 * Disponibiliza o producer para todas rotas
 */
app.use(cors());
app.use(express.json());

/**
 * Cadastra as rotas da aplicação
 */
app.use(routes);

async function run() {
  app.listen(3333);
}

run().catch(console.error)

