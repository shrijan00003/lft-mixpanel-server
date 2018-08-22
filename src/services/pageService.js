import Page from '../models/page';
import { getNewDate } from '../utils/date';

/**
 * Create new Page .
 *
 * @param  {Object}  Page Details
 * @return {Promise}
 */
export function createNewPage(metadataId, pageObj) {
  return new Page({
    metadataId,
    name: pageObj.name,
    path: pageObj.path,
    referrer: pageObj.referrer,
    search: pageObj.search,
    title: pageObj.title,
    url: pageObj.url,
    keywords: JSON.stringify(pageObj.keywords),
  })
    .save()
    .then(pageData => pageData.refresh())
    .catch(err => {
      throw err;
    });
}

export function getPagesWithMetaData(clientId = '', query = {}) {
  console.log(clientId, query);

  const sortBy = query.sort_by || 'id';
  const sortOrder = query.sort_order || 'ASC';
  const page = query.page || '1';
  const pageSize = query.page_size || '10';

  let newDate = null;
  let isDate = false;
  let queryDate = null;
  // let totalData = await Page.count();

  // finding new date

  console.log('query date at first ', query.date);
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
  //   const total = await Page.where('pages.created_at', '>', newDate)
  //     .where('pages.created_at', '<', new Date())
  //     .count();
  //   totalData = total;
  // } else if (queryDate !== null && isDate) {
  //   const total = await Page.query(q => {
  //     q.count('*').whereRaw('pages.created_at::date = ?', newDate);
  //   })
  //     .fetchAll()
  //     .then(count => count);
  //   totalData = JSON.parse(JSON.stringify(total))[0].count;
  // } else {
  //   const total = await Page.count();
  //   totalData = total;
  // }

  const response = Page.forge({})
    .query(q => {
      if (queryDate !== null && !isDate) {
        q.select('*')
          .join('event_metadata', { 'pages.metadata_id': 'event_metadata.id' })
          .whereBetween('pages.created_at', [newDate, new Date()]);
      } else if (queryDate !== null && isDate) {
        q.select('*')
          .join('event_metadata', { 'pages.metadata_id': 'event_metadata.id' })
          .whereRaw('pages.created_at::date = ?', newDate);
      } else {
        q.select('*').join('event_metadata', { 'pages.metadata_id': 'event_metadata.id' });
        console.log(q.toQuery());
      }
    })
    .where('client_id', clientId)
    .orderBy(sortBy, sortOrder)
    .fetchPage({
      pageSize,
      page,
    })
    .then(data => {
      if (!data) {
        throw {
          status: 404,
          statusMessage: 'PAGES NOT FOUND',
        };
      }

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
}

export async function getPageAnalytics(clientId = '', query = {}) {
  // const eventName = query.event_name;

  const page = query.page || '1';
  const pageSize = query.page_size || '10';

  console.log('client id is ================', clientId);

  const data = await Page.forge({})
    .query(q => {
      q.select(
        'pages.name',
        'pages.path',
        'pages.referrer',
        'pages.title',
        'pages.url',
        'em.browser',
        'em.os',
        'em.device'
      )
        .count('em.user_id as total_users')
        .join('event_metadata as em', 'pages.metadata_id', 'em.id')
        .groupBy(
          'pages.name',
          'pages.path',
          'pages.referrer',
          'pages.title',
          'pages.url',
          'em.os',
          'em.browser',
          'em.device'
        )
        .orderBy('total_users', 'DESC');

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
