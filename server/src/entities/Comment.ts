import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import Post from './Post';
import User from './User';

@Entity(Comment.Model_NAME)
class Comment extends BaseEntity {
  static Model_NAME = 'comment';

  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => Post, (post) => post.comment, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: 'post_id',

  })
    post: Post;

  @Column("int")
  post_id: number;

  @ManyToOne(() => User, (user) => user.comment)
  @JoinColumn({
    name: 'user_id',
  })
    user: User;

  @Column("int")
  user_id: number;

  @Column('varchar')
    text: string;

  @CreateDateColumn()
    created_at: Date;
}
export default Comment;
