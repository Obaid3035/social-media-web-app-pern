import axios from 'axios';
import { getTokenFormat, PAGINATION_LIMIT_POST } from "../../utils/helper";

export function getFeedPost(page: number) {
   return axios.get(`/posts?page=${page}&size=${PAGINATION_LIMIT_POST}`, getTokenFormat());
}


export function likePost(postId: number) {
   return axios.post(`/likes/${postId}`, {}, getTokenFormat());
}

export function createPost(userInput: any) {
   return axios.post(`/posts`, userInput, getTokenFormat());
}

export function getPostById(postId: string) {
   return axios.get(`/posts/${postId}`, getTokenFormat());

}

export function createComment(userInput: {text: string}, postId: number) {
   return axios.post(`/comments/${postId}`, userInput, getTokenFormat());
}

export function deleteComment(commentId: number) {
   return axios.delete(`/comments/${commentId}`, getTokenFormat());
}

export function currentUserPost(page: number, size: number) {
   return axios.get(`/posts/current-user?page=${page}&size=${size}`, getTokenFormat())
}

export function currentUserStats() {
   return axios.get('/auth/current-user/stats', getTokenFormat())
}

export function otherProfile(userId: string) {
   return axios.get(`/auth/stats/${userId}`, getTokenFormat())
}

export function otherProfilePost(userId: string, page: number, size: number) {
   return axios.get(`/posts/user/${userId}?page=${page}&size=${size}`, getTokenFormat());
}

export function getFewTrendingPosts() {
   return axios.get(`/posts/trending/few`, getTokenFormat())
}

export function getTrendingPosts(page: number) {
   return axios.get(`/posts/trending?page=${page}&size=${PAGINATION_LIMIT_POST}`, getTokenFormat())
}

export function deletePost(postId:  number) {
   return axios.delete(`/posts/${postId}`, getTokenFormat());
}
