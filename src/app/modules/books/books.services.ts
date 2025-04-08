
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errors/AppError";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { User } from "../users/user.model";
import { TBook } from "./books.interfaces"
import { booksModel } from "./books.model";

const createBookIntoDb = async (file : any , payload : TBook) => {
    const isUserExist = await User.findOne({email : payload.author}) ;   
    if(!isUserExist){
        throw new AppError(404 , "User not found") ;
    }

    if(file){
        const path = file.path ;
        const imageName = `${payload.title}${payload.category}` ;
        const {secure_url} = await sendImageToCloudinary(imageName , path) as any ;
        payload.image = secure_url ;
    }

    const result = await booksModel.create(payload) ;
    return result ;
}

const getAllBooksFromDb = async (query : any) => {
    const page = Number(query?.page) || 1 ;
    const limit = Number(query?.limit) || 10 ;
    const skip = (page - 1) * limit ;

    const filter: any = {};

    if (query.searchTerm) {
        filter.$or = [
          { title: { $regex: query.searchTerm, $options: "i" } },
          { author: { $regex: query.searchTerm, $options: "i" } },
          { category: { $regex: query.searchTerm, $options: "i" } },
        ];
    }

    if (query.author) {
        filter.author = query.author;
    }

    if (query.category) {
        filter.category = query.category;
    }

    if (query.availability) {
        filter.availability = query.availability ;
    }

    if (query.minPrice && query.maxPrice) {
        filter.price = {
            $gte: Number(query.minPrice),
            $lte: Number(query.maxPrice),
        };
    } else if (query.minPrice) {
        filter.price = { $gte: Number(query.minPrice) };
    } else if (query.maxPrice) {
        filter.price = { $lte: Number(query.maxPrice) };
    }

    const total = await booksModel.find(filter).estimatedDocumentCount() ;
    const result = await booksModel.find(filter).skip(skip).limit(limit) ;
    const totalPage = Math.ceil(result.length / limit) ;

    return { result , meta : { limit , page , total , totalPage }};
}

const getSingleBookFromDb = async (id : string) => {
    const result = await booksModel.findById(id) ;
    if(!result){
        throw new AppError(404 , "Book not found") ;
    }
    return result ;
}

const removeBookFromDb = async (id : string) => {
    const result = await booksModel.findByIdAndDelete(id) ;
    if(!result){
        throw new AppError(404 , "Book not found") ;
    }
    return result ;
}

const updateBookIntoDb = async (id : string , file : any , payload : Partial<TBook>) => {
    const isBookAxist = await booksModel.findById(id) ;
    if(!isBookAxist){
        throw new AppError(404 , "Book not found") ;
    }

    if(file){
        const path = file.path ;
        const imageName = `${payload.title}${payload.category}` ;
        const {secure_url} = await sendImageToCloudinary(imageName , path) as any ;
        payload.image = secure_url ;
    }
    console.log(payload);

    const result = await booksModel.findByIdAndUpdate(id , payload , {new : true}) ;
    return result ;
}

export const bookServices = {
    updateBookIntoDb ,
    removeBookFromDb ,
    createBookIntoDb ,
    getAllBooksFromDb ,
    getSingleBookFromDb ,
}
