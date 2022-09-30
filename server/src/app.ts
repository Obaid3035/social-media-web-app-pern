import express, {Application} from 'express';
import 'reflect-metadata';
import cors from 'cors';
import helmet from 'helmet';
import { Server} from "socket.io";
import http from "http";
import rateLimit from 'express-rate-limit';
import AppDataSource from "./config/database";
import {IController} from './interface';
import handleError from './middleware/errorHandler';
import EventHandler from "./eventHandler/eventHandler";

class App {
  public app: Application;

  constructor(controllers: IController[]) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeController(controllers);
    this.initializeErrorHandler();
  }

  public async bootstrap() {
    try {
      AppDataSource.initialize()
        .then(() => {
          console.log("Data Source has been initialized!");
          const server = this.app.listen(process.env.PORT, () => {
            console.log("Server is up and running");
          });
          App.initializeSocket(server);
        })
        .catch((err) => {
          console.error("Error during Data Source initialization", err);
        });
    } catch (e) {
      console.log(e);
    }
  }


  private static initializeSocket(server: http.Server) {
    new EventHandler(
      new Server(server, {
        cors: {
          origin: "*"
        },
        pingTimeout: 20000,
        pingInterval: 25000
      })
    );
  }

  private initializeMiddleware() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(
        rateLimit({
          windowMs: 15 * 60 * 1000,
          max: 500,
        }),
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeController(controllers: IController[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.router);
    });
  }

  private initializeErrorHandler() {
    this.app.use(handleError);
  }
}

export default App;
