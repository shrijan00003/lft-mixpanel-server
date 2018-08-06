import * as jwtUtil from '../utils/jwtUtils';
import * as UserService from './userService';

export async function loginUser(bodyParam) {
  const userEmail = bodyParam.user_email;
  const { password } = bodyParam;

  try {
    const user = await UserService.fetchByEmail(userEmail);
    const match = await jwtUtil.verifyUser(password, user);
    const userObj = JSON.parse(JSON.stringify(user));

    if (match) {
      const accessToken = jwtUtil.createAccessToken(user.id);
      const refreshToken = jwtUtil.createRefreshToken(user.id);
      await UserService.updateUserRefreshToken(user.id, refreshToken);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        id: user.id,
        userName: userObj.userName,
      };
    } else {
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
