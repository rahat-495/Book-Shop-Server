
import { Router } from "express";
import { bookControllers } from "./books.controllers";
import { bookValidations } from "./books.validations";
import { upload } from "../../utils/sendImageToCloudinary";
import { parseTextDataToJsonData } from "./books.utils";
import validateRequest from "../../../middlewares/validateRequest";

const router = Router() ;

router.post('/create-book' , upload.single("file") , parseTextDataToJsonData , validateRequest(bookValidations.createBookValidationSchema) , bookControllers.createBook) ;

export const booksRoutes = router ;
