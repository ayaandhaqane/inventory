import { Request, Response } from "express";
import pool from "../database/connection";
import { Product } from "../models/product";

// GET all products (with category name)
export async function getProducts(_req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.quantity,
        p.category_id,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
}

// CREATE product
export async function createProduct(req: Request, res: Response) {
  const { name, category_id, description, price, image, quantity } =
    req.body as Product;

  try {
    const result = await pool.query(
      `
      INSERT INTO products (name, category_id, description, price, image, quantity)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        name.trim(),
        category_id,
        description ?? "",
        price,
        image ?? "",
        quantity,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product." });
  }
}

// UPDATE product
export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const { name, category_id, description, price, image, quantity } =
    req.body as Product;

  try {
    const result = await pool.query(
      `
      UPDATE products
      SET name = $1,
          category_id = $2,
          description = $3,
          price = $4,
          image = $5,
          quantity = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        name.trim(),
        category_id,
        description ?? "",
        price,
        image ?? "",
        quantity,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product." });
  }
}

// DELETE product
export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product." });
  }
}
