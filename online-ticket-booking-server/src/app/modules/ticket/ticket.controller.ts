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
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to create ticket",
            error: error,
        });
    }
}

const myAddedTicket = async(req: Request, res: Response) => {
    const vendorEmail = req.params.vendorEmail;
    try {
        const result = await TicketService.myAddedTicket(vendorEmail as string, req.query);
        res.status(200).json({
            success: true,
            message: "Tickets retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve tickets",
            error: error,
        });
    }
}

const modifyTicketDetails = async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const {vendorEmail, ...updates} = req.body;

    try {
        const result = await TicketService.modifyTicketDetails(ticketId as string, updates, vendorEmail);
        res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update ticket",
            error: error,
        });
    }
}


export const TicketController = {
    createTicket,
    myAddedTicket,
    modifyTicketDetails,
};