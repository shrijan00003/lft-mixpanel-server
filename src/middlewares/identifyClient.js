import { identifyClient } from '../services/clientServices';
import requestIp from 'request-ip';

export async function identyfyClient(req, res, next) {
  const clientId = req.get('clientId');
  const email = req.get('email');
  const clientIp = requestIp.getClientIp(req);
  try {
    const identifiedClient = await identifyClient(clientId, email);
    if (identifiedClient) {
      req.identifiedClient = identifiedClient;
      req.clientId = clientId;
      req.email = email;
      req.clientIp = clientIp;
      next();
    }
  } catch (err) {
    res.status(401).json({
      message: 'You are not authenticated to so',
      err,
    });
  }
}
