import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController";
import { validateProduct } from "../middlewares/validation";
import { upload } from "../middlewares/upload";

const router = Router();

router.get("/products", getProducts);
router.post("/products", upload.single("image"),  validateProduct, createProduct
);

router.put( "/products/:id", upload.single("image"),  validateProduct, updateProduct
);
router.delete("/products/:id", deleteProduct);

export default router;

