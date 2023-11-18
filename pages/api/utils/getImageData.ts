import createError from './createError';

export async function getImageData(imageLink, statuses, articleUrl) {
  try {
    var cloudscraper = require('cloudscraper').defaults({ encoding: null });
    const response = await cloudscraper.get(imageLink);

    return (
      'data:image/jpeg' + ';base64,' + Buffer.from(response).toString('base64')
    );
  } catch (err) {
    createError(statuses, 'cantFetchImage', articleUrl);
    console.log('GET IMAGE DATA ERROR ', err);
  }
}
