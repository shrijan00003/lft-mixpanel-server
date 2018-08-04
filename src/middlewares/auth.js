import { verifyAccessToken } from '../utils/jwtUtils';

export async function authenticate(req, res, next) {
  const accessToken = req.get('authorization');
  try {
    const tokenData = await verifyAccessToken(accessToken);
    req.userId = tokenData.data;
    next();
  } catch (err) {
    res.status(401).json({
      message: 'You are not authenticated to so',
      err,
    });
  }
}
