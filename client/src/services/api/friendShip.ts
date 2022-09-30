import axios from 'axios';
import { getTokenFormat } from '../../utils/helper';

export function sendFollowRequest(receiverId: string) {
   return axios.post(`/friendship/sent/${receiverId}`, {}, getTokenFormat());
}


export function unFollowRequest(userId: string) {
   return axios.delete(
      `/friendship/delete-friendship/${userId}`,
      getTokenFormat()
   );
}

export function deleteFriendship(friendshipId: number) {
   return axios.delete(`/friendship/${friendshipId}`, getTokenFormat())
}

