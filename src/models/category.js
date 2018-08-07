import bookshelf from '../db';
import Todo from './todo';

const TABLE_NAME = 'categories';

class Category extends bookshelf.Model {
  todos() {
    return this.belongsToMany(Todo);
  }
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }
}

export default Category;
