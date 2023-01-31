import {Request, Response} from 'express';
import {prisma} from '../../prisma/prisma';

export default async function deleteThread(req: Request, res: Response) {
	const threadId: string = req.body.threadId;
	const reason: string = req.body.reason;
	if (!threadId) {
		return res.status(400).send({
			message: 'threadId is required!'
		});
	}

	if (!reason) {
		return res.status(400).send({
			message: 'reason is required!'
		});
	}

	const thread = await prisma.threads.findUnique({
		where: {
			id: threadId
		}
	});
	if (!thread) {
		return res.status(404).send({
			message: 'Thread not found'
		});
	}
	await prisma.threads.update({
		where: {
			id: threadId
		},
		data: {
			title: 'This thread has been deleted by an admin',
			content: `At ${new Date().toLocaleString()} this thread was been deleted by an admin.`,
			moderated: true,
			moderationReason: reason
		}
	});
	return res.status(200).json({
		message: 'Thread deleted successfully!'
	});
}
