import { Service } from "typedi";
import User from "../../entities/User";

@Service()
class UserService {
  async index(skip: number, limit: number, search: any ) {
    let userPromise = User.createQueryBuilder("user")
      .where("user.role != :role", { role: "admin"})
      .select(["user.id", "user.user_name", "user.email", "user.is_verified"])
      .skip(skip)
      .take(limit)
      .getMany();

    let userCountPromise = User.createQueryBuilder("user")
      .where("user.role != :role", { role: "admin"})
      .getCount()

    if(search && search.length > 0) {
      userPromise = User.createQueryBuilder("user")
        .where("user.role != :role", { role: "admin"})
        .andWhere('user_name ILIKE :searchTerm', {searchTerm: `%${search}%`})
        .select(["user.id", "user.user_name", "user.email", "user.is_verified"])
        .skip(skip)
        .take(limit)
        .getMany();

      userCountPromise = User.createQueryBuilder("user")
        .where("user.role != :role", { role: "admin"})
        .andWhere('user_name ILIKE :searchTerm', {searchTerm: `%${search}%`})
        .getCount()
    }


    const [user, userCount] = await Promise.all([userPromise, userCountPromise]);
    const formattedUser = user.map((user) => {
      return Object.values(user)
    });

    return {
      data: formattedUser,
      count: userCount
    }
  }

  async verifiedUser(skip: number, limit: number) {
    const userPromise = User.createQueryBuilder("user")
      .where("user.role != :role", { role: "admin"})
      .andWhere("user.is_verified = :is_verified", { is_verified: true})
      .select(["user.id", "user.user_name", "user.email", "user.is_verified"])
      .skip(skip)
      .take(limit)
      .getMany();

    const userCountPromise = User.createQueryBuilder("user")
      .getCount()

    const [user, userCount] = await Promise.all([userPromise, userCountPromise]);
    const formattedUser = user.map((user) => {
      return Object.values(user)
    });

    return {
      data: formattedUser,
      count: userCount
    }
  }

  async notVerifiedUser(skip: number, limit: number) {
    const userPromise = User.createQueryBuilder("user")
      .where("user.role != :role", { role: "admin"})
      .andWhere("user.is_verified = :is_verified", { is_verified: false})
      .select(["user.id", "user.user_name", "user.email", "user.is_verified"])
      .skip(skip)
      .take(limit)
      .getMany();

    const userCountPromise = User.createQueryBuilder("user")
      .getCount()

    const [user, userCount] = await Promise.all([userPromise, userCountPromise]);
    const formattedUser = user.map((user) => {
      return Object.values(user)
    });

    return {
      data: formattedUser,
      count: userCount
    }
  }

  async toVerified(userId: number) {
    const user = await User.findOne({
      where: {
        id: userId
      }
    })
    await User.createQueryBuilder("user")
      .update({
        is_verified: !user.is_verified
      })
      .where({
        id: userId,
      })
      .execute()

    return {
      message: "User updated successfully!"
    }
  }

}

export default UserService;
