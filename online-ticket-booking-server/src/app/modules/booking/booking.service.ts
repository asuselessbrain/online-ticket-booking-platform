import BookingModel from './booking.model';
import { IBooking } from './booking.type';
import { TicketModel } from '../ticket/ticket.model';
import mongoose from 'mongoose';

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

const getUserBookingsWithMeta = async (
  userEmail: string,
  query?: { page?: string | number; limit?: string | number }
) => {
  const pageNum = Math.max(1, Number(query?.page) || 1);
  const limitNum = Math.max(1, Math.min(100, Number(query?.limit) || 9));
  const skipNum = (pageNum - 1) * limitNum;

  const [total, data] = await Promise.all([
    BookingModel.countDocuments({ userEmail }),
    BookingModel.find({ userEmail })
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum),
  ]);

  return {
    meta: { total, page: pageNum, limit: limitNum },
    data,
  };
};

const updateBookingStatus = async (
  bookingId: string,
  status: IBooking['status']
): Promise<IBooking | null> => {
  const booking = await BookingModel.findById(bookingId);
  
  if (!booking) {
    throw new Error('Booking not found');
  }

  // If rejecting (cancelled), restore ticket quantity
  if (status === 'cancelled' && booking.status !== 'cancelled') {
    await TicketModel.findByIdAndUpdate(
      booking.ticketId,
      { $inc: { quantity: booking.quantity } }
    );
  }

  const updated = await BookingModel.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true }
  );
  return updated;
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getUserBookingsWithMeta,
  updateBookingStatus,
};

// New: Get bookings for a vendor (with ticket info)
export const getVendorBookings = async (
  vendorEmail: string,
  query?: {
    searchTerm?: string;
    status?: string;
    sortBy?: string; // createdAt | total | quantity
    sortOrder?: 'asc' | 'desc';
    page?: string | number;
    limit?: string | number;
  }
) => {
  const searchTerm = query?.searchTerm?.trim();
  const status = query?.status?.toLowerCase();
  const sortBy = query?.sortBy || 'createdAt';
  const sortOrder = (query?.sortOrder === 'asc' ? 1 : -1) as 1 | -1;
  const pageNum = Math.max(1, Number(query?.page) || 1);
  const limitNum = Math.max(1, Math.min(100, Number(query?.limit) || 10));
  const skipNum = (pageNum - 1) * limitNum;

  const matchStage: any = { 'ticket.vendorEmail': vendorEmail };

  if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
    matchStage.status = status;
  }

  const searchOr: any[] = [];
  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    searchOr.push(
      { userName: regex },
      { userEmail: regex },
      { 'ticket.ticketTitle': regex }
    );
  }

  const sortFieldMap: Record<string, string> = {
    createdAt: 'createdAt',
    total: 'totalPrice',
    quantity: 'quantity',
  };
  const sortField = sortFieldMap[sortBy] || 'createdAt';

  const pipeline: any[] = [
    { $addFields: { ticketObjectId: { $toObjectId: '$ticketId' } } },
    {
      $lookup: {
        from: 'tickets',
        localField: 'ticketObjectId',
        foreignField: '_id',
        as: 'ticket',
      },
    },
    { $unwind: { path: '$ticket', preserveNullAndEmptyArrays: true } },
  ];

  if (searchOr.length) {
    pipeline.push({ $match: { $and: [matchStage, { $or: searchOr }] } });
  } else {
    pipeline.push({ $match: matchStage });
  }

  pipeline.push(
    {
      $sort: { [sortField]: sortOrder },
    },
    {
      $facet: {
        meta: [
          { $count: 'total' },
          { $addFields: { page: pageNum, limit: limitNum } },
        ],
        data: [
          { $skip: skipNum },
          { $limit: limitNum },
          {
            $project: {
              _id: 1,
              ticketId: 1,
              quantity: 1,
              userEmail: 1,
              userName: 1,
              totalPrice: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
              ticket: {
                _id: '$ticket._id',
                ticketTitle: '$ticket.ticketTitle',
                price: '$ticket.price',
                from: '$ticket.from',
                to: '$ticket.to',
                vendorEmail: '$ticket.vendorEmail',
              },
            },
          },
        ],
      },
    }
  );

  const agg = await BookingModel.aggregate(pipeline);
  const metaRaw = (agg?.[0]?.meta?.[0] as any) || { total: 0, page: pageNum, limit: limitNum };
  const data = agg?.[0]?.data || [];
  const meta = {
    total: Number(metaRaw.total || 0),
    page: pageNum,
    limit: limitNum,
  };

  return { meta, data };
};
