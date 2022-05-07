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
const jsonwebtoken_1 = require("jsonwebtoken");
const argon2 = __importStar(require("argon2"));
async function login(req, res) {
    const { username, password } = req.body;
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            username: username
        }
    });
    if (!user) {
        return res.status(404).send({
            message: 'User not found'
        });
    }
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
        return res.status(400).send({
            message: 'Invalid password'
        });
    }
    const token = (0, jsonwebtoken_1.sign)({
        id: user.id,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    }, process.env.JWT, {
        expiresIn: '2h'
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true
    });
    return res.status(200).send({
        message: 'Authenticated successfully',
        user: {
            id: user.id,
            username: user.username,
            verified: user.verifiedEmail,
            isAdmin: (user.role != "user"),
            isBanned: user.moderated
        }
    });
}
exports.default = login;
