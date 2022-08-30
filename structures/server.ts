import cors from "cors";
import helmet from "helmet";
import express, { IRoute } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { find } from "fs-jetpack";
import { Server } from "http";
import { join } from "path";
import { Logger } from "./logger";
const logger = Logger.getInstance()

class App {
  public express: express.Application;
  server: Server;
  routesFolder: string;
  constructor() {
    this.express = express();
    this.middleware();
    this.routesFolder = join(__dirname, "../routes/");
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

    find(this.routesFolder, { matching: "*.js" }).forEach((routeFile) => {
      console.log(`routeFile is ${routeFile}`)
      let fileName: string | undefined = undefined;
      let routeName: string | undefined = undefined;
      // check if the platform is windows
      if (process.platform === "win32") {
        fileName = routeFile.split("\\").pop()
        routeName = fileName?.split(".")[0]
        const route = require(join(this.routesFolder, fileName!));
        this.express.use(`/${routeName}`, route.default);
      } else {
        fileName = routeFile.split("/").pop()?.split(".")[0];
        console.log(`fileName is ${fileName}`)
        const route = require(join(this.routesFolder, fileName!));
        console.log(`Route will be /${fileName}`)
        this.express.use(`/${fileName}`, route.default);
      }



    });
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

export { server };
