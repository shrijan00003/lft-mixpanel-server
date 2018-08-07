import MetaData from '../models/metaData';

/**
 * Create new Meta Data .
 *
 * @param  {Object}  Client Details
 * @return {Promise}
 */
export function createMetaData(metaDataObj) {
  return new MetaData({
    clientId: metaDataObj.clientId,
    browser: metaDataObj.browser,
    os: metaDataObj.os,
    userId: metaDataObj.userId,
    ipAddress: metaDataObj.ipAddress,
    device: metaDataObj.device,
    location: metaDataObj.location,
  })
    .save()
    .then(metaData => metaData.refresh());
}
