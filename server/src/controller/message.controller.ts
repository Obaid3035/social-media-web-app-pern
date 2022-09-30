import { IController, IRequest } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { UserRole } from "../entities/User";
import { Container } from "typedi";
import MessageService from "../services/MessageService";

class MessageController implements IController {
  path: string = "/message";
  router = Router();


  constructor() {
    this.router
      .get(`${this.path}/:id`, auth(UserRole.USER), this.index)
      .post(`${this.path}/:id`, auth(UserRole.USER), this.create)
      .put(`${this.path}/:id`, auth(UserRole.USER), this.update)
  }




  private update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const messageServiceInstance = Container.get(MessageService);
      const message = await messageServiceInstance.update(parseInt(req.params.id))
      res.status(201).json(message);
    } catch (e) {
      next(e);
    }
  }


  private index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currentUser = (req as IRequest).user
      const messageServiceInstance = Container.get(MessageService);
      const message = await messageServiceInstance.index(currentUser, parseInt(req.params.id))
      res.status(201).json(message);
    } catch (e) {
      next(e);
    }
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currentUser = (req as IRequest).user
      const messageServiceInstance = Container.get(MessageService);
      const message = await messageServiceInstance.create(currentUser, req.body, parseInt(req.params.id))
      res.status(201).json(message);
    } catch (e) {
      next(e);
    }
  }
}

export default MessageController;
