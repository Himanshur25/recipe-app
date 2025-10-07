import { pool } from "../connect";

const getAll = async (filters: any, values: any) => {
  const sql = `SELECT * FROM recipe${
    filters.length ? " WHERE " + filters.join(" AND ") : ""
  }`;

  const [rows] = await pool.query(sql, values);
  return rows;
};

const getSingle = async (id: number) => {
  const [rows] = await pool.query("SELECT * FROM recipe WHERE id = ?", [id]);
  return (rows as any)[0];
};

const createSingle = async (
  title: string,
  ingredient: string,
  instruction: string,
  category: string,
  userId: number,
  imageUrl: string | null
) => {
  const [result] = await pool.query(
    "INSERT INTO recipe ( user_id, title, ingredient, instruction, category, image) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, title, ingredient, instruction, category, imageUrl]
  );

  return result;
};

const updateSingle = async (
  id: string,
  title: string,
  ingredient: string,
  instruction: string,
  category: string,
  userId: number,
  imageUrl: string | null
) => {
  const [result] = await pool.query(
    "UPDATE recipe SET title = ?, ingredient = ?, instruction = ?, category = ?, image = ? WHERE id = ? AND user_id = ?",
    [title, ingredient, instruction, category, imageUrl, id, userId]
  );

  return result;
};

const deleteSingle = async (id: string, userId: number) => {
  const [result] = await pool.query(
    "DELETE FROM recipe WHERE id = ? AND user_id = ?",
    [id, userId]
  );

  return result;
};

const recipeReaction = async (
  reaction: string,
  recipeId: string,
  userId: string
) => {
  const [result] = await pool.query(
    `INSERT INTO reactions (reaction, recipe_id, user_id) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         reaction = VALUES(reaction), 
         updated_at = CURRENT_TIMESTAMP`,
    [reaction, recipeId, userId]
  );
  return result;
};

export const recipeService = {
  getAll,
  getSingle,
  createSingle,
  updateSingle,
  deleteSingle,
  recipeReaction,
};
