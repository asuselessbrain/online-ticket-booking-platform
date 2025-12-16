import express from 'express';
import { TicketController } from './ticket.controller';

const router = express.Router();

router.post('/', TicketController.createTicket)
router.get('/:vendorEmail', TicketController.myAddedTicket)
router.patch('/:id', TicketController.modifyTicketDetails)
router.delete('/:id', TicketController.deleteTicket)
router.patch('/status/:id', TicketController.updateTicketStatus)
router.get('/', TicketController.getAllTickets)
router.patch('/advertisement/:id', TicketController.addToAdvertisement)
router.get('/approved/list', TicketController.getApprovedTickets)

export const TicketRoutes = router;