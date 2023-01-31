import request from 'supertest';
import {server} from '../../structures/server';
import faker from '@faker-js/faker';

let testingUsername = `${faker.word.adjective()}${faker.hacker.abbreviation()}231`;

describe('Authentication Tests', () => {
	test('Register', async () => {
		const response = await request(server.express).post('/user/register').set('Accept', 'application/json').expect('Content-Type', /json/).send({
			username: testingUsername,
			password: 'testing password 3000'
		});
		expect(response.statusCode).toBe(200);
	});

	test('Login', async () => {
		const response = await request(server.express).post('/user/login').set('Accept', 'application/json').expect('Content-Type', /json/).send({
			username: testingUsername,
			password: 'testing password 3000'
		});
		expect(response.statusCode).toBe(200);
	});

	test('Same Username error', async () => {
		const response = await request(server.express).post('/user/register').set('Accept', 'application/json').expect('Content-Type', /json/).send({
			username: testingUsername,
			password: 'testing password 3000'
		});
		expect(response.statusCode).toBe(400);
	});

	test('Incorrect Login password', async () => {
		const response = await request(server.express).post('/user/login').set('Accept', 'application/json').expect('Content-Type', /json/).send({
			username: testingUsername,
			password: ''
		});
		expect(response.statusCode).toBe(400);
	});

	test('Incorrect Username', async () => {
		const response = await request(server.express).post('/user/login').set('Accept', 'application/json').expect('Content-Type', /json/).send({
			username: 'IncorrectUsername',
			password: ' '
		});
		expect(response.statusCode).toBe(404);
	});
});
