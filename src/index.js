// import mongoose from "mongoose"; 
// import { DB_Name } from "./constants";
import dotenv from "dotenv";
import connectionDB from "./Db/DB.js";
import app from "app";


dotenv.config({
    path: './env'
})
connectionDB()
.then(()=>{
app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is connected from: ${process.env.PORT}`);
})
})

.catch ((error)=>{
console.log(`Connection Failed: ${error}`);
}) 





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

