import {Request, Response} from 'express';
import {prisma} from './../../prisma/prisma';
import {sign} from 'jsonwebtoken';
import * as argon2 from 'argon2';
import Logger from './../../structures/console';
import {config} from 'dotenv';
config();

export default async function login(req: Request, res: Response) {
	let streak: number = 0;
	const {username, password} = req.body;

	if (!username || !password) {
		return res.status(400).json({
			message: 'Please provide a username and password'
		});
	}

	const user = await prisma.user.findUnique({
		where: {
			username: username
		}
	});

	if (!user) {
		return res.status(404).send({
			message: 'User not found'
		});
	}

	const validPassword = await argon2.verify(user.password, password);

	if (!validPassword) {
		return res.status(400).send({
			message: 'Invalid password'
		});
	}

	const token = sign(
		{
			id: user.id,
			ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
		},
		process.env.JWT!,
		{
			expiresIn: '2h'
		}
	);

	res.cookie('token', token, {
		httpOnly: true,
		secure: true
	});

	Logger.success(`Authenthicated user ${user.username}`);

	return res.status(200).send({
		message: 'Authenticated successfully',
		user: {
			id: user.id,
			username: user.username,
			verified: user.verifiedEmail,
			isAdmin: user.role != 'user',
			isBanned: user.moderated
		}
	});
}
