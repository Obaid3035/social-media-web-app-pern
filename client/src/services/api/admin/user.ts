import axios from "axios";
import { getTokenFormat } from "../../../utils/helper";

export function getAllUsers(page: number, size: number, search: string) {
  return axios.get(`/admin/users?page=${page}&size=${size}&search=${search}`, getTokenFormat())
}

export function getVerifiedUser(page: number, size: number) {
  return axios.get(`/admin/users/verified?page=${page}&size=${size}`, getTokenFormat())
}


export function getNotVerifiedUser(page: number, size: number) {
  return axios.get(`/admin/users/not-verified?page=${page}&size=${size}`, getTokenFormat())
}


export function toVerified(userId: number) {
  return axios.put(`/admin/users/${userId}`, {},getTokenFormat())
}
