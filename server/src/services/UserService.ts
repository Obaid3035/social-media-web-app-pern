import { Service } from "typedi";
import User, { UserRole } from "../entities/User";
// import BaseService from "./base.service";
import FriendShip  from "../entities/FriendShip";
import Post from "../entities/Post";
import cloudinary from "../utils/cloudinary";
import bcrypt from "bcrypt";
import BadRequest from "../utils/errorCode";
import { emailConfirmationMail, reportMail } from "../utils/emailService/emails";

@Service()
class UserService{

  async sendReport(user: User, report: string) {
    await reportMail(user.email, report)
    return {
      message: "Report sent successfully"
    }
  }

  async changeEmail(user: User, email: string) {
    user.email = email;
    await user.save();
    return {
      message: "Email changed successfully!"
    }
  }

  async verifyEmail(user: User, email: string) {
    const token: string = user.generateToken();
    const emailSent = await emailConfirmationMail(email, token);
    if (!emailSent) {
      throw new Error("An Error has occurred")
    }
    return {
      message: "You have received an email with instructions"
    }
  }

  async changePassword(currentUser: User, oldPassword: string, newPassword: string) {
    const isMatch: boolean = await bcrypt.compare(oldPassword, currentUser.password);
    if (!isMatch) throw new BadRequest('password is incorrect');
    currentUser.password = await bcrypt.hash(newPassword, 10);
    await currentUser.save();
    return {
      message: "Password changed successfully!"
    }
  }

  async profilePictureUpload(currentUser: User, img: any) {
    if (currentUser && currentUser.image) {
      await cloudinary.v2.uploader.destroy(currentUser.image.cloudinary_id);
    }

    const uploadedImage = await cloudinary.v2.uploader.upload(img.path);
    currentUser.image = {
      avatar: uploadedImage.secure_url,
      cloudinary_id: uploadedImage.public_id
    }
    await currentUser.save();
    return {
      message: 'Profile picture uploaded!',
      token: currentUser.generateToken()
    }
  }

  async searchUsers(search: any) {
    return await User.createQueryBuilder("user")
      .where("user.user_name like :search", {search: `${search}%`})
      .take(5)
      .getMany();
  }

  async register(userInput: User) {
    console.log("********** Registering user ***********");
    const user = User.create({
      user_name: userInput.user_name,
      email: userInput.email,
      password: userInput.password,
      role: userInput.role ? userInput.role : UserRole.USER,
    });
    await user.save();
    const token: string = user.generateToken();
    console.log("********** User Registered Successfully ***********");
    return {
      token,
      auth: true,
      role: user.role,
    };
  }

  async login(email: string, password: string) {
    console.log("********** Logging user ***********");
    const user = await User.authenticate(email, password);
    const token = user.generateToken();
    console.log("********** User logged in Successfully ***********");
    return {
      auth: true,
      role: user.role,
      token,
    };
  }

  async getUserStats(user_name: string) {
    const user = await User.findOne({
      where: {
        user_name: user_name,
      },
      select: ["id", "user_name", "image", "is_verified"],
    });
    if (!user) throw new BadRequest('user does not exist');
    const postCountPromise = Post.createQueryBuilder("posts")
      .where("posts.user_id = :otherUserId", { otherUserId: user.id })
      .getCount();

    const followersCountPromise = FriendShip.createQueryBuilder("friendship")
      .where("friendship.receiver_id = :receiverId", {
        receiverId: user.id,
      })
      .getCount();

    const followingsCountPromise = FriendShip.createQueryBuilder("friendship")
      .where("friendship.sender_id = :senderId", { senderId: user.id })
      .getCount();

    const [ postCount, followersCount, followingCount] =
      await Promise.all([
        postCountPromise,
        followersCountPromise,
        followingsCountPromise,
      ]);

    return {
      user,
      postCount: postCount,
      followingCount: followingCount,
      followersCount: followersCount,
    }
  }

  async getCurrentUserStats(currentUser: User) {
    const postCountPromise = Post.createQueryBuilder("posts")
      .where("posts.user_id = :otherUserId", { otherUserId: currentUser.id })
      .getCount();

    const followersCountPromise = FriendShip.createQueryBuilder("friendship")
      .where("friendship.receiver_id = :receiverId", {
        receiverId: currentUser.id,
      })
      .getCount();

    const followingsCountPromise = FriendShip.createQueryBuilder("friendship")
      .where("friendship.sender_id = :senderId", { senderId: currentUser.id })
      .getCount();

    const [ postCount, followersCount, followingCount] =
      await Promise.all([
        postCountPromise,
        followersCountPromise,
        followingsCountPromise,
      ]);

    return {
      user: currentUser,
      postCount: postCount,
      followingCount: followingCount,
      followersCount: followersCount,
    }
  }

  async mostFollowedUser() {
    const mostFollowers = await FriendShip.createQueryBuilder("friendship")
      .select("COUNT(friendship.receiver_id)", "count")
      .addSelect("receiver_id")
      .groupBy("friendship.receiver_id")
      .orderBy("count", "DESC")
      .take(4)
      .getRawMany()

    const mostFollowedUserIds = mostFollowers.map((friendship) => friendship.receiver_id);
    if (mostFollowedUserIds.length > 0) {
      return await User.createQueryBuilder("user")
        .select(["user.id", "user.user_name", "user.image"])
        .where("user.id IN(:...receiver_id)", { receiver_id: mostFollowedUserIds })
        .getMany()
    }
    return []
  }
}

export default UserService;
