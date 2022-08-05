"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient({
    log: [
        { level: "warn", emit: "event" },
        { level: "info", emit: "event" },
        { level: "error", emit: "event" },
    ],
    errorFormat: "pretty",
});
exports.prisma.$on("warn", (e) => {
    console.log(`[PRISMA - Warning] ${e}`);
});
exports.prisma.$on("info", (e) => {
    console.log(`[PRISMA - Info] ${e}`);
});
exports.prisma.$on("error", (e) => {
    console.log(`[PRISMA - Error] ${e}`);
});
