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
    userInfo: JSON.stringify(metaDataObj.userInfo),
  })
    .save()
    .then(metaData => metaData.refresh());
}

export async function totalDataInTable(colName) {
  const total = await MetaData.count(`${colName}`);

  return total;
}

export async function getTotalUserData() {
  const WEEK_DATE = getNewDate(7);
  const LAST_WEEK = getNewDate(14);
  let percent = 0;

  console.log('this week ', WEEK_DATE);
  console.log('last week ', LAST_WEEK);

  const total = await MetaData.forge({}).count('user_id');

  const byWeek = await MetaData.forge({})
    .query(q => {
      q.select(knex.raw(`date_trunc('week', created_at::date) as weekly`))
        .count('user_id')
        .groupBy('weekly')
        .orderBy('weekly', 'DESC');

      console.log(q.toQuery());
    })
    .fetchAll()
    .then(async data => {
      const dataObj = await getObject(data);
      console.log(dataObj);
      const thisWeekCount = dataObj[0].count;
      const lastWeekCount = dataObj[1].count;

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

export async function averageUser() {
  const dailyUser = await MetaData.forge({})
    .query(q => {
      q.select(knex.raw(`date_trunc('day',created_at::date) as daily`))
        .count('user_id')
        .groupBy('daily')
        .orderBy('daily', 'DESC');
    })
    .fetchAll()
    .then(async data => {
      const dataObj = await getObject(data);
      const average = getAverage(dataObj);

      const latestUserCount = dataObj[0].count;
      const secondLatestedUserCount = dataObj[1].count;

      return { dataObj, average, latestUserCount, secondLatestedUserCount };
    });

  return { dailyUser };
}
