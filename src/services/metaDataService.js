import MetaData from '../models/metaData';
import { createClientId } from '../utils/jwtUtils';

/**
 * Create new Meta Data .
 *
 * @param  {Object}  Client Details
 * @return {Promise}
 */
export function createMetaData(clientId = '', metaDataObj = {}) {
  return new MetaData({
    clientId: clientId,
    browser: metaDataObj.browser,
    os: metaDataObj.os,
    ipAddress: metaDataObj.ipAddress,
    device: metaDataObj.device,
    location: metaDataObj.location,
    userId: createClientId(),
  })
    .save()
    .then(metaData => metaData.refresh());
}
