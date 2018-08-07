import bookshelf from '../db';

const TABLE_NAME = 'tracks';

/**
 * Client Details  model.
 */
class Track extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }
}

export default Track;
