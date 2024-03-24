import * as cheerio from 'cheerio';
import axios from 'axios';
import _ from 'lodash';
import createError from './utils/createError';
import { ErrorStage, ErrorType } from './enums';
import moment from 'moment';
import { getImageData } from './utils/getImageData';
import { getTranslationText } from 'lingva-scraper';
import { createPoll } from './utils/createPoll';
import { PrismaClient } from '@prisma/client';

require('dotenv').config();

export default async function handler(req, res) {
  let data, connection;
  const prisma = new PrismaClient();
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
    await prisma.$connect();
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

    const styledDates = dates.map((i, date) => {
      const styledDate = dom(date)
        .text()
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

      return null;
    });

    let imageData = await Promise.all(imageDataPromises);

    imageData = imageData.filter((imageData) => imageData);

    const titles = dom('a > p');

    const translatedTitlePromises = titles.map(async (i, title) => {
      if (i % 2 == 0) {
        let translatedTitle = await getTranslationText(
          'bn',
          'en',
          dom(title).text()
        );

        return translatedTitle
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#39;');
      }

      return null;
    });

    let translatedTitles = await Promise.all(translatedTitlePromises);

    translatedTitles = translatedTitles.filter(
      (translatedTitle) => translatedTitle
    );

    const voteElements = dom('.total-vote');

    const totalVotesPromises = [];

    voteElements.map((i, votes) => {
      if (i % 2 == 0) {
        if (dom(votes).text()) {
          const voteElementsPromise = new Promise((resolve, reject) => {
            getTranslationText('bn', 'en', dom(votes).text())
              .then((data) => {
                resolve(data);
              })
              .catch((err) => {
                reject(err);
              });
          });

          totalVotesPromises.push(voteElementsPromise);
        }
      }
    });

    let totalVotesData = await Promise.all(totalVotesPromises);

    totalVotesData = totalVotesData
      .map((totalVotes) => Number(totalVotes.replace(/[^0-9]/g, '')))
      .filter((votes) => votes == 0 || votes);

    const voteCountElements = dom('.votes');

    const voteCountsDataPromises = voteCountElements.map(
      async (i, voteCountElement) => {
        if (dom(voteCountElement).text()) {
          return (
            Number(
              (
                await getTranslationText(
                  'bn',
                  'en',
                  dom(voteCountElement).text()
                )
              ).replace(/[^0-9]/g, '')
            ) / 100
          );
        }
      }
    );

    const voteCountPercentages = await Promise.all(voteCountsDataPromises);

    const voteCounts = voteCountPercentages.reduce(
      (acc, voteCountPercentage, i) => {
        const groupIndex = Math.floor(i / 6);

        switch (i % 6) {
          case 3: {
            acc[groupIndex] = {
              yes: Math.round(
                (totalVotesData[groupIndex] * voteCountPercentage) / 100
              ),
            };

            return acc;
          }

          case 4: {
            acc[groupIndex] = {
              ...acc[groupIndex],
              no: Math.round(
                (totalVotesData[groupIndex] * voteCountPercentage) / 100
              ),
            };
          }

          case 5: {
            acc[groupIndex] = {
              ...acc[groupIndex],
              'no-comment': Math.round(
                (totalVotesData[groupIndex] * voteCountPercentage) / 100
              ),
            };
          }

          default: {
            return acc;
          }
        }
      },
      [{}]
    );

    let pollSlugs = dom('.poll_block > a').map((i, anchorElement) => {
      if (i % 2 == 0) {
        return (
          '/polls' +
          anchorElement.attribs.href.substring(
            anchorElement.attribs.href.lastIndexOf('/')
          )
        );
      }
    });

    // [n, n, n, 10%, 80%, 10%, n, n, n, 100%, 0%, 0%]
    // [{yes: 10%, no: 80%, noComment: 10%}, {yes: 100%, no: 0%, noComment, 0%}]

    // const createPollData = {
    //   translatedDates: styledDates,
    //   imageData,
    //   translatedTitles,
    //   totalVotesData,
    //   voteCounts,
    // };

    const createPollPromises = [];

    styledDates.map((i, date) => {
      const createPollPromise = new Promise((resolve, reject) => {
        createPoll(
          pollSlugs[i],
          imageData[i],
          translatedTitles[i],
          styledDates[i],
          voteCounts[i],
          prisma,
          statuses
        )
          .then((data) => {
            console.log('YIPPEEEE');
            resolve(data);
          })
          .catch((err) => resolve(err));
      });

      createPollPromises.push(createPollPromise);
    });

    await Promise.all(createPollPromises);

    await prisma.$disconnect();
    // console.log('CREATE ARTICLE STATUS', createArticleStatuses);
    res.status(200).json({ statuses });
  } catch (error) {
    console.log('WE FOUND WHERE THE ERROR MIGHT BE', error);

    await prisma.$disconnect();
    res.status(400);
  }
}
