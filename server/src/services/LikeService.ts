import { Service } from "typedi";
import User from "../entities/User";
import Like from "../entities/Like";
import Post from "../entities/Post";
import { NotFound } from "../utils/errorCode";
import Notification, { NotificationStatus } from "../entities/Notification";

@Service()
class LikeService {
  async create(currUser: User, postId: number) {
    const post: Post = await Post.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFound("User not found");
    }

    const foundLike = await Like.findOne({
      where: {
        post_id: postId,
        user_id: currUser.id,
      },
    });

    if (foundLike) {
      post.like_count -= 1;
      const savedPostPromise = post.save();
      const likedPostPromise = Like.delete({
        id: foundLike.id,
      });
      await Promise.all([savedPostPromise, likedPostPromise]);
      return {
        liked: false,
      };
    }

    const like = Like.create({
      user: currUser,
      post: post,
    });
    post.like_count += 1;
    const savedPostPromise = post.save();
    const savedLike = like.save();
    await Promise.all([savedPostPromise, savedLike]);
    if (post.user.id != currUser.id) {
      const notification = await Notification.createNotification(
        currUser,
        post.user,
        NotificationStatus.Like,
        post.id
      );
      return {
        liked: true,
        notification,
      };
    }

    return {
      liked: true,
    };
  }
}

export default LikeService;
