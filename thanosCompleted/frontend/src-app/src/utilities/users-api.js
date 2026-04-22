
import { sendRequest } from './send-request';
const BASE_URL = "http://localhost:3000/api/users";

export function checkToken() {
  return sendRequest(`${BASE_URL}/check-token`);
}
export async function login(credentials) {
  return sendRequest(`${BASE_URL}/login`, 'POST', credentials);
}
export async function signUp(userData) {
  return sendRequest(BASE_URL, "POST", userData);
}
export async function forgotPassword(email) {
  return sendRequest(`${BASE_URL}/forgot-password`, 'POST', { email });
}
export async function resetPassword(token, password) {
  return sendRequest(`${BASE_URL}/reset-password/${token}`, 'POST', { password });
}
export async function verifyEmail(token) {
  return sendRequest(`${BASE_URL}/verify/${token}`);
}
