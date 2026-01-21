import express from 'express';
import { TicketController } from './ticket.controller';

const router = express.Router();

// Specific routes first before dynamic params
router.get('/locations', TicketController.getUniqueLocations)
router.get('/approved/list', TicketController.getApprovedTickets)
router.post('/', TicketController.createTicket)
router.get('/vendor/:vendorEmail', TicketController.myAddedTicket)
router.get('/:id', TicketController.getSingleTicket)
router.patch('/:id', TicketController.modifyTicketDetails)
router.delete('/:id', TicketController.deleteTicket)
router.patch('/status/:id', TicketController.updateTicketStatus)
router.get('/', TicketController.getAllTickets)
router.patch('/advertisement/:id', TicketController.addToAdvertisement)

export const TicketRoutes = router;