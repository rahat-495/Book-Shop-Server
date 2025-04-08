
import { NextFunction, Request, Response } from "express";

export const parseTextDataToJsonData = (req : Request , res : Response , next : NextFunction) => {
    if(req?.body?.data){
        req.body = JSON.parse(req.body.data) ;
        next() ;
    }
    next() ;
}
