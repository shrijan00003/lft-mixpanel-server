import * as jwtUtil from '../utils/jwtUtils';
import * as UserService from './userService';

export async function checkLogin(bodyParam) {
  const { email, password } = bodyParam;

  const user = await UserService.fetchByEmail(email);

  const match = await jwtUtil.verifyUser(password, user);

  if (match) {
    const accessToken = jwtUtil.createAccessToken(user.id);
    const refreshToken = jwtUtil.createRefreshToken();
    await UserService.updateUserRefreshToken(user.id, refreshToken);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      id: user.id,
    };
  } else {
    return {
      error: 'credentials are  not matcthed',
    };
  }
}

export async function refresh(id, refreshToken) {
  const user = await UserService.getByIdAndToken(id, refreshToken);
  if (user) {
    const newAccessToken = jwtUtil.createAccessToken(id);
    const newRefreshToken = jwtUtil.createRefreshToken();
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
    console.log(user);
    if (user && (await UserService.updateUserRefreshToken(userId, null))) {
      return {
        status: 200,
        message: 'successfully got logout ',
      };
    } else {
      return {
        status: 404,
        message: 'Sorry user cant found ',
      };
    }
  } catch (err) {
    console.log('error occured on logout in authservice with err =====' + err);
  }
}
