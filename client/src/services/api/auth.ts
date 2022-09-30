import { IAuthInput } from '../../container/Auth/Auth';
import axios from 'axios';
import { getTokenFormat } from '../../utils/helper';
import { IProfileInput } from '../../container/CalorieTracker/CalorieFormModal/CalorieFormModal';

export function register(userInput: IAuthInput) {
   return axios.post('/auth/register', userInput);
}

export function login(userInput: IAuthInput) {
   return axios.post('/auth/login', userInput);
}

export function getProfile() {
   return axios.get('/profiles', getTokenFormat());
}

export function createProfile(userInput: IProfileInput) {
   return axios.post('/profiles', userInput, getTokenFormat());
}

export function updateProfile(userInput: {
   weight_unit: string;
   gender: string;
   height_feet: number;
   height_inches: string;
   weight: number;
}) {
   return axios.put('/profiles', userInput, getTokenFormat());
}

export function mostFollowedUser() {
   return axios.get('/auth/top', getTokenFormat());
}

export function uploadProfilePicture(userInput: any) {
   return axios.put(`/auth/upload`, userInput, getTokenFormat());
}

export function authorizeUser(token: string) {
   return axios.get(`/auth/authorize/${token}`, getTokenFormat());
}

export function verifyEmail(email: string) {
   return axios.put(`/auth/verify-email`, { email }, getTokenFormat());
}

export function changeEmail(email: string, token: string) {
   return axios.put(
      `/auth/change-email`,
      { email },
      { headers: { Authorization: `Bearer ${token}` } }
   );
}

export function changePassword(oldPassword: string, newPassword: string) {
   return axios.put(`/auth/change-password`, { oldPassword, newPassword }, getTokenFormat());
}

export function sendReport(report: string) {
   return axios.put(`/auth/report`, { report }, getTokenFormat());
}
