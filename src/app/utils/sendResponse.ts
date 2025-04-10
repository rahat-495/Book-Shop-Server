import { Response } from 'express';

type TMeta = {
  limit : number ;
  page : number ;
  total : number ;
  totalPage : number ;
}

type TResponse<T> = {
  data : T ;
  success : boolean;
  message ?: string ;
  meta ?: TMeta ;
  statusCode : number ;
}

const sendResponse = <T>(res : Response , payload : TResponse<T>) => {
  res.status(payload?.statusCode).json({
      success : payload?.success ,
      message : payload?.message ,
      meta : payload?.meta,
      data : payload?.data ,
  })
}

export default sendResponse ;
