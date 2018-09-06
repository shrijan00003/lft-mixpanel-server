import client from '../redis';
import { promisify } from 'util';
import requestIp from 'request-ip';
import { identifyClient } from '../services/clientServices';

const getAsync = promisify(client.get).bind(client);

export async function identyfyClient(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      throw {
        status: 400,
        statusMessage: 'EMAIL NOT FOUND PLEASE PROVIDE EMAIL REGISTERED',
      };
    }
    const userInformation = await getAsync(email)
      .then(data => {
        return data;
      })
      .catch(err => console.log(err));

    const clientId = userInformation ? userInformation : null;

    // console.log(clientId, email);

    const clientIp = requestIp.getClientIp(req);
    const identifiedClient = await identifyClient(clientId, email);
    if (identifiedClient) {
      req.identifiedClient = identifiedClient;
      req.clientId = clientId;
      req.email = email;
      req.clientIp = clientIp;
      next();
    }
  } catch (err) {
    res.status(err.status).json({
      message: err.statusMessage,
    });
  }
}
