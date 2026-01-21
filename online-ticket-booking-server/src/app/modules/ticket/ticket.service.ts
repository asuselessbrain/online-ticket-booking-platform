import { TicketModel } from "./ticket.model";
import { ITicket } from "./ticket.type";

type MyTicketsQuery = {
    page?: number;
    limit?: number;
    sort?: string;
    searchTerm?: string;
    transportType?: ITicket["transportType"];
    verificationStatus?: ITicket["verificationStatus"];
    from?: string;
    to?: string;
    departureDate?: string;
    minPrice?: number;
    maxPrice?: number;
};

const createTicketIntoDB = async (ticketData: ITicket): Promise<ITicket> => {

    const ticket = await TicketModel.create(ticketData);

    return ticket;
}

const myAddedTicket = async (
    vendorEmail: string,
    query: MyTicketsQuery = {}
): Promise<{ data: ITicket[]; meta: { page: number; limit: number; total: number } }> => {
    const {
        page = 1,
        limit = 10,
        sort = "desc",
        searchTerm,
        transportType,
        verificationStatus,
        from,
        to,
        departureDate,
        minPrice,
        maxPrice,
    } = query;


    const filterAnd = [{ vendorEmail } as Record<string, unknown>];

    // Text search across selected fields
    if (searchTerm && searchTerm.trim().length > 0) {
        const regex = new RegExp(searchTerm, "i");
        filterAnd.push({
            $or: [
                { ticketTitle: regex },
                { from: regex },
                { to: regex },
                { transportType: regex },
                { vendorName: regex },
            ],
        });
    }

    // Exact-match filters
    if (transportType) filterAnd.push({ transportType });
    if (verificationStatus) filterAnd.push({ verificationStatus });
    if (from) filterAnd.push({ from });
    if (to) filterAnd.push({ to });
    if (departureDate) filterAnd.push({ departureDate });

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
        const price: Record<string, number> = {};
        if (minPrice !== undefined) price.$gte = minPrice;
        if (maxPrice !== undefined) price.$lte = maxPrice;
        filterAnd.push({ price });
    }

    const filters = filterAnd.length ? { $and: filterAnd } : {};

    // Parse sort parameter: supports formats like "createdAt", "-createdAt", or "asc"/"desc"
    let sortStage: Record<string, 1 | -1> = { createdAt: -1 };
    if (typeof sort === 'string') {
        if (sort === 'asc') {
            sortStage = { createdAt: 1 };
        } else if (sort === 'desc') {
            sortStage = { createdAt: -1 };
        } else if (sort.startsWith('-')) {
            const field = sort.substring(1);
            sortStage = { [field]: -1 };
        } else {
            sortStage = { [sort]: 1 };
        }
    }
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        TicketModel.find(filters)
            .sort(sortStage)
            .skip(skip)
            .limit(limit),
        TicketModel.countDocuments(filters),
    ]);

    return {
        data: data as unknown as ITicket[],
        meta: { page, limit, total },
    };
}

const modifyTicketDetails = async (
    ticketId: string,
    updates: Partial<ITicket>,
    vendorEmail?: string
): Promise<ITicket | null> => {
    const filter: Record<string, unknown> = { _id: ticketId };
    if (vendorEmail) filter.vendorEmail = vendorEmail;

    const updated = await TicketModel.findOneAndUpdate(filter, updates, {
        new: true,
        runValidators: true,
    });

    return updated as unknown as ITicket | null;
}

const deleteTicket = async (
    ticketId: string,
    vendorEmail?: string
): Promise<{ deleted: boolean; reason?: string }> => {
    const filter: Record<string, unknown> = { _id: ticketId };
    if (vendorEmail) filter.vendorEmail = vendorEmail;

    const ticket = await TicketModel.findOne(filter);
    if (!ticket) {
        return { deleted: false, reason: "Ticket not found or not owned" };
    }

    if (ticket.verificationStatus === "rejected") {
        return { deleted: false, reason: "Rejected tickets cannot be deleted" };
    }

    await TicketModel.deleteOne({ _id: ticket._id });
    return { deleted: true };
}

const updateTicketStatus = async (
    ticketId: string,
    status: ITicket["verificationStatus"]
): Promise<ITicket | null> => {
    const updated = await TicketModel.findByIdAndUpdate(
        ticketId,
        { verificationStatus: status },
        { new: true, runValidators: true }
    );
    return updated;
}

type GetAllTicketsQuery = MyTicketsQuery;

const getAllTickets = async (
    query: GetAllTicketsQuery = {}
): Promise<{ data: ITicket[]; meta: { page: number; limit: number; total: number } }> => {
    const {
        page = 1,
        limit = 10,
        sort = "desc",
        searchTerm,
        transportType,
        verificationStatus,
        from,
        to,
        departureDate,
        minPrice,
        maxPrice,
    } = query;

    const filterAnd: Record<string, unknown>[] = [];

    if (searchTerm && searchTerm.trim().length > 0) {
        const regex = new RegExp(searchTerm, "i");
        filterAnd.push({
            $or: [
                { ticketTitle: regex },
                { from: regex },
                { to: regex },
                { transportType: regex },
                { vendorName: regex },
            ],
        });
    }

    if (transportType) filterAnd.push({ transportType });
    if (verificationStatus) filterAnd.push({ verificationStatus });
    if (from) filterAnd.push({ from });
    if (to) filterAnd.push({ to });
    if (departureDate) filterAnd.push({ departureDate });

    if (minPrice !== undefined || maxPrice !== undefined) {
        const price: Record<string, number> = {};
        if (minPrice !== undefined) price.$gte = minPrice;
        if (maxPrice !== undefined) price.$lte = maxPrice;
        filterAnd.push({ price });
    }

    const filters = filterAnd.length ? { $and: filterAnd } : {};
    
    // Parse sort parameter: supports formats like "createdAt", "-createdAt", or "asc"/"desc"
    let sortStage: Record<string, 1 | -1> = { createdAt: -1 };
    if (typeof sort === 'string') {
        if (sort === 'asc') {
            sortStage = { createdAt: 1 };
        } else if (sort === 'desc') {
            sortStage = { createdAt: -1 };
        } else if (sort.startsWith('-')) {
            const field = sort.substring(1);
            sortStage = { [field]: -1 };
        } else {
            sortStage = { [sort]: 1 };
        }
    }
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        TicketModel.find(filters).sort(sortStage).skip(skip).limit(limit),
        TicketModel.countDocuments(filters),
    ]);

    return { data: data as unknown as ITicket[], meta: { page, limit, total } };
}

const addToAdvertisement = async (
    ticketId: string,
    isAdvertised: boolean
): Promise<ITicket | null> => {
    const updated = await TicketModel.findByIdAndUpdate(
        ticketId,
        { isAdvertised },
        { new: true, runValidators: true }
    );
    return updated;
}

const getApprovedTickets = async (
    query: GetAllTicketsQuery = {}
): Promise<{ data: ITicket[]; meta: { page: number; limit: number; total: number } }> => {
    const {
        page = 1,
        limit = 10,
        sort = "-createdAt",
        searchTerm,
        transportType,
        from,
        to,
        departureDate,
        minPrice,
        maxPrice,
    } = query;

    const filterAnd: Record<string, unknown>[] = [{ verificationStatus: 'approved' }];

    if (searchTerm && searchTerm.trim().length > 0) {
        const regex = new RegExp(searchTerm, "i");
        filterAnd.push({
            $or: [
                { ticketTitle: regex },
                { from: regex },
                { to: regex },
                { transportType: regex },
                { vendorName: regex },
            ],
        });
    }

    if (transportType) filterAnd.push({ transportType });
    if (from) filterAnd.push({ from });
    if (to) filterAnd.push({ to });
    if (departureDate) filterAnd.push({ departureDate });

    if (minPrice !== undefined || maxPrice !== undefined) {
        const price: Record<string, number> = {};
        if (minPrice !== undefined) price.$gte = minPrice;
        if (maxPrice !== undefined) price.$lte = maxPrice;
        filterAnd.push({ price });
    }

    const filters = { $and: filterAnd };
    
    let sortStage: Record<string, 1 | -1> = { createdAt: -1 };
    if (typeof sort === 'string') {
        if (sort === 'asc') {
            sortStage = { createdAt: 1 };
        } else if (sort === 'desc') {
            sortStage = { createdAt: -1 };
        } else if (sort.startsWith('-')) {
            const field = sort.substring(1);
            sortStage = { [field]: -1 };
        } else {
            sortStage = { [sort]: 1 };
        }
    }
    
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        TicketModel.find(filters).sort(sortStage).skip(skip).limit(limit),
        TicketModel.countDocuments(filters),
    ]);

    return { data: data as unknown as ITicket[], meta: { page, limit, total } };
}

const getSingleTicket = async (ticketId: string): Promise<ITicket | null> => {
    const ticket = await TicketModel.findById(ticketId);
    return ticket as unknown as ITicket | null;
}

const getUniqueLocations = async (): Promise<{ from: string[]; to: string[] }> => {
    const [fromLocations, toLocations] = await Promise.all([
        TicketModel.distinct('from', { verificationStatus: 'approved' }),
        TicketModel.distinct('to', { verificationStatus: 'approved' }),
    ]);

    return {
        from: fromLocations.sort(),
        to: toLocations.sort(),
    };
}

export const TicketService = {
    createTicketIntoDB,
    myAddedTicket,
    modifyTicketDetails,
    deleteTicket,
    updateTicketStatus,
    getAllTickets,
    addToAdvertisement,
    getApprovedTickets,
    getSingleTicket,
    getUniqueLocations
};