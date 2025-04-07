
import { Router } from "express";
import { bookControllers } from "./books.controllers";
import { validateHeaderName } from "http";
import validateRequest from "../middlewares/validateRequest";
import { bookValidations } from "./books.validations";
import { upload } from "../../utils/sendImageToCloudinary";
import { parseTextDataToJsonData } from "./books.utils";

const router = Router() ;

router.post('/create-book' , upload.single("file") , parseTextDataToJsonData , validateRequest(bookValidations.createBookValidationSchema) , bookControllers.createBook) ;

export const booksRoutes = router ;
