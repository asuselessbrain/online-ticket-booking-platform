import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

export const PaymentController = {
  async createCheckoutSession(req: Request, res: Response) {
    try {
      const { bookingId } = req.body;

      if (!bookingId) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
      }

      const result = await PaymentService.createCheckoutSession(bookingId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Payment error:', error.message);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create checkout session'
      });
    }
  },

  async handlePaymentSuccess(req: Request, res: Response) {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      const result = await PaymentService.handlePaymentSuccess(sessionId);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Payment processed successfully'
      });
    } catch (error: any) {
      console.error('Payment success handler error:', error.message);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to process payment'
      });
    }
  },

  async getPaymentStatus(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      const result = await PaymentService.getPaymentStatus(sessionId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Get payment status error:', error.message);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve payment status'
      });
    }
  }
};
