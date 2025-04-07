
import { z } from "zod"

const createBookValidationSchema = z.object({
    body : z.object({
        title: z.string() ,
        author: z.string() ,
        description: z.string() ,
        category: z.enum(["Fiction" , "Non-Fiction" , "Fantasy" , "History" , "Science" , "Biography"]) ,
        price: z.number() ,
        stock: z.number().min(1) ,
        publishedDate: z.string() ,
    })
})

export const bookValidations = {
    createBookValidationSchema ,
}
