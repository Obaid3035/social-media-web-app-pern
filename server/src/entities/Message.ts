import {
  BaseEntity,
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import User from "./User";
import Conversation from "./Conversation";

@Entity(Message.MODEL_NAME)
class Message extends BaseEntity {
  static MODEL_NAME = "message";

  @PrimaryGeneratedColumn()
  id: number;


  @Column("varchar", {
    nullable: false
  })
  content: string

  @Column("boolean", {
    nullable: false,
    default: false
  })
  seen: boolean

  @ManyToOne(() => User, (user) => user.sender, {
    nullable: false
  })
  @JoinColumn({
    name: "sender_id"
  })
  sender: User;

  @Column("int", {
    nullable: false
  })
  sender_id: number

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    nullable: false
  })
  @JoinColumn({
    name: "conversation_id",
  })
  conversation: Conversation;

  @Column("int", {
    nullable: false
  })
  conversation_id: string

  @CreateDateColumn()
  created_at: Date;
}

export default Message;












