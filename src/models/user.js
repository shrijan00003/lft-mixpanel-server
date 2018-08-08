import bookshelf from '../db';
import LoginDetails from './loginDetails';
import ClientDetails from './clientDetails';

const TABLE_NAME = 'users';

/**
 * User model.
 */
class User extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }

  clientDetails() {
    return this.hasMany(ClientDetails);
  }

  hasLoginDetails() {
    return this.hasMany(LoginDetails);
  }
}

export default User;
