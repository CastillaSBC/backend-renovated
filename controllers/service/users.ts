import {Request, Response} from 'express';
import {prisma} from './../../prisma/prisma';

export default async function getUsers(req: Request, res: Response) {
	const pageOnePosts = await prisma.user.findMany({
		take: 3,
		orderBy: {
			id: 'asc'
		}
	});

	return res.status(200).send({
		data: pageOnePosts
	});
}
