import express from 'express';
import { BookingController } from './booking.controller';

const router = express.Router();

router.post('/', BookingController.createBooking);
router.get('/user/:email', BookingController.getUserBookings);
router.patch('/:id', BookingController.updateBookingStatus);

export const BookingRoutes = router;
