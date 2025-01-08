import mongoose, { Schema, Types } from "mongoose";
import { User } from "./User.models";

const subsriptionSchema = new mongoose.Schema({
subsriber :{
    Type: Schema.Types.ObjectId,
    ref: "User"
},
channel: {
    Type: Schema.Types.ObjectId,
    ref: "User"
}

}, {timestamps: true});


export const subsribe = mongoose.model("subscribe", subsriptionSchema)