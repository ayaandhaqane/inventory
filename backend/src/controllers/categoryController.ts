import { Request, Response } from "express";
import pool from "../database/connection";
import { Category } from "../models/category";

// GET all categories
export async function getCategories(_req: Request, res: Response) {
  try {
    const result = await pool.query(
      "SELECT id, name FROM categories ORDER BY name ASC"
    );

    // ✅ send ARRAY only
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}


// CREATE category
export async function createCategory(req: Request, res: Response) {
  const { name } = req.body as Category;

  try {
    const result = await pool.query(
      `
      INSERT INTO categories (name)
      VALUES ($1)
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING *
      `,
      [name.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create category" });
  }
}



// UPDATE category
export async function updateCategory(req: Request, res: Response) {
  const { id } = req.params;
  const { name } = req.body as Category;

  try {
    const result = await pool.query(
      `
      UPDATE categories
      SET name = $1
      WHERE id = $2
      RETURNING *
      `,
      [name.trim(), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update category" });
  }
}


// Delete a category by ID
export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete category" });
  }
}