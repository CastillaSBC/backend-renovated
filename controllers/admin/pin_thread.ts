import { Request, Response } from "express";
import { prisma } from "../../prisma/prisma";

export default async function pinThread(req: Request, res: Response) {
    const thread = await prisma.threads.findUnique({
        where: {
            id: req.params.id,
        },
    });
    if (!thread) {
        return res.status(404).send({
            message: "Thread not found"
        })
    }

    await prisma.threads.update({
        where: {
            id: req.params.id,
        },
        data: {
            pinned: true,
        },
    });

    return res.status(200).json({
        thread,
    });
}