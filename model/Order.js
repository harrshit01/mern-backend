import mongoose from "mongoose";
import { Schema } from "mongoose";
const paymentMethods = {
  values: ['card', 'cash'],
  message: 'enum validator failed for payment Methods'
}
const OrderSchema = new Schema(
  {
    items: { type: [Schema.Types.Mixed], required: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'pending' },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
  }
);

const virtual = OrderSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
OrderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const Order = mongoose.model('Order', OrderSchema);