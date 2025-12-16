import BookingModel from './booking.model';
import { IBooking } from './booking.type';
import { TicketModel } from '../ticket/ticket.model';

const createBooking = async (bookingData: IBooking): Promise<IBooking> => {
  // Check if ticket exists and has enough quantity
  const ticket = await TicketModel.findById(bookingData.ticketId);
  
  if (!ticket) {
    throw new Error('Ticket not found');
  }

  if (ticket.quantity < bookingData.quantity) {
    throw new Error(`Only ${ticket.quantity} tickets available`);
  }

  // Check if departure time has passed
  const departureDateTime = new Date(`${ticket.departureDate} ${ticket.departureTime}`);
  if (departureDateTime <= new Date()) {
    throw new Error('Booking closed - departure time has passed');
  }

  // Create booking
  const booking = await BookingModel.create(bookingData);

  // Update ticket quantity
  await TicketModel.findByIdAndUpdate(
    bookingData.ticketId,
    { $inc: { quantity: -bookingData.quantity } }
  );

  return booking;
};

const getUserBookings = async (userEmail: string): Promise<IBooking[]> => {
  const bookings = await BookingModel.find({ userEmail }).sort({ createdAt: -1 });
  return bookings;
};

const updateBookingStatus = async (
  bookingId: string,
  status: IBooking['status']
): Promise<IBooking | null> => {
  const booking = await BookingModel.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true }
  );
  return booking;
};

export const BookingService = {
  createBooking,
  getUserBookings,
  updateBookingStatus,
};
