import { Service } from "typedi";
import Message from "../entities/Message";
import Conversation from "../entities/Conversation";
import { NotFound } from "../utils/errorCode";
import User from "../entities/User";

@Service()
class MessageService {

  async update(messageId: number) {
    const message = await Message.findOne({
      where: {
        id: messageId
      }
    })

    if (!message) {
      throw new NotFound("No Message Found")
    }

    if (message.seen) {
      return {
        message: "Message already seen"
      }
    }

    message.seen = true
    await message.save()
    return {
      message: "Message updated successfully!"
    }
  }


  async index(currentUser: User, conversationId: number) {
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId
      }
    });

    if (!conversation) {
      throw new NotFound("No Conversation found");
    }

    let user;

    if (conversation.sender_id !== currentUser.id) {
      user = await User.findOne({
        where: {
          id: conversation.sender_id
        }
      })
    } else {
      user = await User.findOne({
        select: ["id", "user_name", "image"],
        where: {
          id: conversation.receiver_id
        }
      })
    }


    const message = await Message.createQueryBuilder("message")
      .where("message.conversation_id = :conversation_id", { conversation_id: conversation.id})
      .orderBy("message.created_at", "ASC")
      .getMany()


    await Message.createQueryBuilder("message")
      .update(Message)
      .set({
        seen: true
      })
      .where("message.conversation_id = :conversation_id", { conversation_id: conversation.id})
      .andWhere("message.sender_id != :sender_id", { sender_id: currentUser.id})
      .andWhere("message.seen = :seen", { seen: false})
      .execute()


    return {
      message,
      user
    }
  }


  async create(currentUser: User, userInput: Message, conversationId: number) {
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId
      }
    });

    if (!conversation) {
      throw new NotFound("No Conversation found");
    }
    const messageInstance = Message.create({
      conversation: conversation,
      content: userInput.content,
      sender: currentUser
    });

    conversation.latest_message = userInput.content;

    const messagePromise = messageInstance.save();
    const conversationPromise = conversation.save();

    const [message] = await Promise.all([messagePromise, conversationPromise]);

    return message
  }
}

export default MessageService;
