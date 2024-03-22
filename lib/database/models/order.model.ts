import { Schema, model, models, Document } from "mongoose";

export interface IOrder extends Document {
  createdAt: Date;
  stripeId: string;
  totalAmount: string;
  event: { _id: string; title: string };
  buyer: { _id: string; firstName: string; lastName: string };
  organizer: { _id: string; firstName: string; lastName: string };
}

export type IOrderItem = {
  _id: string;
  createdAt: Date;
  totalAmount: string;
  eventTitle: string;
  eventId: string;
  buyer: string;
  organizer: string;
};

const OrderSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  stripeId: { type: String, required: true, unique: true },
  totalAmount: { type: String },
  event: { type: Schema.Types.ObjectId, ref: "Event" },
  buyer: { type: Schema.Types.ObjectId, ref: "User" },
  organizer: { type: Schema.Types.ObjectId, ref: "User" },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
