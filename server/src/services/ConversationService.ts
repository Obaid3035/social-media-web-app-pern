import { Service } from "typedi";
import Conversation from "../entities/Conversation";
import User from "../entities/User";
import { Brackets } from "typeorm";
import { BadRequest, NotFound } from "../utils/errorCode";

@Service()
class ConversationService {

  async unSeenMessages(currUser: User) {
    const conversation = await Conversation.createQueryBuilder("conversation")
      .select(["conversation", "sender.id", "sender.user_name", "sender.image", "receiver.id", "receiver.user_name", "receiver.image"])
      .where("conversation.sender_id = :sender_id", { sender_id: currUser.id})
      .orWhere("conversation.receiver_id = :receiver_id", { receiver_id: currUser.id})
      .innerJoin("conversation.sender", "sender")
      .innerJoin("conversation.receiver", "receiver")
      .loadRelationCountAndMap("conversation.unseen_count", "conversation.messages", "message", (qb) => {
        return qb.where("message.seen = :isTrue", { isTrue: false })
          .andWhere("message.sender_id != :sender_id", { sender_id: currUser.id});
      })
      .orderBy("conversation.updated_at", "DESC")
      .getMany();


    let allUnseenMessages = {
      unseen_count: 0
    }

    if (conversation.length > 0) {
      // @ts-ignore
      allUnseenMessages = conversation.reduce((acc: any, curVal: any) => {
        return {
          unseen_count: parseInt(curVal.unseen_count) + parseInt(acc.unseen_count)
        }
      }, {
        unseen_count: 0
      })
    }

    return {
      conversation,
      allUnseenMessages: allUnseenMessages.unseen_count
    };

  }

  async index(currUser: User, search: any) {
    const conversation = await Conversation.createQueryBuilder("conversation")
      .select(["conversation", "sender.id", "sender.user_name",  "sender.image", "receiver.id", "receiver.user_name", "receiver.image"])
      .where("conversation.sender_id = :sender_id", { sender_id: currUser.id})
      .orWhere("conversation.receiver_id = :receiver_id", { receiver_id: currUser.id})
      .innerJoin("conversation.sender", "sender")
      .innerJoin("conversation.receiver", "receiver")
      .orderBy("conversation.updated_at", "DESC")
      .getMany();


    if (search && search.length > 0) {
      let searchedConversation = conversation.filter((conversation: Conversation) => {
        if (conversation.sender.id !== currUser.id && conversation.sender.user_name.toString().includes(search.toString())) {
          return true
        } else if (conversation.receiver.id !== currUser.id && conversation.receiver.user_name.toString().includes(search.toString())) {
          return true
        }
        return false
      })
      return searchedConversation;
    }

    return conversation;
  }

  async create(currUser: User, otherUserName: string) {
    const user = await User.findOne({
      where: {
        user_name: otherUserName
      }
    })
    if (!user) throw new BadRequest('user not found')
    const receiver: User = await User.findOne({
      where: {
        id: user.id
      }
    });

    if (!receiver) {
      throw new NotFound("User does not exist with that particular id")
    }
    const conversation = await Conversation.createQueryBuilder("conversation")
      .where(new Brackets((qb) => {
        qb.where("conversation.sender_id = :sender_id", { sender_id: currUser.id})
          .andWhere("conversation.receiver_id = :receiver_id", { receiver_id: receiver.id})
      }))
      .orWhere(new Brackets((qb) => {
        qb.where("conversation.sender_id = :receiver_id", { receiver_id: receiver.id})
          .andWhere("conversation.receiver_id = :sender_id", { sender_id: currUser.id})
      }))
      .getOne();


    if (conversation) {
      return {
        message: "Conversation already created"
      }
    }

    const conversationInstance = Conversation.create({
      sender: currUser,
      receiver: receiver,
    })

    await conversationInstance.save()

    return {
      message: "Conversation created successfully!"
    }

  }
}

export default ConversationService
