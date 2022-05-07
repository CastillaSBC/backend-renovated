"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../../structures/server");
const faker_1 = __importDefault(require("@faker-js/faker"));
let testingUsername = `${faker_1.default.word.adjective()}${faker_1.default.hacker.abbreviation()}231`;
describe("Authentication Tests", () => {
    test("Register", async () => {
        const response = await (0, supertest_1.default)(server_1.server.express)
            .post("/user/register")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
            username: testingUsername,
            password: "testing password 3000"
        });
        expect(response.statusCode).toBe(200);
    });
    test("Login", async () => {
        const response = await (0, supertest_1.default)(server_1.server.express)
            .post("/user/login")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
            username: testingUsername,
            password: "testing password 3000"
        });
        expect(response.statusCode).toBe(200);
    });
    test("Same Username error", async () => {
        const response = await (0, supertest_1.default)(server_1.server.express)
            .post("/user/register")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
            username: testingUsername,
            password: "testing password 3000"
        });
        expect(response.statusCode).toBe(400);
    });
    test("Incorrect Login password", async () => {
        const response = await (0, supertest_1.default)(server_1.server.express)
            .post("/user/login")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
            username: testingUsername,
            password: ""
        });
        expect(response.statusCode).toBe(400);
    });
    test("Incorrect Username", async () => {
        const response = await (0, supertest_1.default)(server_1.server.express)
            .post("/user/login")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
            username: "IncorrectUsername",
            password: " "
        });
        expect(response.statusCode).toBe(404);
    });
});
