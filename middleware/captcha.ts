import {Request, Response} from 'express';
import {verify} from 'hcaptcha';
import {config} from 'dotenv';
import axios from 'axios';
config();


/**
const captchaCheck = (req, res, next) => {
  console.log('CAPTCHA middleware activated');

  let urlEncodedData =
    'secret=SECRET-KEY-HERE&response=' +
    req.body.captchaResponse +
    '&remoteip=' +
    req.connection.remoteAddress;

  axios
    .post('https://www.google.com/recaptcha/api/siteverify', urlEncodedData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => {
      if (res.data.success) {
        next();
      } else {
        res.status(401).send({ message: 'No bots!' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({ message: 'No bots!' });
    });
};
 */

export default async function verifyCaptcha(req: Request, res: Response, next: Function) {
	const captcha: string = req.body['captchaResponse'];
	const secret = process.env.CAPTCHA!;
	const ip = req.socket.remoteAddress;

	//
	const encodedUrl = `secret=${secret}&response=${captcha}&remoteip=${ip}`
	const googleUrl = "https://www.google.com/recaptcha/api/siteverify";

	const response = await axios.post(googleUrl, encodedUrl, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})

	if(response.data.success) {
		next();
	} else {
		return res.status(401).json({
			error: "No Bots allowed."
		})
	}

	next();
}
