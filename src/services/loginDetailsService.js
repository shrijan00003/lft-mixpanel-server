import { fetchUserLoginDetails } from './userService';
import LoginDetails from '../models/loginDetails';

/**
 *
 * @param {Object} userLoginDetails
 * @param {Integer } userId
 * @param {Integer} status
 */
export function createLoginDetails(userLoginDetails, userId, status) {
  const loginDetails = new LoginDetails({
    status: status,
    user_id: userId,
    os: userLoginDetails.os,
    device: userLoginDetails.device,
    details: userLoginDetails.details,
    browser: userLoginDetails.browser,
    location: userLoginDetails.location,
    ip_address: userLoginDetails.ip_address,
  })
    .save()
    .then(loginDetails => loginDetails.refresh());

  return loginDetails;
}

/**
 *
 * Function to get login attempts count
 * @param {Object} userData
 */
export async function countLoginAttempts(userData) {
  const durationInMins = 2;
  const msPerSecond = 60000;
  const currentDate = new Date();
  const checkFromDate = new Date(currentDate.getTime() - durationInMins * msPerSecond);

  try {
    const user = await fetchUserLoginDetails(userData.userIdentity, checkFromDate);
    if (user) {
      return user;
    }
  } catch (err) {
    return err;
  }
}
