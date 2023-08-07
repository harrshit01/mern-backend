import mongoose from "mongoose";
import { Schema } from "mongoose";
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: Buffer, required: true },
    role: { type: String, required: true, default:'user' },
    address: { type: [Schema.Types.Mixed] }, 
    // TODO:  We can make a separate Schema for this
    name: { type: String },
    salt :Buffer
});

const virtual = UserSchema.virtual("id");
virtual.get(function () {
    return this._id; //this is the id of the document in mongodb collection
})
UserSchema.set('toJSON', {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret) => { delete ret._id }
})

export const User = mongoose.model("User", UserSchema);