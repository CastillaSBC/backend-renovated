"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Console {
    static log(message) {
        console.log(`✨ INFO: ${message}`);
    }
    static warning(message) {
        console.warn(`🧨 WARNING: ${message}`);
    }
    static error(message) {
        console.error(`❌ ERROR: ${message}`);
    }
    static success(message) {
        console.log(`✅ SUCCESS: ${message}`);
    }
}
exports.default = Console;
