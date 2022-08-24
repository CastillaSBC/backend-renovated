import { Request, Response } from "express"
import { prisma } from "../../prisma/prisma";

export default async function replyThread(req: Request, res: Response) {
    const content: string = req.body.content.trim();
    const threadId: string = req.body.threadId;

    if (!content || !threadId) {
        return res.status(400).send({
            message: "content and thread ID are required!"
        })
    }

    if (content.length < 3 || content.length > 2000) {
        return res.status(400).send({
            message: "content must be between 3 and 2000 characters!"
        })
    }
    const reply = await prisma.responses.create({
        data: {
            content,
            //@ts-expect-error
            authorId: req.user.id,
            threadId: threadId,
        }
    })

    return res.status(200).send({
        message: "Reply created successfully!",
        reply: reply
    })

}
