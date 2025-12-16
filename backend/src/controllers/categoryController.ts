import { Request, Response } from "express";
import pool from "../database/connection";
import { Category } from "../models/category";

// GET all categories
export async function getCategories(_req: Request, res: Response) {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );
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
