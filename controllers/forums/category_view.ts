import { Request, Response } from "express";
import { prisma } from "./../../prisma/prisma";

export default async function categoryView(req: Request, res: Response) {
    const threads = await prisma.threads.findMany({
        where: {
            moderated: false,
            categoryId: req.params.id,
        },
    });
    return res.status(200).json({
        threads,
    });
}
