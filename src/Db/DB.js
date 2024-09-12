import mongoose from "mongoose";
import { DB_Name } from "../constants.js";


const connectionDB = async ()=>{
    try {
        const connectionInIt = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
        console.log(`\n MongoDB connected from ${connectionInIt.connection.host}`);
    } catch (error) {
        console.log("Mongodb Connection Failed:", error);
        process.exit(1)
    }
}

export default connectionDB    