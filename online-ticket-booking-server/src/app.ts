import express from 'express';
import cors from 'cors';
import { TicketRoutes } from './app/modules/ticket/ticket.route';
import { UserRoutes } from './app/modules/user/user.route';
import { BookingRoutes } from './app/modules/booking/booking.route';
import { PaymentRoutes } from './app/modules/payment/payment.route';
import cookieParser from 'cookie-parser'

const app = express();

app.use(express.json());
app.use(cors({origin: true, credentials: true}));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/tickets', TicketRoutes);
app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/bookings', BookingRoutes);
app.use('/api/v1/payments', PaymentRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;


