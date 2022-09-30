import {
  BaseEntity,
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import User from "./User";

@Entity(Calorie.MODEL_NAME)
class Calorie extends BaseEntity {
  static MODEL_NAME = "calorie";

  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  mealType: string

  @Column("float")
  calorie: number

  @Column("float")
  carb: number

  @Column("float")
  protein: number

  @Column("float")
  fat: number

  @Column("float")
  sugar: number


  @ManyToOne(() => User, (user) => user.calorie)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column("int")
  user_id: number;

  @CreateDateColumn()
  created_at: Date;
}

export default Calorie;












