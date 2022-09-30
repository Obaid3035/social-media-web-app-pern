import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Post from "./Post";
import User from "./User";

@Entity(Like.MODEL_NAME)
class Like extends BaseEntity {
  static MODEL_NAME = "like";

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.like, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "post_id",
  })
  post: Post;

  @Column("int")
  post_id: number;

  @ManyToOne(() => User, (user) => user.like)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column("int")
  user_id: number;
}

export default Like;












