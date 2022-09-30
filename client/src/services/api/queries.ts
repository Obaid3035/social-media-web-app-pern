import axios from "axios";
import { getTokenFormat } from "../../utils/helper";

export function getTopic() {
  return axios.get(`/queries/topic`, getTokenFormat())
}

export function getQueries(topic: string) {
  return axios.get(`/queries/${topic}`, getTokenFormat())
}

export function createQueries(topic: string, text: string) {
  return axios.post(`/queries/${topic}`, { text }, getTokenFormat())
}

export function getAnswers(queryId: number) {
  return axios.get(`/queries/answer/${queryId}`, getTokenFormat())
}

export function createAnswers(queryId: number, text: string) {
  return axios.post(`/queries/answer/${queryId}`, { text }, getTokenFormat())
}

export function deleteQueries(queryId: number) {
  return axios.delete(`/queries/${queryId}`, getTokenFormat())
}


