import moment from 'moment';
import createError from './createError';
import { ErrorStage, ErrorType } from '../enums';

const fs = require('fs');

export async function createPoll(
  slug,
  imageData,
  title,
  translatedDate,
  voteCount,
  prisma,
  statuses
) {
  let status = 400;
  let data;
  try {
    moment.locale();

    // const upsertPollSql = `INSERT INTO Poll(slug, image_data, title, translated_date,desh_yes_count, desh_no_count, desh_no_comment_count) VALUES('${slug}', '${imageData}','${title}','${moment(
    //   translatedDate
    // ).format('YYYY-MM-DD kk:mm:ss.SSS')}',${voteCount.yes},${voteCount.no},${
    //   voteCount['no-comment']
    // }) ON DUPLICATE KEY UPDATE desh_yes_count = VALUES(desh_yes_count),desh_no_count = VALUES(desh_no_count),desh_no_comment_count = VALUES(desh_no_comment_count);
    // `;

    const upsertPoll = await prisma.poll.upsert({
      where: { slug: slug },
      update: {
        desh_yes_count: voteCount.yes,
        desh_no_count: voteCount.no,
        desh_no_comment_count: voteCount['no-comment'],
      },
      create: {
        slug: slug,
        image_data: imageData,
        title: title,
        translated_date: new Date(translatedDate),
        desh_yes_count: voteCount.yes,
        desh_no_count: voteCount.no,
        desh_no_comment_count: voteCount['no-comment'],
      },
    });

    statuses.completed++;

    status = 200;
  } catch (err) {
    status = 400;
    console.log(err);
    if (err.message.includes('errno 1062')) {
      fs.appendFile('./tmp/dupes.txt', '\n' + err.message, function (err) {
        if (err) {
          return console.log(err);
        }

        console.log('New dupe error message has been updated');
      });
    } else {
      fs.appendFile('./tmp/test.txt', JSON.stringify(err), function (err) {
        if (err) {
          return console.log('ERROR', err);
        }

        console.log('The file was saved!');
      });
    }
  }
  return {
    status,
    data,
  };
}
