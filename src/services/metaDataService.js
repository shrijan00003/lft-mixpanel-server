import MetaData from '../models/metaData';
import { createClientId } from '../utils/jwtUtils';

/**
 * Create new Meta Data .
 *
 * @param  {Object}  Client Details
 * @return {Promise}
 */
export function createMetaData(clientId = '', ipAddress = '', metaDataObj = {}) {
  return new MetaData({
    clientId: clientId,
    browser: metaDataObj.browser,
    os: metaDataObj.os,
    ipAddress,
    device: metaDataObj.device,
    location: metaDataObj.location,
    userId: createClientId(),
  })
    .save()
    .then(metaData => metaData.refresh());
}

export async function totalDataInTable(colName) {
  const total = await MetaData.count(`${colName}`);

  return total;
}
