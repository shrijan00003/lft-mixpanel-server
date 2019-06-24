import bookshelf from '../db';

const TABLE_NAME = 'pages';

/**
 * Client Details  model.
 */
class Page extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }
}

export default Page;
