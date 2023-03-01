import {Request, Response} from 'express';
import {prisma} from '../../prisma/prisma';

export default async function createThread(req: Request, res: Response) {
	const title: string = req.body.title;
	const content: string = req.body.content;
	const categoryId: string = req.body.categoryId;

	const user = await prisma.user.findUnique({
		where: {
			//@ts-expect-error
			id: req.user.id
		}
	})

	if(!user) {
		return res.status(400).json({
			message: "WHAT THE CAT?!"
		})
	}

	const category = await prisma.category.findUnique({
		where: {
			id: categoryId
		}
	});

	if(!category){
		return res.status(404).json({
			message: "Category does not exist!"
		})
	}

	if(category.staffOnly === true && user.role === "user"){
		return res.status(403).json({
			message: "Insufficient perms!"
		})
	}

	if (!title || !content || !categoryId) {
		return res.status(400).json({
			message: 'title, content and category ID are required!'
		});
	}

	if (title.length < 3 || title.length > 50) {
		return res.status(400).json({
			message: 'title must be between 3 and 50 characters!'
		});
	}
	if (content.length < 3 || content.length > 2000) {
		return res.status(400).json({
			message: 'content must be between 3 and 2000 characters!'
		});
	}
	const thread = await prisma.threads.create({
		data: {
			title,
			content,
			//@ts-expect-error
			authorId: req.user.id,
			categoryId: categoryId
		}
	});

	return res.status(200).json({
		message: 'Thread created successfully. You will shortly be taken to it.',
		thread: thread
	});
}
