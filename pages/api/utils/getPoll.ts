import axios from 'axios';
import { getTranslationText } from 'lingva-scraper';
import * as cheerio from 'cheerio';
import { fetchImageLink } from './fetchImageLink';
import { getImageData } from './getImageData';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/bn';
import fetchParagraph from './fetchParagraph';
import createError from './createError';

export async function fetchArticle(articleUrl, statuses) {
  try {
    const { data } = await axios.get(articleUrl, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    });

    console.log(data);
  } catch (err) {
    console.log('ERROR: PAGE CANNOT BE FETCHED', err, articleUrl);
    return { status: 400 };
  }
}
