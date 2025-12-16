export interface IBooking {
  ticketId: string;
  quantity: number;
  userEmail: string;
  userName: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}
