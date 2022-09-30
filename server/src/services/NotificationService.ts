import { Service } from "typedi";
import User from "../entities/User";
import Notification  from "../entities/Notification";

@Service()
class NotificationService {


  async index(currentUser: User) {
    const notification = await Notification.createQueryBuilder("notification")
      .select(["notification", "sender.id", "sender.user_name", "sender.image", "receiver.id", "receiver.user_name", "receiver.image"])
      .where("notification.receiver_id = :receiver_id", {receiver_id: currentUser.id})
      .innerJoin("notification.sender", "sender")
      .innerJoin("notification.receiver", "receiver")
      .orderBy("notification.created_at", "DESC")
      .getMany()

    if (notification.length > 0) {
      await Notification.createQueryBuilder("notification")
        .update(Notification)
        .set({
          seen: true
        })
        .where({
          receiver_id: currentUser.id
        })
        .execute()
    }

    return notification;

  }

  async showFew(currentUser: User) {

    const notificationPromise = Notification.createQueryBuilder("notification")
      .select(["notification", "sender.id", "sender.user_name", "sender.image", "receiver.id", "receiver.user_name", "receiver.image"])
      .where("notification.receiver_id = :receiver_id", {receiver_id: currentUser.id})
      .andWhere("notification.seen IS FALSE")
      .innerJoin("notification.sender", "sender")
      .innerJoin("notification.receiver", "receiver")
      .orderBy("notification.created_at", "DESC")
      .take(3)
      .getMany()

    const notificationCountPromise = Notification.createQueryBuilder("notification")
      .where("notification.receiver_id = :receiver_id", {receiver_id: currentUser.id})
      .andWhere("notification.seen IS FALSE")
      .getCount()

    const [notification, notificationCount] = await Promise.all([notificationPromise, notificationCountPromise])

    return {
      notification,
      notificationCount
    }

  }

  async viewed(notificationId: number) {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        seen: false
      }
    })
    if (notification) {
      await Notification.createQueryBuilder("notification")
        .update(Notification)
        .set({
          seen: true
        })
        .where({
          id: notificationId
        })
        .execute()
    }
    return {
      message: "notification updated successfully"
    }
  }
}

export default NotificationService;
