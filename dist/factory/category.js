"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = __importDefault(require("./../structures/console"));
const prisma_1 = require("./../prisma/prisma");
function addCategory(name, description) {
    categories.push({
        name,
        description
    });
}
console_1.default.log("Initiating Category insertion...");
const categories = [];
addCategory("Announcements", "Announcements by Anomia Staff");
addCategory("General", "General Discussion");
addCategory("Leaks & Breaches", "Leaks, Data, and PoCs");
addCategory("Suggestions", "Suggestions for the site");
addCategory("Questions", "Ask and answer questions related to the SBC");
addCategory("Advertising", "Advertise with us!");
console_1.default.success("Categories added to array.");
async function insertCategories(categoryList) {
    for (const category of categoryList) {
        await prisma_1.prisma.category.create({
            data: {
                name: category.name,
                // @ts-ignore
                description: category.description
            }
        });
    }
}
insertCategories(categories).then(() => {
    console_1.default.success("Categories inserted.");
}).catch((err) => {
    console_1.default.error(`There was an error inserting the categories: ${err}`);
});
