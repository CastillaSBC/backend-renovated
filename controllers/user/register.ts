import { Request, Response } from "express";
import { prisma } from "./../../prisma/prisma";
import * as argon2 from "argon2";

export default async function register(req: Request, response: Response) {
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

    const user = await prisma.user.findUnique({
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

    await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword
        }
    });

    return response.status(200).send({
        message: "User registered, please login."
    });

}