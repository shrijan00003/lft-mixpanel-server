import Page from '../models/page';
/**
 * Create new Page .
 *
 * @param  {Object}  Page Details
 * @return {Promise}
 */
export function createNewPage(metadataId, pageObj) {
  return new Page({
    metadataId,
    name: pageObj.name,
    path: pageObj.path,
    referrer: pageObj.referrer,
    search: pageObj.search,
    title: pageObj.title,
    url: pageObj.url,
    keywords: JSON.stringify(pageObj.keywords),
  })
    .save()
    .then(pageData => pageData.refresh())
    .catch(err => {
      throw err;
    });
}
