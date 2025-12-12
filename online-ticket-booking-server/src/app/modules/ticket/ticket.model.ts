import { Schema, model } from "mongoose";

const TicketSchema = new Schema(
  {
    ticketTitle: {
      type: String,
      required: [true, "Ticket title is required"],
      trim: true,
    },

    from: {
      type: String,
      required: [true, "From location is required"],
    },

    to: {
      type: String,
      required: [true, "To location is required"],
    },

    transportType: {
      type: String,
      enum: ["bus", "train", "air", "launch"],
      required: [true, "Transport type is required"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Ticket quantity is required"],
    },

    departureDateTime: {
      type: Date,
      required: [true, "Departure date & time is required"],
    },

    perks: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      required: [true, "Ticket image is required"],
    },

    vendorName: {
      type: String,
      required: [true, "Vendor name is required"],
    },

    vendorEmail: {
      type: String,
      required: [true, "Vendor email is required"],
    },
  },
  { timestamps: true }
);

export const TicketModel = model("Ticket", TicketSchema);
