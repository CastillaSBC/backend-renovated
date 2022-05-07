import { Request, Response } from "express";


export default async function logout(req: Request, response: Response) {
    response.clearCookie("token");

    response.status(200).json({
        message: "Logged off."
    })
}