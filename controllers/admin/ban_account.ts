import {Request, Response} from 'express';
import {prisma} from '../../prisma/prisma';

export default async function banAccount(req: Request, res: Response) {
	const userId: string = req.body.userId;
	const reason: string = req.body.reason;
	const duration: number = req.body.duration;
	if (!userId || !reason) {
		return res.status(400).send({
			message: 'userId and reason are required!'
		});
	}
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	});
	if (!user) {
		return res.status(404).send({
			message: 'User not found'
		});
	}
	await prisma.user.update({
		where: {
			id: userId
		},
		data: {
			moderated: true,
			moderationReason: reason,
			moderationEnd: duration
		}
	});

	return res.status(200).json({
		message: 'Account banned successfully!'
	});
}
