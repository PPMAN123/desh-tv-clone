import axios from 'axios';
import * as cheerio from 'cheerio';
import request from '../utils/request';

type fetchImageLinkTypes = {
  articleUrl: string;
};

const fetchImageLink = async ({ articleUrl }: fetchImageLinkTypes) => {
  let encodedUrl;
  if (!articleUrl.startsWith('https://desh.tv/')) {
    encodedUrl = encodeURI(articleUrl);
  } else {
    encodedUrl = encodeURI(articleUrl.substring(16));
  }

  const { data } = await request.get(
    `http://localhost:3000/data/desh-tv/${encodedUrl}/`
  );

  const dom = cheerio.load(data);
  const imageLink = dom('figure > img')[0].attribs['data-air-img'];
  return imageLink;
};

export default fetchImageLink;
