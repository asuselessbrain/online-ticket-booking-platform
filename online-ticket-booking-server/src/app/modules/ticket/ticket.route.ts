import express from 'express';
import { TicketController } from './ticket.controller';

const router = express.Router();

router.post('/', TicketController.createTicket)

export const TicketRoutes = router;