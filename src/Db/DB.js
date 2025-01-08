import mongoose from "mongoose";
import { DB_Name } from "../constants.js";



//connection with mongoose..
const connectionDB = async ()=>{
    try {
        const connectionInIt = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
        console.log(`\n MongoDB connected from ${connectionInIt.connection.host}`);     //jeijaygay connection hoitece ta dekhar jonno ai consolelog kore dekha jate connection vul na hoy.
    } catch (error) {
        console.log("Mongodb Connection Failed:", error);
        process.exit(1)  //node js process er access dey exit(1)node preceess fails er karone terminate kore ber kore dey
    }
}

export default connectionDB    