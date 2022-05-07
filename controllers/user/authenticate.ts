import { Request, Response } from "express";
import { prisma } from "./../../prisma/prisma";
import { decode } from "jsonwebtoken";

export default async function authenticate(req: Request, res: Response) {
    const token = req.cookies.token
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    if (!ip) {
        res.status(400).json({
            message: 'No ip address detected. Please try again.'
        })
    }

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try {
        const decoded = decode(token, { complete: true }) as any;

        if (decoded.payload.ip != ip) {
            return res.status(401).json({
                message: "Mismatched IP detected. Please authenticate again"
            });
        }
        const user = await prisma.user.findUnique({
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

    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong, is your token valid?"
        });
    }
}


