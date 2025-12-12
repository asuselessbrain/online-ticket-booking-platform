import express from 'express';
import cors from 'cors';
import { TicketRoutes } from './app/modules/ticket/ticket.route';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/tickets', TicketRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;


