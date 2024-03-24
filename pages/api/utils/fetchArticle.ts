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
import { ErrorStage, ErrorType } from '../enums';

export async function fetchArticle(articleUrl, statuses) {
  try {
    const { data } = await axios.get(articleUrl, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    });

    let areParagraphsProblematic = false;
    const dom = cheerio.load(data);
    // let date = dom(
    //   '.rpt_info_section > .entry_update'
    //   //@ts-ignore
    // )[0].children[0].next.data.trim(); // Object
    let date: any = dom('.rpt_info_section > .entry_update');

    date = dom(date).text();
    moment.locale('bn');
    date = moment(date, 'DD MMMM YYYY, HH:mm | GMT ZZ');
    moment.locale('en');
    date = moment(date).valueOf();

    const title = dom('h1').text().trim();
    const articleParagraphs = dom('.dtl_content_section > p');
    // const recommendedArticleSlugsAnchors = dom(
    //   '.col-md-12 > .row > div > div > a'
    // );

    const articleSlug = '/article' + articleUrl.substring(19);

    console.log('ARTICLE SLUG', articleSlug);

    let categoryName = articleSlug.substring(9);

    categoryName = categoryName.substring(0, categoryName.indexOf('/'));

    console.log('ARTICLE CATEGORY', categoryName);

    let translatedTitle = await getTranslationText('bn', 'en', title);
    translatedTitle = translatedTitle
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

    const translatedParagraphPromises = [];

    articleParagraphs.each((i, element) => {
      let childIndex = -1;

      if (element && element.children) {
        childIndex = element.children.reduce((acc, child, i) => {
          //@ts-ignore
          if (child.data) {
            return i;
          }
          return acc;
        }, -1);
      }

      if (childIndex != -1) {
        const encodedQuery = encodeURIComponent(
          //@ts-ignore
          element.children[childIndex].data
        );
        if (encodedQuery.length < 7500) {
          translatedParagraphPromises.push(
            //@ts-ignore
            fetchParagraph(element.children[childIndex].data, i, 'text')
          );
        } else {
          //@ts-ignore
          const sentences = element.children[childIndex].data.split(',');
          sentences.forEach((sentence) => {
            translatedParagraphPromises.push(
              fetchParagraph(sentence, i, 'text')
            );
          });
        }
      } else {
        areParagraphsProblematic = true;
      }
    });

    if (areParagraphsProblematic) {
      createError(
        statuses,
        ErrorType.ProblematicParagraphs,
        articleUrl,
        ErrorStage.Fetching
      );
    }

    let translatedParagraphs = await Promise.all(translatedParagraphPromises);

    const paragraphsMap = translatedParagraphs.reduce(
      (acc, translatedParagraph) => {
        if (
          !Object.keys(acc).includes(
            _.toString(translatedParagraph.paragraphNumber)
          )
        ) {
          // If current translated paragraph is not already in acc
          let returnValue;
          if (translatedParagraph.type == 'text') {
            returnValue = {
              [translatedParagraph.paragraphNumber]: [
                {
                  type: 'text',
                  content: translatedParagraph.translatedParagraph
                    ? translatedParagraph.translatedParagraph
                        .replaceAll('"', '&quot;')
                        .replaceAll("'", '&#39;')
                    : translatedParagraph.translatedParagraph,
                },
              ],
            };
          } else if (translatedParagraph.type == 'link') {
            returnValue = {
              [translatedParagraph.paragraphNumber]: [
                {
                  type: 'link',
                  href: translatedParagraph.href,
                  content: translatedParagraph.translatedParagraph
                    ? translatedParagraph.translatedParagraph
                        .replaceAll('"', '&quot;')
                        .replaceAll("'", '&#39;')
                    : translatedParagraph.translatedParagraph,
                },
              ],
            };
          }
          return {
            ...acc,
            ...returnValue,
          };
        } else {
          // If current translated paragraph is in acc
          // Add to content of paragraph piece
          if (translatedParagraph.type == 'text') {
            acc[translatedParagraph.paragraphNumber].push({
              type: 'text',
              content: `, ${translatedParagraph.translatedParagraph}`
                .replaceAll('"', '&quot;')
                .replaceAll("'", '&#39;'),
            });
          } else if (translatedParagraph.type == 'link') {
            acc[translatedParagraph.paragraphNumber].push({
              type: 'link',
              href: translatedParagraph.href,
              content: translatedParagraph.translatedParagraph
                ? translatedParagraph.translatedParagraph
                    .replaceAll('"', '&quot;')
                    .replaceAll("'", '&#39;')
                : translatedParagraph.translatedParagraph,
            });
          }
          return acc;
        }
      },
      {}
    );

    const recommendedArticleSlugs = [];
    // recommendedArticleSlugsAnchors.each((i, element) => {
    //   recommendedArticleSlugs.push(
    //     encodeURI('/article' + element.attribs.href.substring(15))
    //   );
    // });

    const articleImageLink = await fetchImageLink({ articleUrl, statuses });
    const articleImageData = await getImageData(
      articleImageLink,
      statuses,
      articleUrl
    );

    const returnValue = {
      articleSlug,
      translatedDate: date,
      categoryName,
      translatedTitle,
      translatedParagraphs: Object.values(paragraphsMap),
      articleImageData,
      recommendedArticleSlugs,
      status: 200,
      articleUrl,
    };

    Object.keys(returnValue).forEach((key) => {
      if (!returnValue[key]) {
        console.log('Error:', articleUrl, key);
        createError(
          statuses,
          ErrorType.MissingData,
          articleUrl,
          ErrorStage.Fetching
        );
      }
    });

    return returnValue;
  } catch (err) {
    createError(
      statuses,
      ErrorType.GeneralCantFetch,
      articleUrl,
      ErrorStage.Fetching
    );
    console.log('ERROR: PAGE CANNOT BE FETCHED', err, articleUrl);
    return { status: 400 };
  }
}
