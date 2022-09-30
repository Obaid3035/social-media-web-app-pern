import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./User";
import { BadRequest } from "../utils/errorCode";

export enum FriendShipStatus {
  PARTIAL = "partial",
  COMPLETE = "complete",
}

@Entity(FriendShip.MODEL_NAME)
class FriendShip extends BaseEntity {
  static MODEL_NAME = "friendship";

  static  getValidUserIdsForPost(friendShips: FriendShip[], curUserId: number) {
    // getting all the ids of user that the current user follows
    let validUserIds = [curUserId];
    friendShips.forEach((friendShip) => {
      validUserIds.push(friendShip.receiver_id);
    });
    return validUserIds
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


  @BeforeInsert()
  async checkIfFriendShipAlreadyExists() {
    const friendship = this;
    const friendShip = await FriendShip.findOne({
      where: {
        sender_id: friendship.sender.id,
        receiver_id: friendship.receiver.id
      }
    })
    if (friendShip) {
      throw new BadRequest("Sorry friendship is already exist");
    }
  }
}

export default FriendShip;
