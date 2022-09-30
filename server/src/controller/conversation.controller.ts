import { IController, IRequest } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { UserRole } from "../entities/User";
import { Container } from "typedi";
import ConversationService from "../services/ConversationService";

class ConversationController implements IController {
  path: string = "/conversation";
  router = Router()

  constructor() {
    this.router
      .get(`${this.path}`, auth(UserRole.USER), this.index)
      .post(`${this.path}/:id`, auth(UserRole.USER), this.create)
      .get(`${this.path}/unseen`, auth(UserRole.USER), this.unSeenMessages);
  }

  private unSeenMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as IRequest).user;
      const conversationInstance = Container.get(ConversationService);
      const conversation = await conversationInstance.unSeenMessages(user);
      res.status(200).json(conversation)
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
      const user = (req as IRequest).user;
      const conversationInstance = Container.get(ConversationService);
      const conversation = await conversationInstance.index(user, req.query.search);
      res.status(200).json(conversation)
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
      const user = (req as IRequest).user;
      const otherUserName = req.params.id
      const conversationInstance = Container.get(ConversationService);
      const conversation = await conversationInstance.create(user, otherUserName);
      res.status(200).json(conversation)
    } catch (e) {
      next(e);
    }
  }
}

export default ConversationController;
