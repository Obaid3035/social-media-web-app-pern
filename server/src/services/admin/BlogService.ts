import { Service } from "typedi";
import Blog from "../../entities/Blog";
import User from "../../entities/User";
import cloudinary from "../../utils/cloudinary";
import { NotFound } from "../../utils/errorCode";
import slugify from "slugify";

@Service()
class BlogService {

  async index(skip: number, limit: number, search: any) {
    let blogPromise = Blog.createQueryBuilder("blog")
      .select(["blog.id", "blog.title"])
      .skip(skip)
      .take(limit)
      .getMany();

    let blogCountPromise = Blog.createQueryBuilder("blog")
      .getCount()

    if(search && search.length > 0) {
      blogPromise = Blog.createQueryBuilder("blog")
        .select(["id", "title"])
        .andWhere('title ILIKE :searchTerm', {searchTerm: `%${search}%`})
        .skip(skip)
        .take(limit)
        .getMany();

      blogCountPromise = Blog.createQueryBuilder("blog")
        .andWhere('title ILIKE :searchTerm', {searchTerm: `%${search}%`})
        .getCount()
    }

    const [blog, blogCount] = await Promise.all([blogPromise, blogCountPromise]);
    const formattedBlog = blog.map((blog) => {
      return Object.values(blog)
    });
    return {
      data: formattedBlog,
      count: blogCount
    }
  }

  async show(blogId: number) {
    const blog = await Blog.findOne({
      where: {
        id: blogId
      }
    });
    if (!blog) {
      throw new NotFound("Blog not found")
    }
    return blog
  }

  async create(userInput: Blog, user: User, img: any) {
    const uploadedImage = await cloudinary.v2.uploader.upload(img.path);
    const createdBlog = Blog.create({
      user,
      feature_image: {
        avatar: uploadedImage.secure_url,
        cloudinary_id: uploadedImage.public_id
      },
      slug: slugify(userInput.title),
      title: userInput.title,
      text: userInput.text,
      is_featured: userInput.is_featured
    });
    await createdBlog.save();

    return {
      saved: true
    }
  }

  async update(userInput: Blog, blogId: number, file: any) {
    const blog = await Blog.findOne({
      where: {
        id: blogId
      }
    });
    if (!blog) {
      throw new NotFound("Blog not found")
    }
    blog.title = userInput.title;
    blog.slug = slugify(userInput.title);
    blog.text = userInput.text;
    blog.is_featured = userInput.is_featured;
    if (file) {
      const uploadedImage = await cloudinary.v2.uploader.upload(file.path);
      blog.feature_image = {
        avatar: uploadedImage.secure_url,
        cloudinary_id: uploadedImage.public_id
      }
    }
    await blog.save();
    return {
      message: "Blog updated successfully!"
    }
  }
}

export default BlogService
