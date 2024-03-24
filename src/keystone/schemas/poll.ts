import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import axios from 'axios';
import fs from 'node:fs';

import { text, image, timestamp, integer } from '@keystone-6/core/fields';

import dotenv from 'dotenv';
dotenv.config();

function buildSlug(input: string) {
  return (
    '/poll/' +
    input
      .trim()
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .substring(0, Math.min(input.length, 374))
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
        nativeType: 'Text',
        isNullable: true,
      },
      hooks: {
        resolveInput: async ({ operation, resolvedData, inputData, item }) => {
          if (!resolvedData.image_data && resolvedData.image.id) {
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
          } else if (item) {
            return item.image_data;
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

    yes_count: integer({
      defaultValue: 0,
      validation: { isRequired: true },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),

    no_count: integer({
      defaultValue: 0,
      validation: { isRequired: true },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),

    no_comment_count: integer({
      defaultValue: 0,
      validation: { isRequired: true },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),

    desh_yes_count: integer({
      defaultValue: 0,
      validation: { isRequired: false },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),

    desh_no_count: integer({
      defaultValue: 0,
      validation: { isRequired: false },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),

    desh_no_comment_count: integer({
      defaultValue: 0,
      validation: { isRequired: false },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
  },
});
