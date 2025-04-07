
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';

const app = express() ;

app.use(express.json()) ;
app.use(cors({origin : ['http://localhost:5173'] , credentials : true})) ;
app.use(cookieParser()) ;

app.use("/api/v1" , router) ;

app.get('/', (req, res) => {
    res.json({success : true , message : "Book shop server is running !"}) ;
})

export default app ;
