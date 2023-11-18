import { SessionProvider } from 'next-auth/react';


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    // <ApolloProvider client={client}>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
    // </ApolloProvider>
  );
}
