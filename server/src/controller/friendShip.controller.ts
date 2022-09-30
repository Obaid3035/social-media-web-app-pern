import { IController, IRequest } from "../interface";
import { NextFunction, Router, Response, Request } from "express";
import User, { UserRole } from "../entities/User";
import FriendShipService from "../services/FriendShipService";
import { Container } from "typedi";
import auth from "../middleware/auth";
import { StatusCodes } from "http-status-codes";

class FriendShipController implements IController {
  path: string = "/friendship";

  router = Router();

  constructor() {
    this.router
      .post(`${this.path}/sent/:id`, auth(UserRole.USER), this.sendFriendShipRequest)
      .get(`${this.path}/followings`, auth(UserRole.USER), this.getCurrentUserFollowing)
      .get(`${this.path}/followers`, auth(UserRole.USER), this.getCurrentUserFollower)
      .get(`${this.path}/followings/:id`, auth(UserRole.USER), this.getOtherUserFollowing)
      .get(`${this.path}/followers/:id`, auth(UserRole.USER), this.getOtherUserFollower)
      .delete(`${this.path}/:id`, auth(UserRole.USER), this.unFollowFriendship)
      .delete(`${this.path}/delete-friendship/:id`, auth(UserRole.USER), this.deleteFriendShip);
  }


  private unFollowFriendship = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const friendShipId = req.params.id
      const friendShipInstance = Container.get(FriendShipService);
      const { deleted } = await friendShipInstance.unFollowFriendship(parseInt(friendShipId))
      res.status(200).json({
        deleted
      })
    } catch (e) {
      next(e);
    }
  }

  private getOtherUserFollower = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      const friendShipInstance = Container.get(FriendShipService);
      const followingUser = await friendShipInstance.getUserFollower(userId)
      res.status(200).json(followingUser)
    } catch (e) {
      next(e);
    }
  }

  private getOtherUserFollowing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      const friendShipInstance = Container.get(FriendShipService);
      const followingUser = await friendShipInstance.getUserFollowing(userId)
      res.status(200).json(followingUser)
    } catch (e) {
      next(e);
    }
  }

  private getCurrentUserFollower = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currUser: User = (<IRequest>req).user;
      const friendShipInstance = Container.get(FriendShipService);
      const followingUser = await friendShipInstance.getCurrentUserFollower(currUser.id)
      res.status(200).json(followingUser)
    } catch (e) {
      next(e);
    }
  }

  private getCurrentUserFollowing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currUser: User = (<IRequest>req).user;
      const friendShipInstance = Container.get(FriendShipService);
      const followingUser = await friendShipInstance.getCurrentUserFollowing(currUser.id)
      res.status(200).json(followingUser)
    } catch (e) {
      next(e);
    }
  }

  private sendFriendShipRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const sender: User = (<IRequest>req).user;
      const friendShipInstance = Container.get(FriendShipService);
      const friendShip = await friendShipInstance.sendFriendShipRequest(
        sender,
        id
      );
      res.status(StatusCodes.CREATED).json(friendShip);
    } catch (e) {
      next(e);
    }
  };

  private deleteFriendShip = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const user_2: User = (<IRequest>req).user;
      const friendShipInstance = Container.get(FriendShipService);

      const friendShip = await friendShipInstance.deleteFriendShip(
        id,
        user_2
      );
      res.status(200).json(friendShip);
    } catch (e) {
      next(e);
    }
  };
}

export default FriendShipController;
