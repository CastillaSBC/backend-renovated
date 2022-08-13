import { Request, Response } from "express"
import { prisma } from "../../prisma/prisma";

export default async function createThread(req: Request, res: Response) {
    const title: string = req.body.title;
    const content: string = req.body.content;
    const categoryId: string = req.body.categoryId;
    if (!title || !content || !categoryId) {
        return res.status(400).send({
            message: "title, content and category ID are required!"
        })
    }

    if (title.length < 3 || title.length > 50) {
        return res.status(400).send({
            message: "title must be between 3 and 50 characters!"
        })
    }
    if (content.length < 3 || content.length > 2000) {
        return res.status(400).send({
            message: "content must be between 3 and 2000 characters!"
        })
    }
    const thread = await prisma.threads.create({
        data: {
            title,
            content,
            //@ts-expect-error
            authorId: req.user.id,
            categoryId: categoryId,
        }
    })

    return res.status(200).send({
        message: "Thread created successfully!",
        thread: thread
    })

}
