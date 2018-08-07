import Track from '../models/track';

/**
 * Create new Track Data .
 *
 * @param  {Object}  Client Details
 * @return {Promise}
 */
export function createNewTrack(eventName, metadataId, payload) {
  return new Track({
    eventName,
    metadataId,
    payload,
  })
    .save()
    .then(metaData => metaData.refresh());
}
