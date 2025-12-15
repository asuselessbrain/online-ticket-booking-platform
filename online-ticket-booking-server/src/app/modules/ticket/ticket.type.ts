export interface ITicket {
    ticketTitle: string;

    from: string;
    to: string;

    transportType: "bus" | "train" | "air" | "launch";

    price: number;
    quantity: number;

    verificationStatus: "pending" | "approved" | "rejected";

    isAdvertised: boolean;


    departureDate: string;
    departureTime: string;

    perks: string[];

    image: string;

    vendorName: string;
    vendorEmail: string;
}
