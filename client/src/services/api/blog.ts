import axios from "axios";
import { getTokenFormat } from "../../utils/helper";

export function getAllBlogs() {
  return axios.get(`/blogs`, getTokenFormat());
}

export function getFewBlogs() {
  return axios.get(`/blogs/few`, getTokenFormat());
}

export function getBlogById(id: string) {
  console.log(id)
  return axios.get(`/blogs/${id}`, getTokenFormat());
}
