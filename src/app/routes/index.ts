
import { Router } from "express";
import { booksRoutes } from "../modules/books/books.routes";

const router = Router() ;

const moduleRoutes = [
    {
        path : "/books",
        route : booksRoutes ,
    },
]

moduleRoutes.forEach((route) => router.use(route.path , route.route)) ;

export default router ;
