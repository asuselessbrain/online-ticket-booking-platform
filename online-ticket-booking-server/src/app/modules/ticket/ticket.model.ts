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
      min: [0, "Price cannot be negative"],
    },

    quantity: {
      type: Number,
      required: [true, "Ticket quantity is required"],
      min: [1, "At least 1 ticket is required"],
    },

    departureDate: {
      type: String, // "2025-12-12"
      required: [true, "Departure date is required"],
    },

    departureTime: {
      type: String, // "10:30"
      required: [true, "Departure time is required"],
    },

    perks: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      required: [true, "Ticket image is required"],
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },

    isAdvertised: {
      type: Boolean,
      default: false,
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
