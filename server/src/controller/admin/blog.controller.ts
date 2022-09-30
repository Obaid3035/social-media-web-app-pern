import { IController, IRequest } from "../../interface";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middleware/auth";
import { Container } from "typedi";
import BlogService from "../../services/admin/BlogService";
import { UserRole } from "../../entities/User";
import upload from "../../middleware/multer";

class BlogController implements IController {
  path = "/admin/blogs";
  router = Router();

  constructor() {
    this.router
      .post(`${this.path}`, auth(UserRole.ADMIN), upload.single("feature_image"), this.create)
      .get(`${this.path}`, auth(UserRole.ADMIN), this.index)
      .get(`${this.path}/:id`, auth(UserRole.ADMIN), this.show)
      .put(`${this.path}/:id`, auth(UserRole.ADMIN), upload.single("feature_image"), this.update)
  }

  private index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { search } = req.query;
      const pageNo = parseInt(<string>req.query.page);
      const size = parseInt(<string>req.query.size);
      const blogServiceInstance = Container.get(BlogService);
      const blog = await blogServiceInstance.index(pageNo * size, size, search);
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
      const blogId = req.params.id;
      const blogServiceInstance = Container.get(BlogService);
      const blog = await blogServiceInstance.show(parseInt(blogId));
      res.status(200).json(blog);
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
      const blogServiceInstance = Container.get(BlogService);
      const { saved } = await blogServiceInstance.create(req.body, user, req.file);
      res.status(200).json({
        message: "Blog created successfully",
        saved
      })
    } catch (e) {
      next(e);
    }
  };

  private update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const blogId = req.params.id;
      const blogServiceInstance = Container.get(BlogService);
      const blog = await blogServiceInstance.update(req.body, parseInt(blogId),  req.file);
      res.status(200).json(blog)
    } catch (e) {
      next(e);
    }
  }
}

export default BlogController
