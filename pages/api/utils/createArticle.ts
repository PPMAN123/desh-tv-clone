import { getRecommendedArticles } from './recommendedArticles';
import { createRecommendedArticles } from './createRecommendedArticles';
import moment from 'moment';
import createError from './createError';
import { ErrorStage, ErrorType } from '../enums';

const fs = require('fs');

export async function createArticle(
  articleSlug,
  imageData,
  title,
  categoryName,
  translatedDate,
  paragraphs,
  recommendedArticleSlugs,
  requireCreateRecommendedArticles,
  prisma,
  articleUrl,
  statuses
) {
  let status = 400;
  let data;
  try {
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (category) {
      const categoryId = category.id;
      const paragraphsText =
        '[' +
        Object.keys(paragraphs).reduce((paragraphsString, key, i) => {
          if (i == 0) {
            return (
              '{"type":"paragraph","children":[' +
              paragraphs[key].reduce((contentChildren, content, i) => {
                if (i == 0) {
                  if (content.type == 'text') {
                    return `{"text": "${content.content}"}`;
                  } else if (content.type == 'link') {
                    return `{"href": "${content.href}", "type": "link", "children": [{"text": ${content.content}}]}`;
                  }
                } else {
                  if (content.type == 'text') {
                    return contentChildren + `, {"text": "${content.content}"}`;
                  } else if (content.type == 'link') {
                    return (
                      contentChildren +
                      `, {"href": "${content.href}", "type": "link", "children": [{"text": ${content.content}}]}`
                    );
                  }
                }
              }, '') +
              ']}'
            );
          } else {
            return (
              paragraphsString +
              ', {"type":"paragraph","children":[' +
              paragraphs[key].reduce((contentChildren, content, i) => {
                if (i == 0) {
                  if (content.type == 'text') {
                    return `{"text": "${content.content}"}`;
                  } else if (content.type == 'link') {
                    return `{"href": "${content.href}", "type": "link", "children": [{"text": ${content.content}}]}`;
                  }
                } else {
                  if (content.type == 'text') {
                    return contentChildren + `, {"text": "${content.content}"}`;
                  } else if (content.type == 'link') {
                    return (
                      contentChildren +
                      `, {"href": "${content.href}", "type": "link", "children": [{"text": ${content.content}}]}`
                    );
                  }
                }
              }, '') +
              ']}'
            );
          }
        }, '') +
        ']';
      // console.log('PARAGRAPHS TEXT', paragraphsText);
      // const paragraphsText = JSON.stringify(paragraphs).replaceAll("'", '&#39;');
      moment.locale();
      // console.log(moment(translatedDate).format('YYYY-MM-DD kk:mm:ss.SSS'));
      // const insertArticleSql = `INSERT INTO Article(slug,image_data,title,category,translated_date,content) VALUES('${articleSlug}','${imageData}','${title}',${categoryId}, '${moment(
      //   translatedDate
      // ).format('YYYY-MM-DD kk:mm:ss.SSS')}', '${paragraphsText}')`;

      const insertArticle = await prisma.article.create({
        data: {
          slug: articleSlug,
          image_data: imageData,
          title: title,
          categoryId: categoryId,
          // translated_date: moment(translatedDate).format(
          //   'YYYY-MM-DD kk:mm:ss.SSS'
          // ),
          translated_date: new Date(translatedDate),
          content: paragraphsText,
        },
      });

      // await connection.execute(insertArticleSql);
      statuses.completed++;

      status = 200;
    } else {
      createError(
        statuses,
        ErrorType.InexistentCategory,
        articleUrl,
        ErrorStage.Creation
      );
    }
  } catch (err) {
    status = 400;
    if (JSON.stringify(err).includes('P2002')) {
      fs.appendFile(
        './tmp/dupes.txt',
        '\n' + JSON.stringify(err),
        function (err) {
          createError(
            statuses,
            ErrorType.DuplicatedArticle,
            articleUrl,
            ErrorStage.Creation
          );
          console.log('New dupe error message has been updated');
        }
      );
    } else {
      fs.appendFile('./tmp/test.txt', JSON.stringify(err), function (err) {
        if (err) {
          return console.log('ERROR', err);
        }
        createError(
          statuses,
          ErrorType.GeneralCantCreate,
          articleUrl,
          ErrorStage.Creation
        );
        console.log('The file was saved!');
      });
    }
  }

  return {
    status,
    data,
  };
}
