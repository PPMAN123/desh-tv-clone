import { SessionProvider } from 'next-auth/react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const client = new ApolloClient({
    uri: process.env.NEXT_KEYSTONE_GRAPHQL_URL,
    cache: new InMemoryCache(),
  });
  return (
    // <ApolloProvider client={client}>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
    // </ApolloProvider>
  );
}
