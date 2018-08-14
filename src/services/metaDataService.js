import MetaData from '../models/metaData';
import { createClientId } from '../utils/jwtUtils';
import { getNewDate } from '../utils/date';
import { getObject } from '../utils/getObject';

/**
 * Create new Meta Data .
 *
 * @param  {Object}  Client Details
 * @return {Promise}
 */
export function createMetaData(clientId = '', ipAddress = '', metaDataObj = {}) {
  return new MetaData({
    clientId: clientId,
    browser: metaDataObj.browser,
    os: metaDataObj.os,
    ipAddress,
    device: metaDataObj.device,
    location: metaDataObj.location,
    userId: createClientId(),
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
  let isIncrease = false;
  let percent = 0;

  console.log('this week ', WEEK_DATE);
  console.log('last week ', LAST_WEEK);

  const total = await MetaData.forge({}).count('user_id');

  const thisWeekCount = await MetaData.forge({})
    .query(q => {
      q.count('user_id').where('created_at', '>', WEEK_DATE);
      console.log('query', q.toQuery());
    })
    .fetch()
    .then(async count => {
      const countObj = await getObject(count);
      console.log(countObj);

      return countObj.count;
    });

  const lastWeekCount = await MetaData.forge({})
    .query(q => {
      q.count('user_id')
        .where('created_at', '>=', LAST_WEEK)
        .where('created_at', '<', WEEK_DATE);
      console.log(q.toQuery());
    })
    .fetch()
    .then(async count => {
      const countObj = await getObject(count);
      console.log(countObj);

      return countObj.count;
    });

  if (thisWeekCount > lastWeekCount) {
    isIncrease = true;
    percent = eval(((thisWeekCount - lastWeekCount) / total) * 100);
  } else {
    isIncrease = false;
    percent = eval(((lastWeekCount - thisWeekCount) / total) * 100);
  }

  return { total, thisWeekCount, lastWeekCount, isIncrease, percent };
}
