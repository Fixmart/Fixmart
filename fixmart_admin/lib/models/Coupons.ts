import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  couponCode: String,
  percent: Number,
  startDate: Date,
  endDate: Date,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { toJSON: { getters: true } });

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;
