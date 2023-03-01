import * as argon2 from 'argon2';
import { config } from "dotenv";
import { prisma } from '../prisma/prisma';
config();


// doesnt work for whatever reason

const username = process.env.ADMIN_USERNAME!;
const password = process.env.ADMIN_PASSWORD!;

async function registerAdmin() {
    const hashedPassword = await argon2.hash(password);

    await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword,
            role: "owner" // user, moderator, admin, owner
        }
    });
}

registerAdmin().then(() => console.log("Admin created succesfully."))