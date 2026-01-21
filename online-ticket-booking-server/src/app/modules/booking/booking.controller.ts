import { Request, Response } from 'express';
import { BookingService } from './booking.service';
import { getVendorBookings, getVendorRevenue } from './booking.service';

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
    const result = await BookingService.getUserBookingsWithMeta(userEmail as string, req.query as any);

    res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const getUserTransactions = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.email;
    const result = await BookingService.getUserTransactions(userEmail as string, req.query as any);

    res.status(200).json({
      success: true,
      message: 'Transactions fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getVendorRevenueSummary = async (req: Request, res: Response) => {
  try {
    const vendorEmail = req.params.email;
    const data = await getVendorRevenue(vendorEmail as string);

    res.status(200).json({ success: true, message: 'Revenue summary fetched successfully', data });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
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
  getUserTransactions,
};

export const getBookingsForVendor = async (req: Request, res: Response) => {
  try {
    const vendorEmail = req.params.email;
    const result = await getVendorBookings(vendorEmail as string, req.query as any);
    res.status(200).json({ success: true, message: 'Vendor bookings fetched successfully', ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
