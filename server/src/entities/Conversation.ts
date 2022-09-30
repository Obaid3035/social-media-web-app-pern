import {
  BaseEntity,
  Column, CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import User from "./User";
import Message from "./Message";

@Entity(Conversation.MODEL_NAME)
class Conversation extends BaseEntity {
  static MODEL_NAME = "conversation";

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

  @Column('varchar', {
    nullable: true
  })
  latest_message: string;


  @OneToMany(() => Message, (message) => message.conversation, {
    nullable: true,
    onDelete: "CASCADE"
  })
  messages: Message[]


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Conversation;












