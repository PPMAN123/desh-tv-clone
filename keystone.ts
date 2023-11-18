// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';

// to keep this file tidy, we define our schema in a different file
import { lists } from './src/keystone/schema';

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data

export default config({
  db: {
    provider: 'mysql',
    url:
      process.env.DATABASE_URL ??
      'mysql://ljuxk4qp2xuvll09n02p:pscale_pw_x3dxFxkRHAAu8En6bu6a9q4abpjepxT0KISvz2D1KKy@aws.connect.psdb.cloud/desh-tv-clone-backend?sslaccept=strict',
    additionalPrismaDatasourceProperties: {
      relationMode: 'prisma',
    },
    enableLogging: true,
    useMigrations: false,
    idField: { kind: 'autoincrement' },
  },
  ui: {
    basePath: '/admin',
  },
  lists,
  storage: {
    my_images: {
      kind: 'local',
      type: 'image',
      generateUrl: (path) => `http://localhost:3000/images${path}`,
      serverRoute: {
        path: '/images',
      },
      storagePath: 'public/images',
    },
  },
});
