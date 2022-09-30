import {
  BaseEntity,
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import User from "./User";

@Entity(Blog.MODEL_NAME)
class Blog extends BaseEntity {
  static MODEL_NAME = "blog";

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    nullable: true
  })
  slug: string;

  @Column('varchar')
  title: string;

  @Column("simple-json", {
    nullable: true
  })
  feature_image: {
    avatar: string;
    cloudinary_id: string;
  };

  @Column('varchar')
  text: string;

  @Column('boolean')
  is_featured: boolean;

  @ManyToOne(() => User, (user) => user.blog)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column("int")
  user_id: number;

  @CreateDateColumn()
  created_at: Date;
}

export default Blog;
