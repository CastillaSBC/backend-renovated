import Logger from "../structures/console";
import { prisma } from "../prisma/prisma";

function addCategory(name: string, description: string) {
    categories.push({
        name,
        description
    })
}

Logger.log("Initiating Category insertion...")

const categories: Category[] = []

type Category = {
    name: string,
    description: string
}
// TODO: make this less aids.
addCategory("Announcements", "Announcements by Anomia Staff")
addCategory("General", "General Discussion")
addCategory("Leaks & Breaches", "Leaks, Data, and PoCs")
addCategory("Suggestions", "Suggestions for the site")
addCategory("Questions", "Ask and answer questions related to the SBC")
addCategory("Advertising", "Advertise with us!")

Logger.success("Categories added to array.")

async function insertCategories(categoryList: Category[]) {
    for (const category of categoryList) {
        await prisma.category.create({
            data: {
                name: category.name,
                description: category.description
            }
        })
    }
}


insertCategories(categories).then(() => {
    Logger.success("Categories inserted.")
}).catch((err) => {
    Logger.error(`There was an error inserting the categories: ${err}`)
})


