import {Request, Response} from 'express';
import {prisma} from './../prisma/prisma';
import {decode} from 'jsonwebtoken';

export default async function authorize(req: Request, res: Response, next: Function) {
	const token = req.cookies.__ANOMICSECURITY;

	if (!token) {
		return res.status(401).json({
			message: 'No token provided'
		});
	}

	try {
		const decoded = decode(token, {complete: true}) as any;
		const user = await prisma.user.findUnique({
			where: {
				id: decoded.payload.id
			}
		});

		if (!user) {
			return res.status(401).json({
				message: 'Invalid token'
			});
		}
		// Expect error as req.user is not within the Express types.
		//@ts-expect-error
		req.user = user;
		next();
	} catch (err) {
		return res.status(500).json({
			message: 'Could not verify user.'
		});
	}
}
