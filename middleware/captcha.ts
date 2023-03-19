import {Request, Response} from 'express';
import {verify} from 'hcaptcha';
import {config} from 'dotenv';
import axios from 'axios';
import { Logger } from 'structures/logger';
import Console from '../structures/console';
config();

export default async function verifyCaptcha(req: Request, res: Response, next: Function) {
	const captcha: string = req.body['captchaResponse'];
	const secret = process.env.CAPTCHA!;
	const ip = req.socket.remoteAddress;

	const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}&remoteip=${ip}`, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})
	if(response.data.success) {
    Console.success("Valid captcha detected.")
		next();
	} else {
    Console.error("Invalid captcha detected.")
    return res.status(401).json({
			error: "No Bots allowed."
		})
	}
}
