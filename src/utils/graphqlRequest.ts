import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_HOST_URL}/api/graphql/`
);
