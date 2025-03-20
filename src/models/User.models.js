import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            require: true,
            lowercase : true,
            unique: true,
            trim : true,
            index : true        //mongoDB te searchable kore index.
        },
        email: {
            type: String,
            require: true,
            lowercase : true,
            unique: true,
            trim : true
        },
        fullname: {
            type: String,
            require: true,
            trim : true,
            index: true
        },
        avatar: {
            type: String,    //url
            require: true
        },
        coverImage: {
            type: String,    //url
            require: true
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            require: [true, 'Must be required']
        },
        refreshToken:{
            type: String
        }
}, {timestamps: true});

//password encrypt korar jonno
userSchema.pre("save", async function (next) {      //pre hook mongoose er jkhn kono pass save houar age ai suru hobe 
    if (!this.isModified("password")) return next();
        this.password =await bcrypt.hash(this.password, 10);   //password jodi mod hoy tobe pass bcript kore deo
    
        next();
});

//2ta password compair korar jonno
userSchema.methods.isPasswordCorrect = async function (password) {
   await bcrypt.compare(password, this.password)        // 2 pass compair kore old and new
};

//jwt er access neyar jonno JWT method use kore 
userSchema.methods.genarateAccessToken= function () { 
   return jwt.sign(
        {
        _id: this._id,
        email : this.email,
        fullname: this.fullname
        },
        process.env.ACCESS_TOKEN,
        {
        expiresIn: process.env.TOKEN_EXPIRE
        }
)
};
userSchema.methods.genarateRefrshToken= function () {
    return  jwt.sign(
        {
        _id: this._id,
        
        },
        process.env.REFRESH_TOKEN,
        {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
)
};

export const User = mongoose.model("User", userSchema)

// userSchema.save();
