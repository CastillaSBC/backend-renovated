"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./../../prisma/prisma");
const jsonwebtoken_1 = require("jsonwebtoken");
async function authenticate(req, res) {
    const token = req.cookies.token;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!ip) {
        res.status(400).json({
            message: 'No ip address detected. Please try again.'
        });
    }
    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    try {
        const decoded = (0, jsonwebtoken_1.decode)(token, { complete: true });
        if (decoded.payload.ip != ip) {
            return res.status(401).json({
                message: "Mismatched IP detected. Please authenticate again"
            });
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: decoded.payload.id
            }
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
        return res.status(200).json({
            message: "Authenticated",
            user
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Something went wrong, is your token valid?"
        });
    }
}
exports.default = authenticate;
