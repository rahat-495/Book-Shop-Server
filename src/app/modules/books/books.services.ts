
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { TBook } from "./books.interfaces"
import { booksModel } from "./books.model";

const createBookIntoDb = async (file : any , payload : TBook) => {
    // check the author is valid or not ------------------
    if(file){
        const path = file.path ;
        const imageName = `${payload.title}${payload.category}` ;
        const {secure_url} = await sendImageToCloudinary(imageName , path) as any ;
        payload.image = secure_url ;
    }
    console.log(file);
    const result = await booksModel.create(payload) ;
    return result ;
}

export const bookServices = {
    createBookIntoDb ,
}
