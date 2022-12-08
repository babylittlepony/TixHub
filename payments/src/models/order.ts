import { OrderStatus } from "@tixproject/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  id: string;
  status: OrderStatus;
  userId: string;
  version: number;
  price: number;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  userId: string;
  version: number;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    status: attrs.status,
    userId: attrs.userId,
    version: attrs.version,
    price: attrs.price,
  });
};

export const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
