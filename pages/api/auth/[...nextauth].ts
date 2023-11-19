import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const options = {
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    Credentials({
      name: 'HTTP',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // You can replace this with your own authentication logic
        if (
          credentials.username === 'admin' &&
          credentials.password === 'password'
        ) {
          return Promise.resolve({ id: 1, username: 'admin' });
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  pages: {
    signIn: '/coolKidsOnly',
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
