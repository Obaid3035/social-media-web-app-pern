import { IController, IRequest } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import CommentService from "../services/CommentService";
import { StatusCodes } from "http-status-codes";

import { Container } from "typedi";
import { UserRole } from "../entities/User";

class CommentController implements IController{
  path: string = "/comments";

  router = Router();

  constructor() {
    this.router
      .post(`${this.path}/:id`, auth(UserRole.USER), this.create)
      .delete(`${this.path}/:id`, auth(UserRole.USER), this.delete)
  }

  private delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commentId = req.params.id;
      const commentServiceInstance = Container.get(CommentService);
      const comment  = await commentServiceInstance.delete(parseInt(commentId))
      res.status(StatusCodes.CREATED).json(comment)
    } catch (e) {
      next(e);
    }
  }

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      const user = (req as IRequest).user;
      const commentServiceInstance = Container.get(CommentService);
      const comment  = await commentServiceInstance.create(user, parseInt(postId), req.body)
      res.status(StatusCodes.CREATED).json(comment)
    } catch (e) {
      next(e);
    }
  }
}

export default CommentController;
