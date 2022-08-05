import cors from "cors"
import helmet from "helmet"
import express, { IRoute } from "express";
import compression from "compression"
import cookieParser from "cookie-parser";
import routing from "express-list-endpoints"
import { find } from "fs-jetpack";
import { Logger } from "./logger"
import { Server } from "http"
import { join } from "path";
import Table from "cli-table";
const logger = Logger.getInstance()

class App {
    public express: express.Application;
    server: Server;
    routesFolder: string
    constructor() {
        this.express = express();
        this.middleware();
        this.routesFolder = join(__dirname, '../routes/');
        this.routes();
        this.server = new Server(this.express);
    }
    middleware() {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
        this.express.use(helmet());
        this.express.use(cors({ credentials: true, origin: true }));
        this.express.use(cookieParser());
    }
    async routes() {
        const files = await find(this.routesFolder, { matching: ['*.ts', '*.js'] })
        for (const file of files) {
            const fileName = file.split('\\')[2]
            const route = require(`../../${file}`).default
            const routeName = fileName.charAt(0).toUpperCase() + fileName.slice(1).split(".")[0].toLowerCase()
            console.log(`Loaded service ${routeName}`)

            this.express.use(`/${routeName}`, route)
        }
        //@ts-expect-error
        let routes = routing(this.express)
        routes.forEach((route) => {
            console.log(`${route.methods[0].toUpperCase()} ${route.path}`)
        })
    }

    init() {
        if (!process.env.APP_PORT) {
            process.env.APP_PORT = `3000`
        }
        this.server.listen(parseInt(process.env.APP_PORT), () => {
            logger.log("Server started on port " + process.env.APP_PORT)
        })
    }
}

const server = new App()

export { server };
