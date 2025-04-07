
import { Router } from "express";
import { bookControllers } from "./books.controllers";
import validateRequest from "../middlewares/validateRequest";
import { bookValidations } from "./books.validations";
import { upload } from "../../utils/sendImageToCloudinary";
import { parseTextDataToJsonData } from "./books.utils";

const router = Router() ;

router.post('/create-book' , upload.single("file") , parseTextDataToJsonData , validateRequest(bookValidations.createBookValidationSchema) , bookControllers.createBook) ;
router.get('/' , bookControllers.getAllBooks)

export const booksRoutes = router ;
