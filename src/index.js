// import mongoose from "mongoose"; 
// import { DB_Name } from "./constants";
import dotenv from "dotenv";
import connectionDB from "./Db/DB.js";

dotenv.config({
    path: './env'
})
connectionDB()

// import express from "express";

// const app = express()

// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
//         app.on("errror", (error)=>{
//             console.log("errr:", error);
//             throw error
//         })
//         app.listen(process.env.PORT, ()=>{
//             console.log(`app is listening on port:${process.env.PORT}`);
//         })
//     }
//      catch (error) {
//         console.log("FAULT:", error)
//         throw Err;
        
// }
// })()

