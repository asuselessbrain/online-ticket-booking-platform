export interface ITicket {
  ticketTitle: string;

  from: string;
  to: string;

  transportType: "bus" | "train" | "air" | "launch";

  price: number;            
  quantity: number;    

  departureDateTime: Date;

  perks: string[];  

  image: string;  

  vendorName: string; 
  vendorEmail: string;
}
