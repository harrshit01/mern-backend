import mongoose, { Schema } from "mongoose";
const ProductSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: [0, "wrong min price"] },
    discountPercentage: { type: Number, min: [1, "wrong min discount"], max: [100, "wrong max discount"] },
    rating: { type: Number, min: [1, "wrong min rating"], max: [5, "wrong max rating"], default: 0 },
    stock: { type: Number, default: 0 },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true }
});
const virtual = ProductSchema.virtual('id');
virtual.get(function () {
    return this._id;
});
ProductSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});
export const Product = mongoose.model("Product", ProductSchema);

// {
//     "id": 1,
//     "title": "iPhone 9",
//     "description": "An apple mobile which is nothing like apple",
//     "price": 549,
//     "discountPercentage": 12.96,
//     "rating": 4.69,
//     "stock": 0,
//     "brand": "Apple",
//     "category": "smartphones",
//     "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
//     "images": [
//       "https://i.dummyjson.com/data/products/1/1.jpg",
//       "https://i.dummyjson.com/data/products/1/2.jpg",
//       "https://i.dummyjson.com/data/products/1/3.jpg",
//       "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
//     ],
//     "deleted": true
//   },