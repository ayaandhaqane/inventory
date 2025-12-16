import { Request, Response, NextFunction } from "express";

export function validateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, category_id, description, price, quantity } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required." });
  }

  if (!category_id || isNaN(Number(category_id))) {
    return res.status(400).json({ error: "Category is required." });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ error: "Description is required." });
  }

  if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ error: "Price must be a valid number." });
  }

  if (quantity === undefined || isNaN(Number(quantity)) || Number(quantity) < 0) {
    return res.status(400).json({ error: "Quantity must be a valid number." });
  }

  next();
}
