
import { model, Schema } from "mongoose";
import { TBook } from "./books.interfaces";

const bookSchema = new Schema<TBook>({
    title : {
        type : String ,
        required : true,
    },
    description : {
        type : String ,
        required : true,
    },
    author : {
        type : String ,
        required : true,
    },
    category: {
        type: String,
        required: true,
        enum: ["Fiction", "Non-Fiction", "Fantasy", "History", "Science", "Biography"],
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    stock: {
        type: Number,
        required: true,
        min: 1,
    },
    publishedDate: {
        type: String,
        required: true,
    },
    availability: {
        type: String,
        enum : ["Available" , "Unavailable"] ,
        default : "Available" ,
    },
},{
    timestamps : true,
})

export const booksModel = model<TBook>("Book" , bookSchema) ;
