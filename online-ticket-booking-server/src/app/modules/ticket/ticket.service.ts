import { TicketModel } from "./ticket.model";
import { ITicket } from "./ticket.type";

const createTicketIntoDB = async (ticketData: ITicket): Promise<ITicket> => {

    const ticket = await TicketModel.create(ticketData);
    
    return ticket;
}

export const TicketService = {
    createTicketIntoDB,
};