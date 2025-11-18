// Backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import casesRouter from './routes/cases.js';
import alertsRouter from './routes/alerts.js';
import desaparecidosRouter from './routes/desaparecidos.js';
import searchsRouter from './routes/searchs.js';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*'}));
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, service: 'AlertRes API' }));
app.use('/cases', casesRouter);
app.use('/alerts', alertsRouter);
app.use('/desaparecidos', desaparecidosRouter);
app.use('/searchs', searchsRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, "0.0.0.0",() => {
  console.log(`AlertRes API escuchando en http://192.168.0.19:${port}`);
});
