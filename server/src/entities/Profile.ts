import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import User from "./User";

export enum GENDER {
  MALE = "male",
  FEMALE = "female",
}

@Entity(Profile.MODEL_NAME)
class Profile extends BaseEntity {
  static MODEL_NAME = "profile";

  @PrimaryGeneratedColumn()
  id: number;

  @Column("date")
  dob: Date;

  @Column("int")
  height_feet: number;

  @Column("int")
  height_inches: string;

  @Column("float")
  weight: number;

  @Column("varchar")
  weight_unit: string;

  @Column({
    type: "enum",
    enum: GENDER,
  })
  gender: GENDER;

  @CreateDateColumn()
  created_at: Date;

  @Column("int")
  user_id: number;

  @OneToOne(() => User, (user) => user.profile, {
    nullable: false,
    eager: true
  })
  @JoinColumn({
    name: "user_id"
  })
  user: User;
}

export default Profile;
