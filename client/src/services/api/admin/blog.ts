import axios from "axios";
import { getTokenFormat } from "../../../utils/helper";

export function createBlog(userInput: any) {
  return axios.post("/admin/blogs", userInput, getTokenFormat())
}

export function getAllBlog(page: number, size: number, search: string) {
  return axios.get(`/admin/blogs?page=${page}&size=${size}&search=${search}`, getTokenFormat())
}

export function getBlogById(id: string) {
  return axios.get(`/admin/blogs/${id}`, getTokenFormat())
}

export function updateBlogById(id: string, userInput: any) {
  return axios.put(`/admin/blogs/${id}`, userInput, getTokenFormat())
}
