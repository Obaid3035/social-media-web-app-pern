import { IController, IRequest } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import { Container } from "typedi";
import CalorieService from "../services/CalorieService";
import User, { UserRole } from "../entities/User";
import auth from "../middleware/auth";


class CalorieController implements IController {
  path = "/calorie";
  router = Router()

  constructor() {
    this.router
      .get(`${this.path}/history`, auth(UserRole.USER), this.history)
      .get(`${this.path}`, this.getFoodProducts)
      .post(`${this.path}`, auth(UserRole.USER), this.create)
      .get(`${this.path}/stats/:id`, auth(UserRole.USER), this.getFoodStats)
      .get(`${this.path}/weekly`, auth(UserRole.USER), this.weeklyGraph)
      .get(`${this.path}/monthly`, auth(UserRole.USER), this.monthlyGraph)
  }

  private getFoodProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const calorieServiceInstance = Container.get(CalorieService);
      const foodProducts = await calorieServiceInstance.getFoodProducts(req.query)
      res.status(200).json(foodProducts);
    } catch (e) {
      next(e);
    }
  }

  private history = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pageNo = parseInt(<string>req.query.page);
      const size = parseInt(<string>req.query.size);
      const calorieServiceInstance = Container.get(CalorieService);
      const foodProducts = await calorieServiceInstance.history((req as IRequest).user, size * pageNo, size);
      res.status(200).json(foodProducts);
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
      const currUser: User = (<IRequest>req).user;
      const calorieServiceInstance = Container.get(CalorieService);
      const foodProducts = await calorieServiceInstance.create(req.body, currUser)
      res.status(200).json(foodProducts);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  private getFoodStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const calorieServiceInstance = Container.get(CalorieService);
      const foodProducts = await calorieServiceInstance.getFoodStats(req.params.id, req.query.type)
      res.status(200).json(foodProducts);
    } catch (e) {
      next(e);
    }
  }


  private weeklyGraph = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as IRequest).user;
      const calorieServiceInstance = Container.get(CalorieService)
      const foodProducts = await calorieServiceInstance.weeklyGraph(String(req.query.nutrient), currentUser.id);
      res.status(200).json(foodProducts);
    } catch (e) {
      next(e);
    }
  }

  private monthlyGraph = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as IRequest).user;
      const calorieServiceInstance = Container.get(CalorieService)
      const foodProducts = await calorieServiceInstance.monthlyGraph(String(req.query.nutrient), currentUser.id);
      res.status(200).json(foodProducts);
    } catch (e) {
      next(e);
    }
  }
}

export default CalorieController;
