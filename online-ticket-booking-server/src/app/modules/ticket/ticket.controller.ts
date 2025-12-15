import { Request, Response } from "express"
import { TicketService } from "./ticket.service";

const createTicket = async (req: Request, res: Response) => {
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

const myAddedTicket = async (req: Request, res: Response) => {
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
    const { vendorEmail, ...updates } = req.body;

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

const deleteTicket = async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const vendorEmail = req.body.vendorEmail;

    try {
        const result = await TicketService.deleteTicket(ticketId as string, vendorEmail);
        if (result.deleted) {
            res.status(200).json({
                success: true,
                message: "Ticket deleted successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.reason || "Failed to delete ticket",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete ticket",
            error: error,
        });
    }
}

const updateTicketStatus = async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const { status } = req.body;

    try {
        const result = await TicketService.updateTicketStatus(ticketId as string, status);
        res.status(200).json({
            success: true,
            message: "Ticket status updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update ticket status",
            error: error,
        });
    }
}

const getAllTickets = async (req: Request, res: Response) => {
    try {
        const result = await TicketService.getAllTickets(req.query);
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

const addToAdvertisement = async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const { isAdvertised } = req.body;

    console.log(isAdvertised)

    try {
        const result = await TicketService.addToAdvertisement(ticketId as string, isAdvertised);
        res.status(200).json({
            success: true,
            message: "Ticket advertisement status updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update advertisement status",
            error: error,
        });
    }
}

export const TicketController = {
    createTicket,
    myAddedTicket,
    modifyTicketDetails,
    deleteTicket,
    updateTicketStatus,
    getAllTickets,
    addToAdvertisement,
};