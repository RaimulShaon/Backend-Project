import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

//express er config korar jonno toiri kora 

app.use(express.json({limit:"16kb"}))       //json file asle tar limit lagbe
app.use(express.urlencoded({extended:true, limit: "16kb"}))     // onno kono url theke req asle accpt korar jonno 
app.use(express.static('pubilc'))       // kono pdf ba img asle public a save hobe

export {app}