import {
  BaseEntity,
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import User from "./User";
import Topic from "./Topic";
import Answer from "./Answer";

@Entity(Queries.MODEL_NAME)
class Queries extends BaseEntity {
  static MODEL_NAME = "queries";

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  text: string;

  @ManyToOne(() => User, (user) => user.queries)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column("int")
  user_id: number;

  @ManyToOne(() => Topic, (topic) => topic.queries)
  @JoinColumn({
    name: "topic_id",
  })
  topic: Topic;

  @Column("int")
  topic_id: number;

  @OneToMany(() => Answer, (answer) => answer.queries, {
    onDelete: "CASCADE"
  })
  answer: Answer

  @CreateDateColumn()
  created_at: Date;
}

export default Queries;












