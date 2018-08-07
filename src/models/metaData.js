import bookshelf from '../db';

const TABLE_NAME = 'event_metadata';

/**
 * Client Details  model.
 */
class MetaData extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }
}

export default MetaData;
