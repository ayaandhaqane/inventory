import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController";
import { validateProduct } from "../middlewares/validation";

const router = Router();

router.get("/products", getProducts);
router.post("/products", validateProduct, createProduct);
router.put("/products/:id", validateProduct, updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;

