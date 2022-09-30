import jwt from "jwt-decode"
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import moment from 'moment'
TimeAgo.addDefaultLocale(en)

export const PAGINATION_LIMIT_TABLE = 3
export const PAGINATION_LIMIT_POST = 3

export function setToken(token: string) {
   localStorage.setItem('token', token);
}

export function getToken() {
   return localStorage.getItem('token');
}

export function getTokenFormat() {
   const token = getToken();
   if (token) {
      return { headers: { Authorization: `Bearer ${token}` } };
   }
}

export function getCurrentUser() {
   const decode: { user: any } = jwt(getToken()!);
   return decode.user;
}


export function removeToken() {
   localStorage.removeItem("token")
}

export function timeAgo(time: string) {
   const timeAgo = new TimeAgo('en-US')
   const milliseconds = moment(time).valueOf();
   return timeAgo.format(milliseconds)
}
