
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { bookServices } from "./books.services";

const createBook = catchAsync(async (req , res) => {
    const result = await bookServices.createBookIntoDb(req.file , req.body) ;
    if(result){
        sendResponse<object>(res , {data : result , success : true , statusCode : 200 , message : "Book created successfully !"}) ;
    }
})

export const bookControllers = {
    createBook ,
}
