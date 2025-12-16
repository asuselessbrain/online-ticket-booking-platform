import mongoose, { Schema, Model } from 'mongoose';
import { IBooking } from './booking.type';

const BookingSchema = new Schema<IBooking>(
  {
    ticketId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'cancelled'], 
      default: 'pending' 
    },
  },
  { timestamps: true }
);

export const BookingModel: Model<IBooking> = mongoose.model<IBooking>('Booking', BookingSchema);

export default BookingModel;
