import { IController, IRequest } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { Container } from "typedi";
import PostService from "../services/PostService";
import { StatusCodes } from "http-status-codes";
import upload from "../middleware/multer";
import { UserRole } from "../entities/User";

class PostController implements IController {
  path: string = "/posts";

  router = Router();

  constructor() {
    this.router
      .get(`${this.path}`, auth(UserRole.USER), this.index)
      .post(`${this.path}`, auth(UserRole.USER), upload.single("image"), this.create)
      .get(`${this.path}/trending/few`, auth(UserRole.USER), this.getFewTrendingPost)
      .get(`${this.path}/trending`, auth(UserRole.USER), this.getTrendingPost)
      .get(`${this.path}/user/:id`, auth(UserRole.USER), this.otherPost)
      .get(`${this.path}/current-user`, auth(UserRole.USER), this.currentUserPost)
      .get(`${this.path}/:id`, auth(UserRole.USER), this.show)
      .delete(`${this.path}/:id`, auth(UserRole.USER), this.delete);
  }

  private delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      const postInstance = Container.get(PostService);
      const posts = await postInstance.delete(parseInt(postId));
      res.status(StatusCodes.OK).json(posts);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  private index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pageNo = parseInt(<string>req.query.page);
      const size = parseInt(<string>req.query.size);
      const postInstance = Container.get(PostService);
      const posts = await postInstance.index((req as IRequest).user, size * pageNo, size);
      res.status(StatusCodes.OK).json(posts);
    } catch (e) {
      next(e);
    }
  };

  private getTrendingPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pageNo = parseInt(<string>req.query.page);
      const size = parseInt(<string>req.query.size);
      const postInstance = Container.get(PostService);
      const posts = await postInstance.getTrendingPost((req as IRequest).user, size * pageNo, size);
      res.status(StatusCodes.OK).json(posts);
    } catch (e) {
      next(e);
    }
  };


  private currentUserPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pageNo = parseInt(<string>req.query.page);
      const size = parseInt(<string>req.query.size);
      const postInstance = Container.get(PostService);
      const posts = await postInstance.currentUserPost((req as IRequest).user, size * pageNo, size);
      res.status(StatusCodes.OK).json(posts);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };


  private show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      const user = (req as IRequest).user;
      const postInstance = Container.get(PostService);
      const posts = await postInstance.show(postId, user);
      res.status(StatusCodes.OK).json(posts);
    } catch (e) {
      next(e);
    }
  };


  private getFewTrendingPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as IRequest).user;
      const postInstance = Container.get(PostService);
      const posts = await postInstance.getFewTrendingPost(user.id);
      res.status(StatusCodes.OK).json(posts);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as IRequest).user;
      const postInstance = Container.get(PostService);
      const post = await postInstance.create(req.body, user, req.file);
      res.status(StatusCodes.CREATED).json(post);
    } catch (e) {
      next(e);
    }
  };

  private otherPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as IRequest).user;
      const otherUserName = req.params.id;
      const pageNo = parseInt(<string>req.query.page);
      const size = parseInt(<string>req.query.size);
      const postInstance = Container.get(PostService);
      const posts = await postInstance.otherPost(user, otherUserName, size * pageNo, size);
      res.status(StatusCodes.OK).json(posts);
    } catch (e) {
      next(e);
    }
  };
}

export default PostController;
