import { identifyClient } from '../services/clientServices';

export async function identyfyClient(req, res, next) {
  const clientId = req.get('clientId');
  const email = req.get('email');
  try {
    const identifiedClient = await identifyClient(clientId, email);
    if (identifiedClient) {
      req.identifiedClient = identifiedClient;
      req.clientId = clientId;
      req.email = email;
      next();
    }
  } catch (err) {
    res.status(401).json({
      message: 'You are not authenticated to so',
      err,
    });
  }
}
