import { Request, Response } from "express"
import { TicketService } from "./ticket.service";

const createTicket = async(req: Request, res: Response) => {
    const ticketData = req.body;

    try {
        const result = await TicketService.createTicketIntoDB(ticketData);
        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create ticket",
            error: error,
        });
    }
}

export const TicketController = {
    createTicket,
};