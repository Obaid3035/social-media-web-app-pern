import {
  BaseEntity,
  Column,
  Entity, OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import Queries from "./Queries";

@Entity(Topic.MODEL_NAME)
class Topic extends BaseEntity {
  static MODEL_NAME = "topic";

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  text: string;

  @OneToMany(() => Queries, (queries) => queries.topic)
  queries: Queries

}

export default Topic;












