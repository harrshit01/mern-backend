import mongoose from "mongoose";
import { Schema } from "mongoose";
const CategorySchema = new Schema({
    label: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
});

const virtual = CategorySchema.virtual("id");
virtual.get(function () {
    return this._id; //this is the id of the document in mongodb collection
})
CategorySchema.set('toJSON', {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret) => { delete ret._id }
})

export const Category = mongoose.model("Category", CategorySchema);