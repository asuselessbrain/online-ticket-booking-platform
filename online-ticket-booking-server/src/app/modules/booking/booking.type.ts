export interface IBooking {
  ticketId: string;
  quantity: number;
  userEmail: string;
  userName: string;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'paid';
  stripeSessionId?: string;
  paymentIntentId?: string;
  amountPaid?: number;
  paymentDate?: Date;
  ticketTitle?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
