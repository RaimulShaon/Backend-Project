import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

//cors er config
app.use(cors({
    origin: process.env.CORS_ORIGIN,     //options of origin
    Credential: true,
    optionsSuccessStatus: 200
}))
 
//express er config korar jonno toiri kora 

app.use(express.json({limit:"16kb"}))       //json file asle tar limit lagbe
app.use(express.urlencoded({extended:true, limit: "16kb"}))     // onno kono url theke req asle accpt korar jonno 
app.use(express.static('pubilc'))       // kono pdf ba img asle public a save hobe
app.use(cookieParser())


//routes config

import userRouter from "./routes/user.routs.js";

//routs declaration
app.use("/users", userRouter)



export default {app};