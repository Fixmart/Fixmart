import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  discountCode: String,
  percent: Number,
  startDate: Date,
  endDate: Date,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;
