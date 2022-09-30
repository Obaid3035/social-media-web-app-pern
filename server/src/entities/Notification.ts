import {
  BaseEntity,
  Column, CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import User  from "./User";

export enum NotificationStatus {
  Like = "like",
  Comment = "comment",
  Follow = "follow"
}


@Entity(Notification.MODEL_NAME)
class Notification extends BaseEntity {
  static MODEL_NAME = "notification";

  static async createNotification(sender: User, receiver: User, status: NotificationStatus, postId: number) {
    const notificationInstance = Notification.create({
      status: status,
      sender: sender,
      receiver: receiver,
      post_id: postId
    })
    const notification = await notificationInstance.save();
    console.log("Notification Created")
    return notification;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sender, {
    nullable: false
  })
  @JoinColumn({
    name: "sender_id"
  })
  sender: User;

  @Column("int")
  sender_id: number

  @ManyToOne(() => User, (user) => user.receiver, {
    nullable: false
  })
  @JoinColumn({
    name: "receiver_id",
  })
  receiver: User;

  @Column("int")
  receiver_id: number

  @Column({
    type: "enum",
    enum: NotificationStatus,
  })
  status: NotificationStatus;

  @Column("boolean", {
    nullable: false,
    default: false
  })
  seen: boolean


  @Column("int", {
    nullable: true,
  })
  post_id: number




  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Notification;












