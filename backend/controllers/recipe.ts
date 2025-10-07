import { Request, Response } from "express";
import { recipeService } from "../services/recipe";
import { ApiError, serializeError } from "../utils/error";

const getAll = async (req: Request, res: Response) => {
  try {
    const allowedColumns = ["category", "title"];
    const queryParams = req.query;

    const filters: string[] = [];
    const values: any[] = [];

    // filtration based on query params and allowed columns only

    Object.entries(queryParams).forEach(([key, value]) => {
      if (allowedColumns.includes(key) && value) {
        if (key === "title") {
          filters.push(`${key} LIKE ?`);
          values.push(`%${value}%`);
        } else {
          filters.push(`${key} = ?`);
          values.push(value);
        }
      }
    });

    const rows = await recipeService.getAll(filters, values);
    res.status(200).json({ recipes: rows });
  } catch (error: any) {
    serializeError(res, error);
  }
};

const getSingle = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const recipe = await recipeService.getSingle(Number(id));
    if (!recipe) {
      throw new ApiError("Recipe not found", 404);
    }
    res.status(200).json({ recipe });
  } catch (error: any) {
    serializeError(res, error);
  }
};

const create = async (req: Request, res: Response) => {
  const { title, ingredient, instruction, category } = req.body ?? {};

  if (!title || !ingredient || !instruction || !category) {
    throw new ApiError("All fields are required", 400);
  }

  try {
    // Get file URL if an image was uploaded
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;
    const recipe = await recipeService.createSingle(
      title,
      ingredient,
      instruction,
      category,
      (req as any).user.userId,
      imageUrl
    );

    return res.status(201).json({
      message: "Recipe created",
      recipeId: (recipe as any).insertId,
    });
  } catch (error: any) {
    serializeError(res, error);
  }
};

const update = async (req: Request, res: Response) => {
  const { title, ingredient, instruction, category } = req.body;

  const { id } = req.params;

  if (!id) {
    throw new ApiError("Recipe ID is required", 400);
  }

  const imageUrl = req.file ? `/images/${req.file.filename}` : null;

  if (!title || !ingredient || !instruction || !category) {
    throw new ApiError("All fields are required", 400);
  }

  try {
    const recipe = await recipeService.updateSingle(
      id,
      title,
      ingredient,
      instruction,
      category,
      (req as any).user.userId,
      imageUrl
    );

    if ((recipe as any).affectedRows === 0) {
      throw new ApiError("Recipe not found or unauthorized", 404);
    }

    res.status(200).json({ message: "Recipe updated" });
  } catch (error: any) {
    serializeError(res, error);
  }
};
const deleteSingle = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError("Recipe ID is required", 400);
  }

  try {
    const rows = await recipeService.deleteSingle(id, (req as any).user.userId);
    if ((rows as any).affectedRows === 0) {
      throw new ApiError("Recipe not found or unauthorized", 404);
    }

    res.status(200).json({ message: "Recipe deleted" });
  } catch (error: any) {
    serializeError(res, error);
  }
};

// New controller for handling reactions

const createReaction = async (req: Request, res: Response) => {
  try {
    const { reaction } = req.body ?? {};
    const recipeId = req.params.id; // recipe id from route
    const userId = (req as any).user?.userId;

    if (!reaction) {
      throw new ApiError("Reaction is required", 400);
    }

    if (!userId) {
      throw new ApiError("Unauthorized: user not logged in", 401);
    }

    if (!["like", "dislike"].includes(reaction)) {
      throw new ApiError("Invalid reaction type", 400);
    }

    const result = await recipeService.recipeReaction(
      reaction,
      recipeId,
      (req as any).user.userId
    );

    return res.status(201).json({
      message: "Reaction saved successfully",
      affectedRows: (result as any).affectedRows,
    });
  } catch (error: any) {
    serializeError(res, error);
  }
};

export const recipeController = {
  getAll,
  getSingle,
  create,
  update,
  deleteSingle,
  createReaction,
};
