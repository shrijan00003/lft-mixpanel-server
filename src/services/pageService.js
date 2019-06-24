import bookshelf from '../db';
import Page from '../models/page';
import { getNewDate } from '../utils/date';

const KNEX = bookshelf.knex;

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
  let isPageQuery = false;

  // let totalData = await Page.count();

  // finding new date

  if (query.page_name) {
    isPageQuery = true;
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

  /**
   *
   */
  const response = Page.forge({})

    .query(qb => {
      qb.select(
        'pages.id as pages_id',
        'em.id as metadata_id',
        'pages.name',
        'pages.title',
        'pages.referrer',
        'pages.path',

        'pages.url',
        'pages.created_at'
      ).join('event_metadata as em', 'pages.metadata_id', 'em.id');
      if (queryDate !== null && !isDate) {
        qb.whereBetween('pages.created_at', [newDate, new Date()]);
      }
      if (queryDate !== null && isDate) {
        qb.whereRaw('pages.created_at::date = ?', newDate);
      }

      if (isPageQuery) {
        qb.where('pages.name', 'iLIKE', `%${query.page_name}%`);
      } else {
        return;
      }
    })
    .where('em.client_id', clientId)
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

  //   .query(q => {
  //     if (queryDate !== null && !isDate && !isPageQuery) {
  //       q.select('*')
  //         .join('event_metadata', { 'pages.metadata_id': 'event_metadata.id' })
  //         .whereBetween('pages.created_at', [newDate, new Date()]);
  //     } else if (queryDate !== null && isDate) {
  //       q.select('*')
  //         .join('event_metadata', { 'pages.metadata_id': 'event_metadata.id' })
  //         .whereRaw('pages.created_at::date = ?', newDate);
  //       console.log(q.toQuery());
  //     }
  //     if (isPageQuery) {
  //       q.select('*')
  //         .join('event_metadata', { 'pages.metadata_id': 'event_metadata.id' })
  //         .where('pages.name', 'iLIKE', `%${query.page_name}%`);
  //       // q.where('pages.page_name', 'iLIKE', `%${query.page_name}%`);
  //     } else {
  //       q.select('*').join('event_metadata', {
  //         'pages.metadata_id': 'event_metadata.id',
  //       });
  //       // console.log(q.toQuery());
  //     }
  //   })
  //   .where('client_id', clientId)
  //   .orderBy(sortBy, sortOrder)
  //   .fetchPage({
  //     pageSize,
  //     page,
  //   })
  //   .then(data => {
  //     if (!data) {
  //       throw {
  //         status: 404,
  //         statusMessage: 'PAGES NOT FOUND',
  //       };
  //     }

  //     return data;
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     throw {
  //       status: 403,
  //       statusMessage: 'ERROR OCCURED WHILE FETCHING DATA',
  //     };
  //   });

  // return response;
}

/**
 *
 */
export async function getPageAnalytics(clientId = '', query = {}) {
  const col = query.getBy || 'path';

  const page = query.page || '1';
  const pageSize = query.page_size || '5';

  const result = await Page.forge()
    .query(q => {
      q.select(
        KNEX.raw(
          `pages.${col}, max(em.browser) as max_browser, max(em.os) as max_os, max(em.device) as max_device, count(em.user_id) as total_user`
        )
      )
        .join('event_metadata as em', 'pages.metadata_id', 'em.id')
        .orderBy('total_user', 'DESC')
        .groupBy(`pages.${col}`);
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
