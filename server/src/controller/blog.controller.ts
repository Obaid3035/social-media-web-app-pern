import { IController } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { UserRole } from "../entities/User";
import BlogService from "../services/BlogService";
import { Container } from "typedi";

class BlogController implements IController{
  path = "/blogs";
  router = Router();

  constructor() {
    this.router
      .get(`${this.path}`, auth(UserRole.USER), this.index)
      .get(`${this.path}/few`, auth(UserRole.USER), this.getFewBlogs)
      .get(`${this.path}/:id`, auth(UserRole.USER), this.show)

  }

  private index = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const blogServiceInstance = Container.get(BlogService);
      const blog = await blogServiceInstance.index();
      res.status(200).json(blog);
    } catch (e) {
      next(e);
    }
  }

  private getFewBlogs = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const blogServiceInstance = Container.get(BlogService);
      const blog = await blogServiceInstance.getFewBlogs();
      res.status(200).json(blog);
    } catch (e) {
      next(e);
    }
  }

  private show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const blogSlug = req.params.id;
      const blogServiceInstance = Container.get(BlogService);
      const blog = await blogServiceInstance.show(blogSlug);
      res.status(200).json(blog);
    } catch (e) {
      next(e);
    }
  }
}

export default BlogController;
