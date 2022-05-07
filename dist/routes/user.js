"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = __importDefault(require("../controllers/user/authenticate"));
const login_1 = __importDefault(require("../controllers/user/login"));
const register_1 = __importDefault(require("../controllers/user/register"));
const logout_1 = __importDefault(require("../controllers/user/logout"));
const user = (0, express_1.Router)();
user.get('/me', async (req, res) => await (0, authenticate_1.default)(req, res));
user.post('/login', async (req, res) => await (0, login_1.default)(req, res));
user.post('/register', async (req, res) => await (0, register_1.default)(req, res));
user.post('/logout', async (req, res) => await (0, logout_1.default)(req, res));
exports.default = user;
