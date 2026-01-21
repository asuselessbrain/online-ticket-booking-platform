import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.post('/create-checkout-session', PaymentController.createCheckoutSession);
router.post('/payment-success', PaymentController.handlePaymentSuccess);
router.get('/status/:sessionId', PaymentController.getPaymentStatus);

export const PaymentRoutes = router;
