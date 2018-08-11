import * as jwtUtil from '../utils/jwtUtils';
import * as UserService from './userService';
import * as LoginDetailsService from './loginDetailsService';

export async function loginUser(bodyParam, clientIp) {
  let loginStatus = 0;

  const password = bodyParam.password,
    userIdentity = bodyParam.user_identity;

  const userLoginDetails = {
    os: bodyParam.os,
    ip_address: clientIp,
    device: bodyParam.device,
    details: bodyParam.details,
    browser: bodyParam.browser,
    location: bodyParam.location,
  };

  try {
    const user = await UserService.fetchUser(userIdentity);
    const match = await jwtUtil.verifyUser(password, user);
    const userObj = JSON.parse(JSON.stringify(user));

    if (match) {
      loginStatus = 1;
      const accessToken = jwtUtil.createAccessToken(user.id);
      const refreshToken = jwtUtil.createRefreshToken(user.id);
      await UserService.updateUserRefreshToken(user.id, refreshToken);

      // Recording login success details
      LoginDetailsService.createLoginDetails(userLoginDetails, user.id, loginStatus);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        id: user.id,
        name: userObj.firstName + ' ' + userObj.lastName,
        userName: userObj.userName,
      };
    } else {
      loginStatus = 0;
      // Recording login failure details
      LoginDetailsService.createLoginDetails(userLoginDetails, user.id, loginStatus);
      throw {
        status: 403,
        statusMessage: 'The password did not matched the user. Please try again.',
      };
    }
  } catch (err) {
    throw err;
  }
}

export async function refresh(id, refreshToken) {
  const user = await UserService.getByIdAndToken(id, refreshToken);
  if (user) {
    const newAccessToken = jwtUtil.createAccessToken(id);
    const newRefreshToken = jwtUtil.createRefreshToken(id);
    await UserService.updateUserRefreshToken(id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } else {
    return {
      message: 'user credintial not found for this refresh Token',
      status: 404,
    };
  }
}

export async function logout(userId, refreshToken) {
  try {
    const user = await UserService.getByIdAndToken(userId, refreshToken);
    if (user) {
      await UserService.updateUserRefreshToken(userId);
    }

    return {
      status: 200,
      message: 'Successful logged out',
    };
  } catch (err) {
    throw err;
  }
}
