"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./../../prisma/prisma");
const jsonwebtoken_1 = require("jsonwebtoken");
const argon2 = __importStar(require("argon2"));
const console_1 = __importDefault(require("./../../structures/console"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
async function login(req, res) {
    let streak = 0;
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            message: "Please provide a username and password"
        });
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            username: username
        },
        include: {
            DailyStreak: true
        }
    });
    if (!user) {
        return res.status(404).send({
            message: 'User not found'
        });
    }
    if (!user.DailyStreak) {
        await prisma_1.prisma.dailyStreak.create({
            data: {
                userId: user.id,
                failedTimes: 0
            }
        });
        console_1.default.success('Daily streak created');
    }
    let reFetchedUser = await prisma_1.prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            DailyStreak: true
        }
    });
    const lastDate = Date.now() - reFetchedUser.DailyStreak.latestDate;
    const lastDateInSeconds = lastDate / 1000;
    console_1.default.warning(`Last date: ${lastDateInSeconds} seconds, streak: ${reFetchedUser.DailyStreak.streak}`);
    // Checks if the user has been gone for more than 48 hours to remove their streak.
    if (lastDateInSeconds >= 172800) {
        console_1.default.warning('More than 72 hours have passed');
        await prisma_1.prisma.dailyStreak.update({
            where: {
                id: reFetchedUser.DailyStreak.id
            },
            data: {
                latestDate: Date.now(),
                failedTimes: reFetchedUser.DailyStreak.failedTimes + 1,
                streak: 0
            }
        });
        console_1.default.success(`${reFetchedUser.username}'s daily streak has been reset due to more than 48 hours have passed`);
    }
    if (lastDateInSeconds >= 86400) {
        console_1.default.warning(`${user.username} with id ${user.id} is getting a new daily streak because their last daily streak was ${Math.floor(lastDate / (1000 * 60 * 60 * 24))} days ago`);
        await prisma_1.prisma.dailyStreak.update({
            where: {
                userId: reFetchedUser.id
            },
            data: {
                streak: reFetchedUser.DailyStreak.streak + 1,
                latestDate: Date.now(),
            }
        });
    }
    else {
        streak = reFetchedUser.DailyStreak.streak;
        console_1.default.success(`streak of user ${user.username} is ${streak}!`);
    }
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
        return res.status(400).send({
            message: 'Invalid password'
        });
    }
    const token = (0, jsonwebtoken_1.sign)({
        id: user.id,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    }, process.env.JWT, {
        expiresIn: '2h'
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true
    });
    console_1.default.success(`Authenthicated user ${user.username}`);
    return res.status(200).send({
        message: 'Authenticated successfully',
        user: {
            id: user.id,
            username: user.username,
            verified: user.verifiedEmail,
            isAdmin: (user.role != "user"),
            isBanned: user.moderated,
            streak: streak
        }
    });
}
exports.default = login;
