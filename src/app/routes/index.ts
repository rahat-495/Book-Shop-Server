
import { Router } from "express";
import { booksRoutes } from "../modules/books/books.routes";
import authRoutes from "../modules/auth/auth.routes";

const router = Router() ;

const moduleRoutes = [
    {
        path : "/books",
        route : booksRoutes ,
    },
    {
        path : "/auth",
        route : authRoutes ,
    }
]

moduleRoutes.forEach((route) => router.use(route.path , route.route)) ;

export default router ;
