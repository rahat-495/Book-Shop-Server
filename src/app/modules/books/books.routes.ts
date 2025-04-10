

import { Router } from "express";
import { bookControllers } from "./books.controllers";
import { bookValidations } from "./books.validations";
import { upload } from "../../utils/sendImageToCloudinary";
import { parseTextDataToJsonData } from "./books.utils";
import validateRequest from "../../../middlewares/validateRequest";
import auth from "../../../middlewares/auth";

const router = Router();

router.get('/', bookControllers.getAllBooks);
router.delete('/:id', auth('admin'), bookControllers.removeBook);
router.get('/get-single-book/:id', bookControllers.getSingleBook);
router.post(
  '/create-book',
  upload.single('file'),
  parseTextDataToJsonData,
  validateRequest(bookValidations.createBookValidationSchema),
  auth('admin'),
  bookControllers.createBook
);
router.put(
  '/update-book/:id',
  upload.single('file'),
  parseTextDataToJsonData,
  validateRequest(bookValidations.updateBookValidationSchema),
  auth('admin'),
  bookControllers.updateBook
);

export const booksRoutes = router;
