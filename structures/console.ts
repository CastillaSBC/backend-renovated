export default class Console {
	static log(message: string) {
		console.log(`✨ INFO: ${message}`);
	}
	static warning(message: string) {
		console.warn(`🧨 WARNING: ${message}`);
	}
	static error(message: string) {
		console.error(`❌ ERROR: ${message}`);
	}
	static success(message: string) {
		console.log(`✅ SUCCESS: ${message}`);
	}
}
