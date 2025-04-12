
import { z } from "zod"

const createBookValidationSchema = z.object({
    body : z.object({
        title: z.string() ,
        author: z.string().email() ,
        description: z.string() ,
        category: z.enum(["Fiction" , "Non-Fiction" , "Fantasy" , "History" , "Science" , "Biography"]) ,
        price: z.number() ,
        stock: z.number().min(1) ,
        publishedDate: z.string() ,
        availability: z.enum(["Available" , "Unavailable"]).optional() ,
    })
})

const updateBookValidationSchema = z.object({
    body : z.object({
        title: z.string().optional() ,
        author: z.string().optional() ,
        description: z.string().optional() ,
        category: z.enum(["Fiction" , "Non-Fiction" , "Fantasy" , "History" , "Science" , "Biography"]).optional() ,
        price: z.number().optional() ,
        stock: z.number().min(1).optional() ,
        publishedDate: z.string().optional() ,
        availability: z.enum(["Available" , "Unavailable"]).optional() ,
    })
})

export const bookValidations = {
    createBookValidationSchema ,
    updateBookValidationSchema ,
}
