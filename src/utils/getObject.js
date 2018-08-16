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
