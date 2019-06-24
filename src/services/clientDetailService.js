import * as jwtUtils from '../utils/jwtUtils';
import ClientDetails from '../models/clientDetails';
import HttpStatus from 'http-status-codes';

/**
 * Create new Client Details.
 *
 * @param  {Object}  Client Details
 * @return {Promise}
 */
export async function createClientDetails(userId, clientDetails) {
  return new ClientDetails({
    clientId: await jwtUtils.createClientId(),
    domainName: clientDetails.domain_name,
    companyName: clientDetails.company_name,
    userId: userId,
  })
    .save()
    .then(clientDetails => clientDetails.refresh())
    .catch(err => {
      throw {
        status: HttpStatus.CONFLICT,
        statusMessage: 'Details not added due to database server conflict. Please try again.',
        err,
      };
    });
}
