import { Logger } from "./logger";
const logger = Logger.getInstance();

export default class Console {
	static log(message: string) {
		logger.log(message)
		console.log(`✨[${new Date()}] INFO: ${message} ✨`);
	}
	static warning(message: string) {
		logger.log(`warning: ${message}`)
		console.warn(`🧨 [${new Date()}] WARNING: ${message} 🧨`);
	}
	static error(message: string) {
		logger.error(message)

		console.error(`❌ [${new Date()}] ERROR: ${message} ❌`);
	}
	static success(message: string) {
		logger.log(message)
		console.log(`✅ [${new Date()}] SUCCESS: ${message} ✅`);
	}
}
