import Track from '../models/track';
import { getNewDate } from '../utils/date';

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

export async function getTracksWithMetaData(ClientId = '', query = {}) {
  console.log(ClientId, query);
  const sortBy = query.sort_by || 'id';
  const sortOrder = query.sort_order || 'ASC';
  const page = query.page || '1';
  const pageSize = query.page_size || '10';

  let newDate = null;
  let isDate = false;
  let queryDate = null;
  let isLocation = false;
  let totalData = await Track.count();

  // finding new date

  if (query.latitude && query.longitude) {
    isLocation = true;
  }

  if (query.date) {
    queryDate = query.date;
    const dateSplitted = queryDate.split('-');
    if (dateSplitted.length > 1) {
      newDate = queryDate;
      isDate = true;
    } else {
      newDate = getNewDate(queryDate);
      isDate = false;
    }
  }

  // counting functions

  if (queryDate !== null && !isDate) {
    const total = await Track.where('tracks.created_at', '>', newDate)
      .where('tracks.created_at', '<', new Date())
      .count();
    totalData = total;
  } else if (queryDate !== null && isDate) {
    const total = await Track.query(q => {
      q.count('*').whereRaw('tracks.created_at::date = ?', newDate);
    })
      .fetchAll()
      .then(count => count);
    totalData = JSON.parse(JSON.stringify(total))[0].count;
  } else {
    const total = await Track.count();
    totalData = total;
  }

  const response = Track.forge({})
    .query(qb => {
      if (queryDate !== null && !isDate) {
        qb.select('*')
          .join('event_metadata', { 'tracks.metadata_id': 'event_metadata.id' })
          .whereBetween('tracks.created_at', [newDate, new Date()]);
      } else if (queryDate !== null && isDate) {
        qb.select('*')
          .join('event_metadata', { 'tracks.metadata_id': 'event_metadata.id' })
          .whereRaw('tracks.created_at::date = ?', newDate);
      } else if (isLocation) {
        console.log('here');
        qb.select('*')
          .join('event_metadata', { 'tracks.metadata_id': 'event_metadata.id' })
          .whereRaw('event_metadata.location ->> ? = ?', ['latitude', JSON.parse(query.latitude)])
          .whereRaw('event_metadata.location ->> ? = ?', ['longitude', JSON.parse(query.longitude)]);
        console.log(qb.toQuery());
      } else {
        qb.select('*').join('event_metadata', { 'tracks.metadata_id': 'event_metadata.id' });
        console.log(qb.toQuery());
      }
    })
    .where('client_id', ClientId)
    .orderBy(sortBy, sortOrder)
    .fetchPage({
      pageSize,
      page,
    })
    .then(data => {
      if (!data) {
        throw {
          status: 404,
          statusMessage: 'NOT FOUND',
        };
      }
      const metaData = { page, pageSize, totalData };

      return { metaData, data };
    })
    .catch(err => {
      console.log(err);
      throw {
        status: 403,
        statusMessage: 'ERROR OCCURED WHILE FETCHING DATA',
      };
    });

  return response;
} // END OF FUNCTION
