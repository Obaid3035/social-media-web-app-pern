import { IController, IRequest } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { UserRole } from "../entities/User";
import { Container } from "typedi";
import NotificationService from "../services/NotificationService";

class NotificationController implements IController {
  path: string = "/notification";
  router = Router();

  constructor() {
    this.router
      .get(`${this.path}`, auth(UserRole.USER), this.index)
      .get(`${this.path}/few`, auth(UserRole.USER), this.showFew)
      .put(`${this.path}/:id`, auth(UserRole.USER), this.viewed);
  }

  private index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as IRequest).user
      const notificationServiceInstance = Container.get(NotificationService);
      const notification = await notificationServiceInstance.index(currentUser)
      res.status(200).json(notification);
    } catch (e) {
      next(e);
    }
  };

  private showFew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as IRequest).user
      const notificationServiceInstance = Container.get(NotificationService);
      const notification = await notificationServiceInstance.showFew(currentUser)
      res.status(200).json(notification);
    } catch (e) {
      next(e);
    }
  };



  private viewed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notificationServiceInstance = Container.get(NotificationService);
      const notification = await notificationServiceInstance.viewed(parseInt(req.params.id))
      res.status(200).json(notification);
    } catch (e) {
      next(e);
    }
  };
}

export default NotificationController;
