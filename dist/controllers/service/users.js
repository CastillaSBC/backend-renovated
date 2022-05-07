"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./../../prisma/prisma");
async function getUsers(req, res) {
    const pageOnePosts = await prisma_1.prisma.user.findMany({
        take: 3,
        orderBy: {
            id: "asc",
        },
    });
    return res.status(200).send({
        data: pageOnePosts,
    });
}
exports.default = getUsers;
