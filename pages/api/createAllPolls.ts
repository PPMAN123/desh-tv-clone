import * as cheerio from 'cheerio';
import axios from 'axios';
import _, { attempt } from 'lodash';
import createError from './utils/createError';
import { ErrorStage, ErrorType } from './enums';
import moment from 'moment';
import { getImageData } from './utils/getImageData';

const mysql = require('mysql2/promise');
require('dotenv').config();

export default async function handler(req, res) {
  let data, connection;
  const statuses = {
    completed: 0,
    attempts: 0,
    fetchingErrors: 0,
    creationErrors: 0,
    errors: {
      // Reason: count
    },
  };

  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    ({ data } = await axios.get(req.body.pageUrl, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    }));
  } catch (err) {
    console.log(
      'CANNOT GAIN CONNECTION TO BACKEND / CANNOT REACH DESH.TV',
      err
    );
    return res.status(400);
  }
  // console.log('page data', data);
  try {
    const dom = cheerio.load(data);
    const dates = dom('.poll_time.mb-2');

    const StyledDates = dates.map((i, date) => {
      const styledDate = date.children[2].data
        .replaceAll('\n', '')
        .replaceAll(' ', '')
        .trim();

      moment.locale('bn');
      moment().utcOffset(6);
      const convertedDate = moment(styledDate, 'DDMMMMYYYY,HH:mm');
      moment.locale('en');

      return moment(convertedDate).valueOf();
    });

    const images = dom('.imgWrep > img');

    const imageDataPromises = images.map(async (i, image) => {
      if (i % 2 == 0) {
        const imageLink = image.attribs.src;
        const data = await getImageData(imageLink, statuses, '');

        return data;
      }
    });

    const imageData = await Promise.all(imageDataPromises);

    connection.end();

    // console.log('CREATE ARTICLE STATUS', createArticleStatuses);
    res.status(200).json({ statuses });
  } catch (error) {
    console.log('WE FOUND WHERE THE ERROR MIGHT BE', error);
    connection.end();
    res.status(400);
  }
}
