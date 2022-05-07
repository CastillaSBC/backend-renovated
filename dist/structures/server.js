"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const fs_jetpack_1 = require("fs-jetpack");
const logger_1 = require("./logger");
const http_1 = require("http");
const path_1 = require("path");
const cli_table_1 = __importDefault(require("cli-table"));
const logger = logger_1.Logger.getInstance();
class App {
    express;
    server;
    routesFolder;
    constructor() {
        this.express = (0, express_1.default)();
        this.middleware();
        this.routesFolder = (0, path_1.join)(__dirname, '../routes/');
        this.routes();
        this.server = new http_1.Server(this.express);
    }
    middleware() {
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use((0, compression_1.default)());
        this.express.use((0, helmet_1.default)());
        this.express.use((0, cors_1.default)({ credentials: true, origin: true }));
        this.express.use((0, cookie_parser_1.default)());
    }
    async routes() {
        const files = await (0, fs_jetpack_1.find)(this.routesFolder, { matching: ['*.ts', '*.js'] });
        for (const file of files) {
            const fileName = file.split('\\')[2];
            const route = require(`../../${file}`).default;
            const routeName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
            this.express.use(`/${routeName}`, route);
        }
        let table = new cli_table_1.default();
        //@ts-ignore
        let routes = (0, express_list_endpoints_1.default)(this.express);
        routes.forEach((route) => {
            table.push([route.methods[0], route.path.split('/')[1].split('\\')[0]]);
        });
        table.push(routes);
        console.log(table.toString());
    }
    init() {
        if (!process.env.APP_PORT) {
            process.env.APP_PORT = `3000`;
        }
        this.server.listen(parseInt(process.env.APP_PORT), () => {
            logger.log("Server started on port " + process.env.APP_PORT);
        });
    }
}
const server = new App();
exports.server = server;
