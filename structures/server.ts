import cors from 'cors';
import helmet from 'helmet';
import express, { IRoute } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { find } from 'fs-jetpack';
import { Server } from 'http';
import { join } from 'path';
import { Logger } from './logger';
import rateLimit from "express-rate-limit";
const logger = Logger.getInstance();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

class App {
	public express: express.Application;
	server: Server;
	routesFolder: string;
	constructor() {
		this.express = express();
		this.middleware();
		this.routesFolder = join(__dirname, '../routes/');
		this.routes();
		this.server = new Server(this.express);
	}
	middleware() {
		this.express.use(express.json());
		this.express.use(express.urlencoded({ extended: false }));
		this.express.use(compression());
		this.express.use(helmet());
		this.express.use(cors({ credentials: true, origin: true }));
		this.express.use(cookieParser());
		this.express.use(limiter)
	}
	async routes() {
		find(this.routesFolder, { matching: '*.js' }).forEach((routeFile) => {
			console.log(`routeFile is ${routeFile}`);
			let fileName: string | undefined = undefined;
			let routeName: string | undefined = undefined;
			// check if the platform is windows
			if (process.platform === 'win32') {
				fileName = routeFile.split('\\').pop();
				routeName = fileName?.split('.')[0];
				const route = require(join(this.routesFolder, fileName!));
				this.express.use(`/${routeName}`, route.default);
			} else {
				fileName = routeFile.split('/').pop()?.split('.')[0];
				console.log(`fileName is ${fileName}`);
				const route = require(join(this.routesFolder, fileName!));
				console.log(`Route will be /${fileName}`);
				this.express.use(`/${fileName}`, route.default);
			}
		});
	}

	init() {
		if (!process.env.APP_PORT) {
			process.env.APP_PORT = `3000`;
		}
		this.server.listen(parseInt(process.env.APP_PORT), () => {
			logger.log('Server started on port ' + process.env.APP_PORT);
		});
	}
}

const server = new App();

export { server };
