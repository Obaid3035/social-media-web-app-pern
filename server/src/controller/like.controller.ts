import { IController, IRequest } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { Container } from "typedi";
import LikeService from "../services/LikeService";
import { UserRole } from "../entities/User";

class LikeController implements IController {
  path: string = "/likes";

  router = Router();

  constructor() {
    this.router
      .post(`${this.path}/:id`, auth(UserRole.USER), this.create)
  }

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as IRequest).user;
      const postId = req.params.id;
      const likeServiceInstance = Container.get(LikeService)
      const liked  = await likeServiceInstance.create(user, parseInt(postId));
      res.status(200).json(liked)
    } catch (e) {
      next(e);
    }
  }
}

export default LikeController;
