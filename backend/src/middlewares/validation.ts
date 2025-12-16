import { Request, Response, NextFunction } from "express";
import { Product } from "../models/product";

export function validateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, price, quantity } = req.body as Partial<Product>;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Name is required." });
  }

  if (price === undefined || Number.isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ error: "Price must be a non-negative number." });
  }

  if (
    quantity === undefined ||
    !Number.isInteger(Number(quantity)) ||
    Number(quantity) < 0
  ) {
    return res.status(400).json({ error: "Quantity must be a non-negative integer." });
  }

  next();
}

