import { Request, Response } from "express";

export default async function test(req: Request, res: Response) {
    return res.status(200).json({
        message: "Hello World! You did it! You have captcha!"
    })
}