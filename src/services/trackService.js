import Track from '../models/track';
import { getNewDate } from '../utils/date';
import { getObject } from '../utils/jsUtils';
import { totalDataInTable } from './metaDataService';
import bookshelf from '../db';

const KNEX = bookshelf.knex;

/**
 * Create new Track Data .
 *
 * @param  {Object}  Client Details
 * @return {Promise}
 */
export function createNewTrack(metadataId, eventName, payload) {
  return new Track({
    payload,
    eventName,
    metadataId,
  })
    .save()
    .then(metaData => metaData.refresh());
}

export function getTracksWithMetaData(ClientId = '', query = {}) {
  console.log(ClientId, query);

  const page = query.page || '1';
  const sortBy = query.sort_by || 'id';
  const pageSize = query.page_size || '10';
  const sortOrder = query.sort_order || 'ASC';

  let newDate = null;
  let isDate = false;
  let queryDate = null;
  let isLocation = false;
  let isEventQuery = false;

  // finding new date

  if (query.latitude && query.longitude) {
    isLocation = true;
  }

  if (query.event_name) {
    isEventQuery = true;
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
  const response = Track.forge({})
    .query(qb => {
      qb.select(
        'tracks.id as track_id',
        'em.id as metadata_id',
        'tracks.event_name',
        'em.os',
        'tracks.created_at',
        'em.browser',
        'em.ip_address',
        'em.device',
        'em.location'
      ).join('event_metadata as em', 'tracks.metadata_id', 'em.id');
      if (queryDate !== null && !isDate) {
        qb.whereBetween('tracks.created_at', [newDate, new Date()]);
      }
      if (queryDate !== null && isDate) {
        qb.whereRaw('tracks.created_at::date = ?', newDate);
      }
      if (isLocation) {
        qb.whereRaw('em.location ->> ? = ?', ['latitude', JSON.parse(query.latitude)]);
        qb.whereRaw('em.location ->> ? = ?', ['longitude', JSON.parse(query.longitude)]);
      }
      if (isEventQuery) {
        qb.where('tracks.event_name', 'iLIKE', `%${query.event_name}%`);
      } else {
        return;
      }
    })
    .where('em.client_id', ClientId)
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

      return data;
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

/**
 *
 * @param {*} col
 * @param {*} table
 */
export async function getMaxUsedDevices(clientId, col, table) {
  const totalDevice = await totalDataInTable(col, table);

  return Track.forge({})
    .query(qb => {
      qb.select(table + '.' + col)
        .count(table + '.' + col + ' as countedDeivice')
        .join('event_metadata', { 'tracks.metadata_id': 'event_metadata.id' })
        .groupBy(table + '.' + col)
        .orderBy('countedDeivice', 'DESC')
        .limit('5');
      console.log(qb.toQuery());
    })
    .where('event_metadata.client_id', clientId)
    .fetchAll()
    .then(async data => {
      data = await getObject(data);
      console.log(data, totalDevice);

      return { data, totalDevice };
    })
    .catch(err => console.log(err));
}

/**
 *
 */
export async function getTrackAnalytics(clientId = '', query = {}) {
  const eventName = query.event_name;

  const page = query.page || '1';
  const pageSize = query.page_size || '10';

  const result = await Track.forge()
    .query(q => {
      q.distinct('tracks.event_name', 'em.browser', 'em.os', 'em.device')
        .select(KNEX.raw(`count(em.user_id) OVER (PARTITION BY tracks.event_name) AS total_users`))
        .join('event_metadata as em', 'tracks.metadata_id', 'em.id')
        .orderBy('total_users', 'DESC');
      if (eventName) {
        q.where('tracks.event_name', 'iLIKE', `%${eventName}%`);
      }
      console.log('query printing', q.toQuery());
    })
    .where('em.client_id', clientId)
    .fetchPage({
      pageSize,
      page,
    })
    .then(d => d)
    .catch(err => console.log(`ERROR IN FETCHING DATA ${err}`));

  return result;
}
