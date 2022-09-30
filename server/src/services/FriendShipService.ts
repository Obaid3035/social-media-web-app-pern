import { Service } from "typedi";
// import BaseService from "./base.service";
import FriendShip  from "../entities/FriendShip";
import User from "../entities/User";
import { BadRequest, NotFound } from "../utils/errorCode";
import Notification, { NotificationStatus } from "../entities/Notification";

@Service()
class FriendShipService {

  async getUserFollower(user_name:  string) {
    const user = await User.findOne({
      where: {
        user_name
      }
    })
    if (!user) throw new BadRequest('User not found')
    return await FriendShip.createQueryBuilder("friendShip")
      .select(["friendShip", "user.user_name", "user.image"])
      .where("friendShip.receiver_id = :receiver_id", { receiver_id: user.id })
      .innerJoin("friendShip.sender", "user")
      .getMany();
  }

  async getCurrentUserFollower(id:  number) {
    return await FriendShip.createQueryBuilder("friendShip")
      .select(["friendShip", "user.user_name", "user.image"])
      .where("friendShip.receiver_id = :receiver_id", { receiver_id: id })
      .innerJoin("friendShip.sender", "user")
      .getMany();
  }

  async getUserFollowing(user_name:  string) {
    const user = await User.findOne({
      where: {
        user_name
      }
    })
    if (!user) throw new BadRequest('User not found')
    return await FriendShip.createQueryBuilder("friendShip")
      .select(["friendShip", "user.user_name", "user.image"])
      .where("friendShip.sender_id = :sender_id", { sender_id: user.id })
      .innerJoin("friendShip.receiver", "user")
      .getMany();
  }

  async getCurrentUserFollowing(id:  number) {
    return await FriendShip.createQueryBuilder("friendShip")
      .select(["friendShip", "user.user_name", "user.image"])
      .where("friendShip.sender_id = :sender_id", { sender_id: id })
      .innerJoin("friendShip.receiver", "user")
      .getMany();
  }

  async unFollowFriendship(friendShipId: number) {
    const friendShip = await FriendShip.findOne({
      where: {
        id: friendShipId
      }
    });
    if (!friendShip) {
      throw new NotFound("FriendShip not found");
    }
    await FriendShip.remove(friendShip);
    return {
      deleted: true
    }
  }

  async sendFriendShipRequest(sender: User, user_name: string) {
    console.log("*********** Creating FriendShip *************");

    const receiver: User = await User.findOne({
      where: {
        user_name
      }
    });
    if (!receiver) throw new NotFound("User not found");
    const friendShip = FriendShip.create({
      sender: sender,
      receiver: receiver,
    });
    await friendShip.save();

    console.log("*********** FriendShip Created Successfully *************");
    const notification = await Notification.createNotification(sender, receiver, NotificationStatus.Follow, null)
    return {
      friendship: true,
      notification
    };
  }

  async deleteFriendShip(user_name: string, currUserId: User) {
    const user = await User.findOne({
      where: {
        user_name
      }
    })
    if (!user) throw new BadRequest('Something went wrong')
    console.log(
      "************** Checking if user 1 is the sender and user 2 is receiver *************"
    );
    const friendShip_1 = await FriendShip.createQueryBuilder("friendship")
      .where("friendship.receiver_id = :receiver_id", {
        receiver_id: user.id,
      }).andWhere("friendship.sender_id = :sender_id", {
        sender_id: currUserId.id,
      }).getOne();

    if (!friendShip_1) {
      throw new Error("No FriendShip Found");
    }

    await FriendShip.delete(friendShip_1.id);
    console.log("************** FriendShip Successfully deleted *************");
    return {
      friendship: false,
    };
  }
}

export default FriendShipService;
