import client from '../redis';
import { promisify } from 'util';
import requestIp from 'request-ip';
import { identifyClient } from '../services/clientServices';

const getAsync = promisify(client.get).bind(client);

export async function identyfyClient(req, res, next) {
  // const userInformation = client.get('clientInformation', async (err, result) => {
  //   if (result) {
  //     const resultObj = await JSON.parse(result);
  //     console.log(resultObj)
  //     // this is printing the result

  //     return resultObj;
  //   } else {
  //     console.log('err', err);
  //   }
  // });

  // console.log(userInformation); // this only prints true

  const userInformation = await getAsync('clientInformation')
    .then(data => {
      return JSON.parse(data);
    })
    .catch(err => console.log(err));

  const clientId = userInformation ? userInformation.clientId : null;
  const email = userInformation ? userInformation.email : null;

  console.log(clientId, email);

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
