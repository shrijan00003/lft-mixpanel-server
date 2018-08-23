import Track from '../models/track';
import { getNewDate } from '../utils/date';
import { getObject } from '../utils/getObject';
import { totalDataInTable } from './metaDataService';

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

export function getTracksWithMetaData(ClientId = '', query = {}) {
  console.log(ClientId, query);

  const sortBy = query.sort_by || 'id';
  const sortOrder = query.sort_order || 'ASC';
  const page = query.page || '1';
  const pageSize = query.page_size || '10';

  let newDate = null;
  let isDate = false;
  let queryDate = null;
  let isLocation = false;
  let isEventQuery = false;

  // let totalData = await Track.count();

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

  // counting functions

  // if (queryDate !== null && !isDate) {
  //   const total = await Track.where('tracks.created_at', '>', newDate)
  //     .where('tracks.created_at', '<', new Date())
  //     .count();
  //   totalData = total;
  // } else if (queryDate !== null && isDate) {
  //   const total = await Track.query(q => {
  //     q.count('*').whereRaw('tracks.created_at::date = ?', newDate);
  //   })
  //     .fetchAll()
  //     .then(count => count);
  //   totalData = JSON.parse(JSON.stringify(total))[0].count;
  // } else if (isEventQuery) {
  //   const total = await Track.query(q => {
  //     q.count('*').whereRaw('tracks.event_name = ? ', query.event_name);
  //   })
  //     .fetchAll()
  //     .then(count => count);
  //   console.log(JSON.stringify(total));
  //   totalData = JSON.parse(JSON.stringify(total))[0].count;
  // } else {
  //   const total = await Track.count();
  //   totalData = total;
  // }

  const response = Track.forge({})
    .query(qb => {
      qb.select('*').join('event_metadata', {
        'tracks.metadata_id': 'event_metadata.id',
      });
      console.log(qb.toQuery());

      if (queryDate !== null && !isDate) {
        qb.whereBetween('tracks.created_at', [newDate, new Date()]);
      }
      if (queryDate !== null && isDate) {
        qb.whereRaw('tracks.created_at::date = ?', newDate);
      }
      if (isLocation) {
        qb.whereRaw('event_metadata.location ->> ? = ?', ['latitude', JSON.parse(query.latitude)]);
        qb.whereRaw('event_metadata.location ->> ? = ?', ['longitude', JSON.parse(query.longitude)]);
      }
      if (isEventQuery) {
        qb.where('tracks.event_name', query.event_name);
      } else {
        return;
      }
    })
    // .where('client_id', ClientId)
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

      // console.log(data);
      // const metaData = { page, pageSize, totalData };

      // return { metaData, data };
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
export async function getMaxUsedDevices(col, table) {
  const totalDevice = await totalDataInTable(col, table);
  // const totalDevice = await SQL.totalDataInTable('MetaData', 'device');

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

  console.log('client id is ================', clientId);

  const data = await Track.forge({})
    .query(q => {
      q.select('tracks.event_name', 'em.browser', 'em.os', 'em.device')
        .count('em.user_id as total_users')
        .join('event_metadata as em', 'tracks.metadata_id', 'em.id')
        .groupBy('tracks.event_name', 'em.browser', 'em.os', 'em.device')
        .orderBy('total_users', 'DESC');

      if (eventName) {
        q.where('tracks.event_name', eventName);
      }

      console.log(q.toQuery());
    })
    .where('em.client_id', clientId)
    .fetchPage({
      pageSize,
      page,
    })
    .then(d => d)
    .catch(err => console.log(`ERROR IN FETCHING DATA ${err}`));

  return data;
}
