import { IController, IRequest } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import QueriesService from "../services/QueriesService";
import { StatusCodes } from "http-status-codes";

import { Container } from "typedi";
import { UserRole } from "../entities/User";

class QueriesController implements IController{
  path: string = "/queries";

  router = Router();

  constructor() {
    this.router
      .get(`${this.path}/topic`, auth(UserRole.USER), this.indexTopic)
      .post(`${this.path}/topic`, auth(UserRole.USER), this.createTopic)
      .get(`${this.path}/answer/:id`, auth(UserRole.USER), this.indexAnswers)
      .post(`${this.path}/answer/:id`, auth(UserRole.USER), this.createAnswer)
      .get(`${this.path}/:id`, auth(UserRole.USER), this.index)
      .post(`${this.path}/:id`, auth(UserRole.USER), this.create)
      .delete(`${this.path}/:id`, auth(UserRole.USER), this.destroy)
  }

  private destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queriesServiceInstance = Container.get(QueriesService);
      const queries  = await queriesServiceInstance.destroy(+req.params.id)
      res.status(StatusCodes.OK).json(queries)
    } catch (e)  {
      next(e);
    }
  }

  private indexTopic = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const queriesServiceInstance = Container.get(QueriesService);
      const topic  = await queriesServiceInstance.indexTopic()
      res.status(StatusCodes.OK).json(topic)
    } catch (e)  {
      next(e);
    }
  }


  private createAnswer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queriesId = req.params.id
      const user = (req as IRequest).user;
      const queriesServiceInstance = Container.get(QueriesService);
      const answer  = await queriesServiceInstance.createAnswer(parseInt(queriesId), user.id, req.body)
      res.status(StatusCodes.CREATED).json(answer)
    } catch (e)  {
      next(e);
    }
  }


  private indexAnswers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queriesId = req.params.id
      const queriesServiceInstance = Container.get(QueriesService);
      const topic  = await queriesServiceInstance.indexAnswers(queriesId)
      res.status(StatusCodes.OK).json(topic)
    } catch (e) {
      next(e);
    }
  }

  private createTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queriesServiceInstance = Container.get(QueriesService);
      const topic  = await queriesServiceInstance.createTopic(req.body)
      res.status(StatusCodes.CREATED).json(topic)
    } catch (e) {
      console.log(e)
      next(e);
    }
  }

  private index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicName = req.params.id
      const queriesServiceInstance = Container.get(QueriesService);
      const topic  = await queriesServiceInstance.index(topicName)
      res.status(StatusCodes.OK).json(topic)
    } catch (e) {
      next(e);
    }
  }

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicName = req.params.id
      const user = (req as IRequest).user;
      const queriesServiceInstance = Container.get(QueriesService);
      const topic  = await queriesServiceInstance.create(topicName, user.id, req.body)
      res.status(StatusCodes.CREATED).json(topic)
    } catch (e) {
      next(e);
    }
  }
}

export default QueriesController;
