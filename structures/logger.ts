import winston from 'winston';

export class Logger {
	private static _instance: Logger;
	private _logger: winston.Logger;
	private constructor() {
		this._logger = winston.createLogger({
			level: 'info',
			format: winston.format.json(),
			defaultMeta: {service: 'anomic-service'},
			transports: [new winston.transports.File({filename: 'error.log', level: 'error'}), new winston.transports.File({filename: 'combined.log'})]
		});
		if (process.env.NODE_ENV !== 'production') {
			this._logger.add(
				new winston.transports.Console({
					format: winston.format.simple()
				})
			);
		}
	}
	public static getInstance(): Logger {
		if (!Logger._instance) {
			Logger._instance = new Logger();
		}
		return Logger._instance;
	}
	public log(message: string, data?: any): void {
		this._logger.log('info', message, data);
	}
	public error(message: string, data?: any): void {
		this._logger.log('error', message, data);
	}
}
