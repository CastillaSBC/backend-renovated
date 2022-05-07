"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./../../prisma/prisma");
const argon2 = __importStar(require("argon2"));
async function register(req, response) {
    const { username, password } = req.body;
    const regex = /^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFF9D\uFFE0-\uFFEE]{3,20}$/;
    if (!username || !password) {
        return response.status(401).send({
            message: "Username and password are required"
        });
    }
    if (!regex.test(username)) {
        return response.status(400).send({
            message: "Username must be between 3 and 20 characters and only contain alphanumeric characters or Japanese characters."
        });
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            username: username
        }
    });
    if (user) {
        return response.status(400).send({
            message: "User with that username already exists"
        });
    }
    const hashedPassword = await argon2.hash(password);
    await prisma_1.prisma.user.create({
        data: {
            username: username,
            password: hashedPassword
        }
    });
    return response.status(200).send({
        message: "User registered, please login."
    });
}
exports.default = register;
