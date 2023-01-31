import {Request, Response} from 'express';
import {verify} from 'hcaptcha';
import {config} from 'dotenv';
config();

export default async function verifyCaptcha(req: Request, res: Response, next: Function) {
	const captcha: string = req.body['h-captcha'];
	const secret = process.env.HCAPTCHA_SECRET!;

	const captchaResult = await verify(secret, captcha);

	if (!captchaResult.success) {
		console.log(`Looks like someone with the ip ${req.socket.remoteAddress} is a robot! Haha UwU.`);
		return res.status(400).json({
			message: 'Invalid captcha'
		});
	}

	next();
}
