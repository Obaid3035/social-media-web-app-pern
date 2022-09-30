import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import User from "./User";
import Like from "./Like";
import Comment from "./Comment";

@Entity(Post.MODEL_NAME)
class Post extends BaseEntity {
  static MODEL_NAME = "post";

  static mergeCommentLikeAndPost(posts: Post[], comments: Comment[], likedPost: Like[]) {

    return posts.map((post: any) => {
      let i = 0;
      const liked = likedPost.find((like) => {
        return like.post_id === post.id;
      })

      return {
        ...post,
        liked: !!liked,
        comment: comments.filter((comment) => {
          if (i > 1) return false;
          if (comment.post_id === post.id) {
            i++;
            return true;
          }
          return false;
        })
      };
    });
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", {
    nullable: false
  })
  text: string;

  @Column("simple-json", {
    nullable: true
  })
  image: {
    avatar: string;
    cloudinary_id: string;
  };

  @ManyToOne(() => User, (user) => user.post, {
    nullable: false,
    eager: true
  })
  @JoinColumn({
    name: "user_id"
  })
  user: User;

  @Column("int")
  user_id: number;

  @Column("int", {
    default: 0
  })
  like_count: number;

  @OneToMany(() => Like, (like) => like.post, {
    nullable: true,
    onDelete: "CASCADE"
  })
  like: Like[];

  @OneToMany(() => Comment, (comment) => comment.post, {
    nullable: true,
    onDelete: "CASCADE"
  })
  comment: Comment;

  @CreateDateColumn()
  created_at: Date;

}

export default Post;
