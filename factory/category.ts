import { prisma } from '../prisma/prisma';
import Logger from '../structures/console';

function addCategory(name: string, description: string, staffOnly: boolean) {
	categories.push({
		name,
		description,
		staffOnly
	});
}

Logger.log('Initiating Category insertion...');

const categories: Category[] = [];

type Category = {
	name: string;
	description: string;
	staffOnly: boolean;
};
// TODO: make this less aids.
addCategory('Announcements', 'Announcements by Anomia Staff', true);
addCategory('General', 'General Discussion', false);
addCategory('WWN', 'Discuss the World War News', false);
addCategory('Suggestions', 'Suggestions for the site', false);
addCategory('Questions', 'Ask and answer questions related to the SBC', false);
addCategory('Advertising', 'Advertise with us!', false);

Logger.success('Categories added to array.');

async function insertCategories(categoryList: Category[]) {
	for (const category of categoryList) {
		await prisma.category.create({
			data: {
				name: category.name,
				description: category.description,
				staffOnly: category.staffOnly
			}
		});
	}
}

insertCategories(categories)
	.then(() => {
		Logger.success('Categories inserted.');
	})
	.catch((err) => {
		Logger.error(`There was an error inserting the categories: ${err}`);
	});
