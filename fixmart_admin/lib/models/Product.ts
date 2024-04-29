import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: String,
  ItemCode:String,
  HSNCode:String,
  description: String,
  media: [String],
  category: String,
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  tags: [String],
  size: String,
  color: String,
  Quantity:Number,
  price: { type: mongoose.Schema.Types.Decimal128, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
  expense: { type: mongoose.Schema.Types.Decimal128, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  QuantitySold:Number,
  PurchasedBy: [
    {  type: { type: mongoose.Schema.Types.ObjectId, ref: "Customer"},
       quantity: Number,
    },
  ],
}, { toJSON: { getters: true } });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;