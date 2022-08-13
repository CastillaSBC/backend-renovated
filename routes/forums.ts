import { Router } from "express";
import categories from "../controllers/forums/categories";

const forums = Router();

forums.get("/categories", async (req, res) => await categories(req, res));

export default forums;