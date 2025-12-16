import { Request, Response } from 'express';
import { BookingService } from './booking.service';

const createBooking = async (req: Request, res: Response) => {
  try {
    const bookingData = req.body;
    const booking = await BookingService.createBooking(bookingData);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.email;
    const bookings = await BookingService.getUserBookings(userEmail as string);

    res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    const booking = await BookingService.updateBookingStatus(bookingId as string, status);

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const BookingController = {
  createBooking,
  getUserBookings,
  updateBookingStatus,
};
