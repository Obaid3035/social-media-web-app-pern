import axios from "axios";
import { getTokenFormat } from "../../utils/helper";


export const getFewNotification = () => {
  return axios.get(`/notification/few`, getTokenFormat())
}

export const getNotification = () => {
  return axios.get(`/notification`, getTokenFormat())
}

export const updateNotification = (id: number) => {
  return axios.put(`/notification/${id}`, {},getTokenFormat())
}


