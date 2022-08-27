import { Request, Response } from "express";
import { prisma } from "../../prisma/prisma";

export default async function lockThread(req: Request, res: Response) {
    const thread = await prisma.threads.update({
        where: {
            id: req.params.id,
        },
        data: {
            moderated: true,
            moderationReason: "This thread has been locked by an admin."
        },
    });
    return res.status(200).json({
        thread,
    });
}