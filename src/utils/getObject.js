import _ from 'lodash';
export async function getObject(data) {
  const dataObj = await JSON.parse(JSON.stringify(data));

  return dataObj;
}

// get average from the array of object data
export function getAverage(obj) {
  const average = obj.reduce((total, user, index, array) => {
    total += parseInt(user.count);
    if (index === array.length - 1) {
      return total / array.length;
    } else {
      return total;
    }
  }, 0);

  return average;
}

// check if empty using lodash

export function isEmpty(param) {
  return _.isEmpty(param);
}

// check if includes

export function isIncludes(collection, values) {
  return _.includes(collection, values);
}
