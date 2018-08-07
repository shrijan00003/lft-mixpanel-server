import Boom from 'boom';
import Category from '../models/category';

/**
 * Get all Todos.
 *
 * @return {Promise}
 */
export function getAllCategories() {
  return Category.fetchAll();
}

/**
 * Get a Todo.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function getCategory(id) {
  return new Category({ id }).fetch().then(category => {
    if (!category) {
      throw new Boom.notFound('Category not found');
    }

    return category;
  });
}

/**
 * Create new Todo.
 *
 * @param  {Object}  Category
 * @return {Promise}
 */
export function createCategory(categoryParams) {
  let category = new Category({
    category_name: categoryParams.category_name,
  });

  let categoryPromise = category.save();

  categoryPromise.then(category => category.refresh());

  return categoryPromise;
}

/**
 * Update a Todo.
 *
 * @param  {Number|String}  id
 * @param  {Object}         Category
 * @return {Promise}
 */
export function updateCategory(id, category) {
  return new Category({ id })
    .save({
      updated_at: category.updated_at,
      category_name: category.category_name,
    })
    .then(category => category.refresh());
}

/**
 * Delete a Todo.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function deleteCategory(id) {
  return new Category({ id }).fetch().then(category => category.destroy());
}
