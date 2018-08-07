import LoginDetails from '../models/loginDetails';

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
