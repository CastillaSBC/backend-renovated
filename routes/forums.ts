import { Router } from "express";
import authorize from "../middleware/authorize";

import categories from "../controllers/forums/categories";
import categoryView from "../controllers/forums/category_view";
import createThread from "../controllers/forums/create_thread";
import replyThread from "../controllers/forums/reply_thread";
import viewThread from "../controllers/forums/view_thread";

const forums = Router();

forums.get("/categories", async (req, res) => await categories(req, res));
forums.get("/categories/:id", async (req, res) => await categoryView(req, res));
forums.get("/thread/:id", async (req, res) => await viewThread(req, res));
forums.post("/create", authorize, async (req, res) => await createThread(req, res));
forums.post("/reply", authorize, async (req, res) => await replyThread(req, res));

export default forums;
