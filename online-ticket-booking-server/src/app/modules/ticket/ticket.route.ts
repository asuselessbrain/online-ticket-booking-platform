import express from 'express';
import { TicketController } from './ticket.controller';

const router = express.Router();

router.post('/', TicketController.createTicket)
router.get('/:vendorEmail', TicketController.myAddedTicket)
router.patch('/:id', TicketController.modifyTicketDetails)

export const TicketRoutes = router;