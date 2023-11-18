// ./apollo-client.js

import { ApolloClient, InMemoryCache } from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    uri: process.env.NEXT_KEYSTONE_GRAPHQL_URL,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
