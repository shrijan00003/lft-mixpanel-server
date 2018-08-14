import bookshelf from '../db';

export async function totalDataInTable(modelName, colName) {
  console.log('modelname', modelName, 'colName', colName);
  const total = await bookshelf(`${modelName}`).count(`${colName}`);

  return total;
}
