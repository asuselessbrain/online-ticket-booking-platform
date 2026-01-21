import express from 'express';
import { BookingController, getVendorRevenueSummary } from './booking.controller';
import { getBookingsForVendor } from './booking.controller';

const router = express.Router();

router.post('/', BookingController.createBooking);
router.get('/user/:email', BookingController.getUserBookings);
router.get('/user/:email/transactions', BookingController.getUserTransactions);
router.get('/vendor/:email', getBookingsForVendor);
router.get('/vendor/:email/revenue', getVendorRevenueSummary);
router.patch('/:id', BookingController.updateBookingStatus);

export const BookingRoutes = router;
