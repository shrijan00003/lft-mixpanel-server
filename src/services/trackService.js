import Track from '../models/track';

/**
 * Create new Track Data .
 *
 * @param  {Object}  Client Details
 * @return {Promise}
 */
export function createNewTrack(metadataId, eventName, payload) {
  return new Track({
    metadataId,
    eventName,
    payload,
  })
    .save()
    .then(metaData => metaData.refresh());
}
