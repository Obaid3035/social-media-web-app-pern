import { Router, Request, Response, NextFunction } from "express";
import { IController, IRequest } from "../interface";
import { Container } from "typedi";
import UserService from "../services/UserService";
import auth from "../middleware/auth";
import User, { UserRole } from "../entities/User";
import upload from "../middleware/multer";

class UserController implements IController {
  path: string = "/auth";

  router = Router();

  constructor() {
    this.router
      .post(`${this.path}/register`, this.register)
      .post(`${this.path}/login`, this.login)
      .put(`${this.path}/upload`,  auth(UserRole.USER), upload.single("image") ,this.profilePictureUpload)
      .get(`${this.path}/authorize/:token`, this.authorize)
      .get(`${this.path}/users`, this.searchUsers)
      .get(`${this.path}/top`, auth(UserRole.USER), this.mostFollowedUser)
      .get(`${this.path}/stats/:id`, auth(UserRole.USER), this.getUserStats)
      .get(`${this.path}/current-user/stats`, auth(UserRole.USER), this.getCurrentUserStats)
      .put(`${this.path}/verify-email`, auth(UserRole.USER), this.verifyEmail)
      .put(`${this.path}/change-email`, auth(UserRole.USER), this.changeEmail)
      .put(`${this.path}/change-password`, auth(UserRole.USER), this.changePassword)
      .put(`${this.path}/report`, auth(UserRole.USER), this.sendReport)
  }


  private sendReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as IRequest).user;
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.sendReport(user, req.body.report);
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  private changeEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as IRequest).user;
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.changeEmail(user, req.body.email);
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }


  private verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as IRequest).user;
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.verifyEmail(user, req.body.email);
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  private changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as IRequest).user;
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.changePassword(user, req.body.oldPassword, req.body.newPassword);
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  private profilePictureUpload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as IRequest).user;
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.profilePictureUpload(user, req.file)
      res.status(200).json(users);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  private searchUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const users = req.query.search.length > 0 ?
        await userServiceInstance.searchUsers(req.query.search) : []
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  };

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const { auth, token, role } = await userServiceInstance.register(req.body);
      res.status(201).json({ auth, token, role });
    } catch (e) {
      next(e);
    }
  };

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const { email, password } = req.body;
      const { auth, token, role } = await userServiceInstance.login(email, password);
      res.status(200).json({
        auth,
        token,
        role
      });
    } catch (e) {
      next(e);
    }
  };

  private authorize = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token } = req.params;
      await User.authorize(token);
      res.status(200).json({ authenticate: true });
    } catch (e) {
      next(e);
    }
  };

  private mostFollowedUser = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.mostFollowedUser();
      res.status(200).json(users)
    } catch (e) {
      next(e);
    }
  }

  private getUserStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_name = req.params.id
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.getUserStats(user_name);
      res.status(200).json(users)
    } catch (e) {
      next(e);
    }
  }

  private getCurrentUserStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as IRequest).user;
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.getCurrentUserStats(user);
      res.status(200).json(users)
    } catch (e) {
      next(e);
    }
  }

}


export default UserController;
