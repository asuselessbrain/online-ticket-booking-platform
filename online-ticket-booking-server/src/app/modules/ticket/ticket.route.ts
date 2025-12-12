import express from 'express';
import { TicketController } from './ticket.controller';

const router = express.Router();

router.post('/', TicketController.createTicket)
router.get('/:vendorEmail', TicketController.myAddedTicket)

export const TicketRoutes = router;