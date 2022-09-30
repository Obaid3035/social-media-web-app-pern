// import BaseService from "./base.service";
import Post from "../entities/Post";
import User from "../entities/User";
import { Service } from "typedi";
import FriendShip  from "../entities/FriendShip";
import Comment from "../entities/Comment";
import Like from "../entities/Like";
import cloudinary from "../utils/cloudinary";
import NotFound from "../utils/errorCode";

@Service()
class PostService {

  async delete(postId: number) {
    const post = await Post.findOne({
      where: {
        id: postId
      }
    })

    if(!post) {
      throw new NotFound("Posts not found")
    }
    if (post.image) {
      await cloudinary.v2.uploader.destroy(
        post.image.cloudinary_id
      );
    }
    await Post.delete(post.id)
    return {
      message: "Posts deleted successfully"
    }
  }

  async index(user: User, skip: number, limit: number): Promise<any> {
    console.log(
      "************ Fetching all the friendships of current user ************"
    );
    const friendShips = await FriendShip.createQueryBuilder("friendship")
      .where("friendship.sender_id = :sender_id", { sender_id: user.id })
      .getMany();

    const validUserIds = FriendShip.getValidUserIdsForPost(
      friendShips,
      user.id
    );

    console.log(
      "************ Fetching all the post that current user can see ************"
    );


    const postsPromise = await Post.createQueryBuilder("post")
      .select(["post", "post_user.id", "post_user.user_name", "post_user.image", "post_user.is_verified"])
      .where("post.user_id IN(:...user_id)", { user_id: validUserIds })
      .innerJoin("post.user", "post_user")
      .loadRelationCountAndMap("post.like_count", "post.like")
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .orderBy("post.created_at", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    const postCountPromise = await Post.createQueryBuilder("post")
      .where("post.user_id IN(:...user_id)", { user_id: validUserIds })
      .innerJoin("post.user", "post_user")
      .getCount()

    const [posts, postCount] = await Promise.all([postsPromise, postCountPromise])

    const postIds = posts.map((post) => post.id);

    if (postIds.length <= 0) return {
      posts: [],
      count: postCount
    };

    const comments = await Comment.createQueryBuilder("comment")
      .select(["comment", "user.id", "user.user_name", "user.image", "user.is_verified"])
      .where("comment.post_id IN(:...post_id)", { post_id: postIds })
      .innerJoin("comment.user", "user")
      .orderBy("comment.created_at", "DESC")
      .getMany();

    const likedPost = await Like.find({
      where: {
        user_id: user.id,
      },
    });


    return {
      posts: Post.mergeCommentLikeAndPost(posts, comments, likedPost),
      count: postCount
    }
  }


  async getTrendingPost(user: User, skip: number, limit: number) {
    const postsPromise =  Post.createQueryBuilder("post")
      .select(["post", "user.id", "like_count", "user.user_name", "user.image", "user.is_verified"])
      .where("post.like_count > 7")
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .leftJoin("post.user", "user")
      .skip(skip)
      .take(limit)
      .getMany();

    const postCountPromise = Post.createQueryBuilder("post")
      .where("post.like_count > 7")
      .innerJoin("post.user", "post_user")
      .getCount()

    const [posts, postCount] = await Promise.all([postsPromise, postCountPromise])



    const postIds = posts.map((post) => post.id);

    if (postIds.length <= 0) return {
      posts: [],
      count: 0
    }


    const comments = await Comment.createQueryBuilder("comment")
      .select(["comment", "user.id", "user.user_name", "user.image", "user.is_verified"])
      .where("comment.post_id IN(:...post_id)", { post_id: postIds })
      .innerJoin("comment.user", "user")
      .orderBy("comment.created_at", "DESC")
      .getMany();

    const likedPost = await Like.find({
      where: {
        user_id: user.id,
      },
    });

    return {
      posts: Post.mergeCommentLikeAndPost(posts, comments, likedPost),
      count: postCount,
    }

  }


  async currentUserPost(user: User, skip: number, limit: number): Promise<any>  {

    const postsPromise = Post.createQueryBuilder("post")
      .select(["post", "post_user.id", "post_user.user_name", "post_user.image", "post_user.is_verified"])
      .where("post.user_id = :user_id", { user_id: user.id })
      .innerJoin("post.user", "post_user")
      .loadRelationCountAndMap("post.like_count", "post.like")
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .orderBy("post.created_at", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    const postCountPromise = Post.createQueryBuilder("post")
      .where("post.user_id = :user_id", { user_id: user.id })
      .innerJoin("post.user", "post_user")
      .getCount()

    const [posts, postCount] = await Promise.all([postsPromise, postCountPromise])

    const postIds = posts.map((post) => post.id);

    if (postIds.length <= 0) return {
      posts: [],
      count: 0
    }

    const comments = await Comment.createQueryBuilder("comment")
      .select(["comment", "user.id", "user.user_name", "user.image", "user.is_verified"])
      .where("comment.post_id IN(:...post_id)", { post_id: postIds })
      .innerJoin("comment.user", "user")
      .orderBy("comment.created_at", "DESC")
      .getMany();

    const likedPost = await Like.find({
      where: {
        user_id: user.id,
      },
    });

    return {
      posts: Post.mergeCommentLikeAndPost(posts, comments, likedPost),
      count: postCount,
    }
  }

  async show(postId: string, user: User) {
    const post: any = await Post.createQueryBuilder("post")
      .select(["post", "post_user.id", "post.like_count", "post_user.user_name", "post_user.image", "post_user.is_verified"])
      .where("post.id = :postId", { postId: postId })
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .innerJoin("post.user", "post_user")
      .getOne();

    if (!post) {
      return "No Posts Found";
    }

    const comments = await Comment.createQueryBuilder("comment")
      .select(["comment", "user.id", "user.user_name", "user.image", "user.is_verified"])
      .where("comment.post_id = :post_id", { post_id: post.id })
      .innerJoin("comment.user", "user")
      .orderBy("comment.created_at", "ASC")
      .getMany();

    const likedPost = await Like.createQueryBuilder("like")
      .where("like.user_id = :user_id", {user_id: user.id})
      .andWhere("like.post_id = :post_id", {post_id: post.id})
      .getOne()

    post.liked = !!likedPost;
    post.comment = comments
    return post;
  }

  async getFewTrendingPost(currUserId: number) {
    const likedPost = await Like.find({
      where: {
        user_id: currUserId,
      },
    });

    const posts = await Post.createQueryBuilder("post")
      .select(["post", "user.id", "like_count","user.user_name", "user.image", "user.is_verified"])
      .where("post.like_count > 7")
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .leftJoin("post.user", "user")
      .take(4)
      .getMany();

    if (posts.length === 0) return []

    return posts.map((post) => {
      const liked = likedPost.find((like) => {
        return like.post_id === post.id;
      })
      return {
        ...post,
        liked: !!liked
      };
    })
  }

  async create(userInput: Post, user: User, img: any) {

    let createdPost;
    if (img) {
      const uploadedImage = await cloudinary.v2.uploader.upload(img.path);
      createdPost = Post.create({
        user,
        image: {
          avatar: uploadedImage.secure_url,
          cloudinary_id: uploadedImage.public_id
        },
        text: userInput.text,
      });
      await createdPost.save();
    } else  {
      createdPost = Post.create({
        user,
        image: img ? img.path : null,
        text: userInput.text,
      });
      await createdPost.save();
    }

    const post: any = await Post.createQueryBuilder("post")
      .select(["post", "post_user.id", "post.like_count", "post_user.user_name", "post_user.image", "post_user.is_verified"])
      .where("post.id = :postId", { postId: createdPost.id })
      .innerJoin("post.user", "post_user")
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .getOne();
    const comments = await Comment.createQueryBuilder("comment")
      .select(["comment", "user.id", "user.user_name", "user.image"])
      .where("comment.post_id = :post_id", { post_id: post.id })
      .innerJoin("comment.user", "user")
      .orderBy("comment.created_at", "ASC")
      .getMany();


    const likedPost = await Like.createQueryBuilder("post")
      .where("post.post_id = :post_id", { post_id: post.id })
      .andWhere("post.user_id = :user_id", { user_id: user.id})
      .getOne();
    post.comment = comments;
    post.liked = !!likedPost

    return post;
  }

  async otherPost(
    currUser: User,
    user_name: string,
    skip: number,
    limit: number
  ) {

    const user = await User.findOne({
      where: {
        user_name
      }
    })

    console.log(
      "************ Fetching post, followers/following, name of the other user ************"
    );

    console.log(
      "************ Checking if user and otherUser have a friendShip ************"
    );


    const friendShip = await FriendShip.createQueryBuilder("friendship")
      .where("friendship.receiver_id = :receiver_id", {
        receiver_id: user.id,
      }).andWhere("friendship.sender_id = :sender_id", {
        sender_id: currUser.id,
      }).getOne();

    if (!friendShip) {
      console.log(
        "************ User and other user friendShip does not exist ************"
      );
      return {
        friendship: false,
      };
    }
    console.log(
      "************ Fetching all the post that other user ************"
    );
    const postsPromise = Post.createQueryBuilder("post")
      .select(["post", "post_user.id", "post.like_count", "post_user.user_name",  "post_user.image", "post_user.is_verified"])
      .where("post.user_id = :user_id", { user_id: user.id })
      .innerJoin("post.user", "post_user")
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .orderBy("post.created_at", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    const postCountPromise = Post.createQueryBuilder("post")
      .where("post.user_id = :user_id", { user_id: user.id })
      .innerJoin("post.user", "post_user")
      .getCount()


    const [posts, postCount] = await Promise.all([postsPromise, postCountPromise])


    const postIds = posts.map((post) => post.id);

    if (postIds.length <= 0) {
      return {
        friendship: true,
        count: postCount,
        posts: []
      };
    }

    const comments = await Comment.createQueryBuilder("comment")
      .select([
        "comment",
        "user.id",
        "user.user_name",
        "user.image",
      ])
      .where("comment.post_id IN(:...post_id)", { post_id: postIds })
      .innerJoin("comment.user", "user")
      .orderBy("comment.created_at", "ASC")
      .getMany();

    const likedPost = await Like.find({
      where: {
        user_id: currUser.id,
      },
    });
    return {
      friendship: true,
      count: postCount,
      posts: Post.mergeCommentLikeAndPost(posts, comments, likedPost),
    };
  }
}

export default PostService;
