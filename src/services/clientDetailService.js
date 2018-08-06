import * as jwtUtils from '../utils/jwtUtils';
import ClientDetails from '../models/clientDetails';

/**
 * Create new Client Details.
 *
 * @param  {Object}  Client Details
 * @return {Promise}
 */
export async function createClientDetails(userId, domainName) {
  return new ClientDetails({
    clientId: await jwtUtils.createClientId(),
    domainName: domainName,
    userId: userId,
  })
    .save()
    .then(clientDetails => clientDetails.refresh());
}
