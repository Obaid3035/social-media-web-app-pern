import {
  BaseEntity,
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import User from "./User";
import Queries from "./Queries";

@Entity(Answer.MODEL_NAME)
class Answer extends BaseEntity {
  static MODEL_NAME = "answer";

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

  @ManyToOne(() => Queries, (queries) => queries.answer, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "queries_id",
  })
  queries: Queries;

  @Column("int")
  queries_id: number;

  @CreateDateColumn()
  created_at: Date;
}

export default Answer;












