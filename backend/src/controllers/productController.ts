import { Request, Response } from "express";
import pool from "../database/connection";
import { Product } from "../models/product";

// GET all products
export async function getProducts(req: Request, res: Response) {
  try {
    const { category_id } = req.query;

    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.quantity,
        p.category_id,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;

    const values: any[] = [];

    if (category_id) {
      query += " WHERE p.category_id = $1";
      values.push(category_id);
    }

    query += " ORDER BY p.id ASC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}


// CREATE product
// export async function createProduct(req: Request, res: Response) {
//   const { name, category_id, description, price, quantity } =
//     req.body as Product;

//   if (!req.file) {
//     return res.status(400).json({ error: "Product image is required." });
//   }

//   const imagePath = req.file.path; // This is the path to the image in the server

//   try {
//     const result = await pool.query(
//       `
//       INSERT INTO products (name, category_id, description, price, image, quantity)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING *
//       `,
//       [
//         name.trim(),
//         category_id,
//         description,
//         price,
//         imagePath,
//         quantity,
//       ]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to create product." });
//   }
// }


export async function createProduct(req: Request, res: Response) {
  console.log(" CREATE PRODUCT HIT");

  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      console.log(" NO FILE RECEIVED");
      return res.status(400).json({ error: "Product image is required." });
    }

    const { name, category_id, description, price, quantity } = req.body;

    console.log(" TYPES:", {
      nameType: typeof name,
      categoryType: typeof category_id,
      priceType: typeof price,
      quantityType: typeof quantity,
    });

    const imagePath = req.file.path;
    console.log("CLOUDINARY URL:", imagePath);

    console.log("INSERTING INTO DB...");

    const result = await pool.query(
      `
      INSERT INTO products (name, category_id, description, price, image, quantity)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        name.trim(),
        Number(category_id),
        description.trim(),
        Number(price),
        imagePath,
        Number(quantity),
      ]
    );

    console.log(" DB INSERT SUCCESS:", result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(" CREATE PRODUCT ERROR:");
    console.error(error);
    res.status(500).json({ error: "Failed to create product." });
  }
}






// UPDATE product
export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const { name, category_id, description, price, quantity } =
    req.body as Product;

  try {
    // 1️⃣ Get existing product
    const existing = await pool.query(
      "SELECT image FROM products WHERE id = $1",
      [id]
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    // 2️⃣ Decide image
     const imagePath = req.file
      ? req.file.path
      : existing.rows[0].image; 

    // 3️⃣ Update
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
        description,
        price,
        imagePath,
        quantity,
        id,
      ]
    );

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
