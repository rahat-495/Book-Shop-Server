
import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import { booksRoutes } from "../modules/books/books.routes";

const router = Router() ;

const moduleRoutes = [
    {
        path : "/auth",
        route : authRoutes ,
        
    },
    {
        path : "/books",
        route : booksRoutes ,
    }
]

moduleRoutes.forEach((route) => router.use(route.path , route.route)) ;

export default router ;
