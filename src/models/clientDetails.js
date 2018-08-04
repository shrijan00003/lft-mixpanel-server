import bookshelf from '../db';
import User from './user';

const TABLE_NAME = 'client_user_details';

/**
 * Client Details  model.
 */
class ClientDetails extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }

  user() {
    return this.belongsTo(User);
  }
}

export default ClientDetails;
