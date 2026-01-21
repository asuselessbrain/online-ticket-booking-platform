import Stripe from 'stripe';
import { config } from '../../../config/index';
import { BookingModel } from '../booking/booking.model';
import { TicketModel } from '../ticket/ticket.model';

const stripe = new Stripe(config.stripeSecretKey);

export const PaymentService = {
  async createCheckoutSession(bookingId: string) {
    try {
      // Fetch booking details
      const booking = await BookingModel.findById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Prevent duplicate payment attempts once paid
      if (booking.status === 'paid') {
        throw new Error('Booking already paid');
      }

      if (booking.status !== 'confirmed') {
        throw new Error('Booking must be accepted by vendor before payment');
      }

      // Fetch ticket details
      const ticket = await TicketModel.findById(booking.ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      
        // Block payment if departure already passed
        const departureDateTime = new Date(`${ticket.departureDate} ${ticket.departureTime}`);
        if (departureDateTime <= new Date()) {
          throw new Error('Payment closed - departure time has passed');
        }

      // Calculate unit amount in cents (Stripe uses cents)
      const unitAmount = Math.round(booking.unitPrice * 100);

      // Build product data object
      const productData: any = {
        name: `Booking for: ${ticket.ticketTitle}`,
        description: `${booking.quantity} seat(s) from ${ticket.from} to ${ticket.to}`
      };

      // Only add images if ticket image exists
      if (ticket.image) {
        productData.images = [ticket.image];
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'bdt',
              unit_amount: unitAmount,
              product_data: productData
            },
            quantity: booking.quantity
          }
        ],
        mode: 'payment',
        metadata: {
          bookingId: booking._id.toString(),
          ticketId: booking.ticketId.toString(),
          quantity: booking.quantity.toString(),
          ticketTitle: ticket.ticketTitle
        },
        customer_email: booking.userEmail,
        success_url: `${config.siteDomain}/user/payment-success?payment_status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.siteDomain}/user/my-bookings?payment_status=cancelled`,
      } as any);

      return {
        url: session.url,
        sessionId: session.id
      };
    } catch (error: any) {
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  },

  async handlePaymentSuccess(sessionId: string) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== 'paid') {
        throw new Error('Payment not completed');
      }

      const bookingId = session.metadata?.bookingId;
      const ticketId = session.metadata?.ticketId;
      const quantity = parseInt(session.metadata?.quantity || '0', 10);
      const ticketTitle = session.metadata?.ticketTitle;

      if (!bookingId || !ticketId) {
        throw new Error('Invalid session metadata');
      }

      // Update booking status to 'paid' and store payment metadata
      const updatedBooking = await BookingModel.findByIdAndUpdate(
        bookingId,
        {
          status: 'paid',
          stripeSessionId: sessionId,
          paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
          amountPaid: session.amount_total ? session.amount_total / 100 : undefined,
          paymentDate: new Date(),
          ticketTitle,
        },
        { new: true }
      );

      if (!updatedBooking) {
        throw new Error('Booking not found');
      }

      // Ensure inventory is available before decrementing
      const updatedTicket = await TicketModel.findOneAndUpdate(
        { _id: ticketId, quantity: { $gte: quantity } },
        { $inc: { quantity: -quantity } },
        { new: true }
      );

      if (!updatedTicket) {
        throw new Error('Ticket not found');
      }

      return {
        success: true,
        booking: updatedBooking,
        ticket: updatedTicket
      };
    } catch (error: any) {
      throw new Error(`Failed to handle payment success: ${error.message}`);
    }
  },

  async getPaymentStatus(sessionId: string) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return {
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        metadata: session.metadata
      };
    } catch (error: any) {
      throw new Error(`Failed to retrieve payment status: ${error.message}`);
    }
  }
};
