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
    client_id: await jwtUtils.createClientId(),
    domain_name: domainName,
    user_id: userId,
  })
    .save()
    .then(clientDetails => clientDetails.refresh());
}
