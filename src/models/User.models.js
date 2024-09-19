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
            index : true
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
                type: Schema.types.ObjectId,
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
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password =await bcrypt.hash(this.password, 10);   
    }
        next();
});

//2ta password compair korar jonno
userSchema.methods.isPasswordCorrect = async function (password) {
   await bcrypt.compare(password, this.password)
};

//jwt er access neyar jonno
userSchema.methods.genarateToken= function () {
    jwt.sign(
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
    jwt.sign(
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

userSchema.save();