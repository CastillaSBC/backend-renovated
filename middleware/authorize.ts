import {Request, Response} from 'express';
import {prisma} from './../prisma/prisma';
import {decode} from 'jsonwebtoken';

export default async function authorize(req: Request, res: Response, next: Function) {
	const token = req.cookies.token;
	const ip = req.socket.remoteAddress;
	console.log(`ip: ${ip} | token: ${token}`);
	if (!ip) {
		res.status(400).json({
			message: 'No ip address detected. Please try again.'
		});
	}

	if (!token) {
		return res.status(401).json({
			message: 'No token provided'
		});
	}

	try {
		const decoded = decode(token, {complete: true}) as any;

		if (decoded.payload.ip != ip) {
			return res.status(401).json({
				message: 'Mismatched IP detected. Please authenticate again'
			});
		}
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
