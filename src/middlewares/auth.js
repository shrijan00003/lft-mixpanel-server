import { verifyAccessToken } from '../utils/jwtUtils';

export function authenticate(req, res, next) {
  const accessToken = req.get('authorization');

  if (typeof accessToken !== 'undefined') {
    const verify = new Promise(resolve => {
      resolve(verifyAccessToken(accessToken));
    })
      .then(res => {
        req.userId = res.data;
        next();
      })
      .catch(() => {
        return res.status(401).json({
          message: 'This resource is forbidden, acess key expired',
        });
      });

    return verify;
  } else {
    // Forbidden
    res.status(401).json({
      message: 'This resource is unauthorised, no access token found',
    });
  }
}
