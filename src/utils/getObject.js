export async function getObject(data) {
  const dataObj = await JSON.parse(JSON.stringify(data));

  return dataObj;
}
