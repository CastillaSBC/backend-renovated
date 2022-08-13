import { Router } from "express";
import authenticate from "../controllers/user/authenticate";
import login from "../controllers/user/login";
import register from "../controllers/user/register";
import logout from "../controllers/user/logout";
import verifyCaptcha from "../middleware/captcha";
const user = Router();

user.get('/me', async (req, res) => await authenticate(req, res));
user.post('/login', verifyCaptcha, async (req, res) => await login(req, res));
user.post('/register', verifyCaptcha, async (req, res) => await register(req, res));
user.post('/logout', async (req, res) => await logout(req, res));
export default user