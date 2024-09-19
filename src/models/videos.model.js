import mongoose, { Schema } from "mongoose";
import { User } from "./User.models";
import mongoosepaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema(
    {
        videoFile:{
            type: String,       //cloudnary URL
            require: true
        },
        thumbnail:{
            type: String,       //cloudnary URL
            require: true
        },
        title:{
            type: String,       //cloudnary URL
            require: true
        },
        discription:{
            type: String,       //cloudnary URL
            require: true
        },
        duration:{
            type: Number,      
            require: true
        },
        
        views:{
            type: Number,      
            default: 0 
        },
        isPublished:{
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: User
        }
    }, {timestamps: true})


    videoSchema.plugin(mongoosepaginate)
export const Video = mongoose.model("Video", videoSchema)    