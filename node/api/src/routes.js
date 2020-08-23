import express from 'express';
import Kafka from './lib/Kafka';

const routes = express.Router();

routes.get('/product/:id', async (req, res) => {
  const a = await Kafka.request('get-product', {_id: req.params.id})

  return res.json(a); 
});

routes.post('/product', async (req, res) => {

  const a = await Kafka.request('create-product', req.body)

  return res.json(a);
});


routes.put('/product/:id', (req, res) => {
  return res.status(404).json({ ok: true });
});

routes.delete('/product/:id', async (req, res) => {
  const a = await Kafka.request('delete-product', {_id: req.params.id})

  return res.json(a);
});


export default routes;