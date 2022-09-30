import { NextFunction, Request, Response, Router } from "express";
import { IController } from "../../interface";
import { Container } from "typedi";
import UserService from "../../services/admin/UserService";
import { UserRole } from "../../entities/User";
import auth from "../../middleware/auth";

class AdminUserController implements IController {
  path: string = "/admin";

  router = Router();

  constructor() {
    this.router
      .get(`${this.path}/users`, auth(UserRole.ADMIN), this.index)
      .get(`${this.path}/users/verified`, auth(UserRole.ADMIN), this.verifiedUser)
      .get(`${this.path}/users/not-verified`, auth(UserRole.ADMIN), this.notVerifiedUser)
      .put(`${this.path}/users/:id`, auth(UserRole.ADMIN), this.toVerified)
  }

  private index = async (  req: Request,
                           res: Response,
                           next: NextFunction) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const { search } = req.query;
      const pageNo = parseInt(<string>req.query.page);
      const size = parseInt(<string>req.query.size);
     const users = await userServiceInstance.index(pageNo * size, size, search);
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  };

  private verifiedUser = async (  req: Request,
                           res: Response,
                           next: NextFunction) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const pageNo = parseInt(<string>req.query.page);
      const size = parseInt(<string>req.query.size);
      const users = await userServiceInstance.verifiedUser(pageNo * size, size);
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  };

  private notVerifiedUser = async (  req: Request,
                                  res: Response,
                                  next: NextFunction) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const pageNo = parseInt(<string>req.query.page);
      const size = parseInt(<string>req.query.size);
      const users = await userServiceInstance.notVerifiedUser(pageNo * size, size);
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  };

  private toVerified = async (  req: Request,
                                     res: Response,
                                     next: NextFunction) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.toVerified(parseInt(req.params.id));
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  };
}

export default AdminUserController;
