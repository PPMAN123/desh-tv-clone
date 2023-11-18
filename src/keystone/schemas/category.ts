import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

import {
  text,
  relationship,
  integer,
} from '@keystone-6/core/fields';

export default list({
  // WARNING
  //   for this starter project, anyone can create, query, update and delete anything
  //   if you want to prevent random people on the internet from accessing your data,
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  access: allowAll,

  // this is the fields for our Post list
  fields: {
    name: text({validation: {isRequired: true}}),
    slug: text({validation: {isRequired: true}}),

    // with this field, you can set a User as the author for a Post
    articles: relationship({
      // we could have used 'User', but then the relationship would only be 1-way
      ref: 'Article.category',

      // this is some customisations for changing how this will look in the AdminUI
      ui: { hideCreate: false, displayMode: 'select' },

      // a Post can only have one author
      //   this is the default, but we show it here for verbosity
      many: true,
    }),
  },
})