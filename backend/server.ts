import cors from "cors";
import { authRoute } from "./routes/authRoute";
import express from "express";
import { pool } from "./connect";
import path from "path";
import { recipeRoutes } from "./routes/recipeRoute";
import { checkUserForAuthentication } from "./middlewares/auth";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

pool
  .getConnection()
  .then((conn) => {
    console.log("✅ Database connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Error connecting to the database:", err);
  });

app.get("/", (req, res) => {
  res.send("Lets work with the project now");
});
app.use("/api/auth", authRoute); // auth routes
app.use("/api/recipes", checkUserForAuthentication, recipeRoutes); // recipe routes

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
