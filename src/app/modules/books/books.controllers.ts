
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { bookServices } from "./books.services";

const createBook = catchAsync(async (req , res) => {
    const result = await bookServices.createBookIntoDb(req.file , req.body) ;
    if(result){
        sendResponse<object>(res , {data : result , success : true , statusCode : 200 , message : "Book created successfully !"}) ;
    }
})

const getAllBooks = catchAsync(async (req , res) => {
    const result = await bookServices.getAllBooksFromDb(req.query) ;
    if(result){
        sendResponse<object>(res , {data : result.result , meta : result.meta , success : true , statusCode : 200 , message : "Books retribed successfully !"}) ;
    }
})

const getSingleBook = catchAsync(async (req , res) => {
    const result = await bookServices.getSingleBookFromDb(req.params.id) ;
    if(result){
        sendResponse<object>(res , {data : result , success : true , statusCode : 200 , message : "Book retribed successfully !"}) ;
    }
})

export const bookControllers = {
    createBook ,
    getAllBooks ,
    getSingleBook ,
}
