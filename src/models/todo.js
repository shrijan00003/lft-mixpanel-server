import bookshelf from '../db';
import Category from './category';
import User from './user';

const TABLE_NAME = 'todos';

class Todo extends bookshelf.Model {
  /**
   * @desc single user may have multiple todos
   */
  user() {
    return this.belongsTo(User);
  }

  categories() {
    return this.belongsToMany(Category);
  }

  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }
}

export default Todo;
