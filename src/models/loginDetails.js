import bookshelf from '../db';

const TABLE_NAME = 'user_login_details';

/**
 * LoginDetails model.
 */
class LoginDetails extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }
}

export default LoginDetails;
