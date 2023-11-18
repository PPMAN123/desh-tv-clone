import axios from 'axios';
import * as cheerio from 'cheerio';
import createError from './createError';

export async function fetchImageLink({ articleUrl, statuses }) {
  let encodedUrl;
  if (!articleUrl.startsWith('https://www.desh.tv/')) {
    encodedUrl = encodeURI(articleUrl);
  } else {
    encodedUrl = encodeURI(articleUrl.substring(20));
  }

  try {
    const { data } = await axios.get(`/data/desh-tv/${encodedUrl}/`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    });

    const dom = cheerio.load(data);
    let imageLink;
    imageLink =
      'https://www.desh.tv' + dom('.dtl_img_section .img img').attr('src');
    return imageLink;
  } catch (err) {
    createError(statuses, 'cantFetchImageLink', articleUrl);
    console.log('fetch image error', err);
  }
}
