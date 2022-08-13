import { Router } from "express";
import authorize from "../middleware/authorize";

import categories from "../controllers/forums/categories";
import categoryView from "../controllers/forums/category_view";
import createThread from "../controllers/forums/create_thread";
import verifyCaptcha from "../middleware/captcha";

const forums = Router();

forums.get("/categories", async (req, res) => await categories(req, res));
forums.get("/categories/:id", async (req, res) => await categoryView(req, res));
forums.post("/create", authorize, verifyCaptcha, async (req, res) => await createThread(req, res));

export default forums;
