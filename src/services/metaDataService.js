import MetaData from '../models/metaData';
// import { createClientId } from '../utils/jwtUtils';
import { getNewDate } from '../utils/date';
import bookshelf from '../db';
import { getObject, getAverage } from '../utils/getObject';

const knex = bookshelf.knex;
let isIncrease = false;

/**
 * Create new Meta Data .
 *
 * @param  {Object}  Client Details
 * @return {Promise}
 */
export function createMetaData(clientId = '', ipAddress = '', metaDataObj = {}) {
  return new MetaData({
    clientId,
    ipAddress,
    os: metaDataObj.os,
    device: metaDataObj.device,
    userId: metaDataObj.userId,
    browser: metaDataObj.browser,
    location: metaDataObj.location,
    userName: metaDataObj.userName,
    userEmail: metaDataObj.userEmail,
    userInfo: JSON.stringify(metaDataObj.userDetails),
  })
    .save()
    .then(metaData => metaData.refresh());
}

export async function totalDataInTable(colName) {
  const total = await MetaData.count(`${colName}`);

  return total;
}

export async function getTotalUserData(clientId = '') {
  const WEEK_DATE = getNewDate(7);
  const LAST_WEEK = getNewDate(14);
  let percent = 0;

  console.log('this week ', WEEK_DATE);
  console.log('last week ', LAST_WEEK);

  const total = await MetaData.forge({}).count('user_id');

  const byWeek = await MetaData.forge({})
    .query(q => {
      q.select(knex.raw(`date_trunc('week', created_at::date) as weekly`))
        .whereRaw('created_at > ?', LAST_WEEK)
        .count('user_id')
        .groupBy('weekly')
        .orderBy('weekly', 'DESC');

      console.log(q.toQuery());
    })
    .where('client_id', clientId)
    .fetchAll()
    .then(async data => {
      const dataObj = await getObject(data);
      const thisWeekCount = dataObj[0] ? dataObj[0].count : 0;
      const lastWeekCount = dataObj[1] ? dataObj[1].count : 0;

      if (parseInt(thisWeekCount) > parseInt(lastWeekCount)) {
        isIncrease = true;
        percent = eval(((thisWeekCount - lastWeekCount) / total) * 100);
      } else {
        isIncrease = false;
        percent = eval(((lastWeekCount - thisWeekCount) / total) * 100);
      }

      return { dataObj, thisWeekCount, isIncrease, lastWeekCount, percent };
    });

  return { total, byWeek };
}

export async function averageUser(clientId = '') {
  const TWO_DAYS = getNewDate(2);
  const dailyUser = await MetaData.forge({})
    .query(q => {
      q.select(knex.raw(`date_trunc('day',created_at::date) as daily`))
        .whereRaw('created_at > ?', TWO_DAYS)
        .count('user_id')
        .groupBy('daily')
        .orderBy('daily', 'DESC');

      console.log(q.toQuery());
    })
    .where('client_id', clientId)
    .fetchAll()
    .then(async data => {
      const dataObj = await getObject(data);
      const average = getAverage(dataObj);

      const latestUserCount = dataObj[0] ? dataObj[0].count : 0;
      const secondLatestedUserCount = dataObj[1] ? dataObj[1].count : 0;

      return { dataObj, average, latestUserCount, secondLatestedUserCount };
    });

  return { dailyUser };
}

export async function allMetaData(clientId = '') {
  const data = await MetaData.forge({})
    .query(q => {
      q.select('*')
        .groupBy('id', 'user_id')
        .orderBy('id', 'DESC');

      console.log('query to get all metadata group by user id  ', q.toQuery());
    })
    .where('client_id', clientId)
    .fetchAll()
    .then(data => data);

  return data;
}
