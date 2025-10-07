import { Router } from "express";
import { recipeController } from "../controllers/recipe";
import { upload } from "../multer";

const router = Router();

// Registration and login routes

router
  .get("/", recipeController.getAll)
  .post("/", upload.single("image"), recipeController.create);
router
  .get("/:id", recipeController.getSingle)
  .put("/:id", upload.single("image"), recipeController.update)
  .delete("/:id", recipeController.deleteSingle);

router.patch("/:id/reactions", recipeController.createReaction);

export const recipeRoutes = router;

// middleware req.
// authorization
// validation
// success response
