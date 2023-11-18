import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import axios from 'axios';
import fs from 'node:fs';

import { text, relationship, image, timestamp } from '@keystone-6/core/fields';

import { document } from '@keystone-6/fields-document';

import dotenv from 'dotenv';
dotenv.config();

function buildSlug(input: string) {
  return (
    '/article/' +
    input
      .trim()
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  );
}

export default list({
  access: allowAll,

  fields: {
    slug: text({
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create' && !inputData.slug) {
            return buildSlug(inputData.title);
          }
          return resolvedData.slug;
        },
      },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
      },
      db: {
        nativeType: 'VarChar(380)',
      },
      isIndexed: 'unique',
    }),
    image: image({ storage: 'my_images' }),
    image_data: text({
      db: {
        //@ts-ignore
        nativeType: 'LongText',
        isNullable: true,
      },
      hooks: {
        resolveInput: async ({ operation, resolvedData, inputData }) => {
          if (!resolvedData.image_data) {
            console.log(resolvedData.image);
            const { data } = await axios.get(
              `${process.env.BASE_URL}/images/${resolvedData.image.id}.${resolvedData.image.extension}`,
              {
                responseEncoding: 'base64',
              }
            );

            const imageBase64 =
              `data:image/${
                resolvedData.image.extension == 'jpg'
                  ? 'jpeg'
                  : resolvedData.image.extension
              }` +
              ';base64,' +
              data;

            fs.writeFile('./base64.txt', imageBase64, (err) => {
              if (err) {
                console.log(err);
              }
            });

            return imageBase64;
          }

          return null;
        },
      },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
      },
      validation: {
        isRequired: false,
      },
    }),
    title: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
    }),
    translated_date: timestamp({ validation: { isRequired: true } }),
    created_at: timestamp({
      defaultValue: { kind: 'now' },
      validation: { isRequired: true },
    }),

    content: document({
      formatting: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1],
      ],
      links: true,
      dividers: true,
    }),

    category: relationship({
      ref: 'Category.articles',
      ui: { hideCreate: false, displayMode: 'select' },
      many: false,
    }),

    recommendedArticles: relationship({
      ref: 'Article',
      ui: { hideCreate: false, displayMode: 'select' },
      many: true,
    }),
  },
});
