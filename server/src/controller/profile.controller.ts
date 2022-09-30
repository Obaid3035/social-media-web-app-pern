import { IController, IRequest } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { UserRole } from "../entities/User";
import { Container } from "typedi";
import ProfileService from "../services/ProfileService";

class ProfileController implements IController {
  path = "/profiles";
  router = Router();

  constructor() {
    this.router
      .post(`${this.path}`, auth(UserRole.USER), this.create)
      .get(`${this.path}`, auth(UserRole.USER), this.show)
      .put(`${this.path}`, auth(UserRole.USER), this.update)
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as IRequest).user;
      const profileServiceInstance = Container.get(ProfileService)
      const profile = await profileServiceInstance.create(user, req.body);
      res.status(201).json(profile)
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  private show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as IRequest).user;
      const profileServiceInstance = Container.get(ProfileService)
      const profile = await profileServiceInstance.show(user.id);
      res.status(201).json(profile)
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
      const user = (req as IRequest).user;
      const profileServiceInstance = Container.get(ProfileService)
      const profile = await profileServiceInstance.update(user.id, req.body);
      res.status(201).json(profile)
    } catch (e) {
      next(e);
    }
  }
}

export default ProfileController
