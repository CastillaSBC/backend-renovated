import {Request, Response} from 'express';
import {prisma} from './../../prisma/prisma';

export default async function categoryView(req: Request, res: Response) {
	const categoryID = req.params.id;
	const category = await prisma.category.findUnique({
		where: {
			id: categoryID
		}
	})
	console.log(`Someone wants to access category ${category}`)

	if(!category) {
		return res.status(404).json({
			error: "Not found!"
		})
	}

	const threads = await prisma.threads.findMany({
		where: {
			moderated: false,
			categoryId: req.params.id
		}
	});

	
	const outuput = threads.slice(0, 14)

	return res.status(200).json({
		threads: outuput
	});
}
