import { Request, Response } from "express";
import { prisma } from "./../../prisma/prisma";
import { sign } from "jsonwebtoken";
import * as argon2 from "argon2";
import Logger from "./../../structures/console";
import { config } from "dotenv"
config()

export default async function login(req: Request, res: Response) {
    let streak: number = 0;
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            message: "Please provide a username and password"
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            username: username
        },
        include: {
            DailyStreak: true
        }
    })

    if (!user) {
        return res.status(404).send({
            message: 'User not found'
        })
    }

    if (!user.DailyStreak) {
        await prisma.dailyStreak.create({
            data: {
                userId: user.id,
                failedTimes: 0
            }
        })
        Logger.success('Daily streak created')
    }
    let reFetchedUser = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            DailyStreak: true
        }
    })


    const lastDate = Date.now() - reFetchedUser!.DailyStreak!.latestDate

    const lastDateInSeconds = lastDate / 1000
    Logger.warning(`Last date: ${lastDateInSeconds} seconds, streak: ${reFetchedUser!.DailyStreak!.streak}`)

    // Checks if the user has been gone for more than 48 hours to remove their streak.
    if (lastDateInSeconds >= 172800) {
        Logger.warning('More than 72 hours have passed')
        await prisma.dailyStreak.update({
            where: {
                id: reFetchedUser!.DailyStreak!.id
            },
            data: {
                latestDate: Date.now(),
                failedTimes: reFetchedUser!.DailyStreak!.failedTimes + 1,
                streak: 0
            }
        })
        Logger.success(`${reFetchedUser!.username}'s daily streak has been reset due to more than 48 hours have passed`)
    }

    if (lastDateInSeconds >= 86400) {
        Logger.warning(`${user.username} with id ${user.id} is getting a new daily streak because their last daily streak was ${Math.floor(lastDate / (1000 * 60 * 60 * 24))} days ago`)
        await prisma.dailyStreak.update({
            where: {
                userId: reFetchedUser!.id
            },
            data: {
                streak: reFetchedUser!.DailyStreak!.streak + 1,
                latestDate: Date.now(),
            }
        })
    } else {
        streak = reFetchedUser!.DailyStreak!.streak
        Logger.success(`streak of user ${user.username} is ${streak}!`)
    }


    const validPassword = await argon2.verify(user.password, password)

    if (!validPassword) {
        return res.status(400).send({
            message: 'Invalid password'
        })
    }

    const token = sign({
        id: user.id,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    }, process.env.JWT!, {
        expiresIn: '2h'
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: true
    })

    Logger.success(`Authenthicated user ${user.username}`)

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
    })
}