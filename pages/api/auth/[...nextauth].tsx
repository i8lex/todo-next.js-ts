/* eslint-disable @typescript-eslint/ban-ts-comment */
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'text',
          placeholder: 'email@gmail.com',
        },
        password: { label: 'Password', type: 'text' },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        if (!email || !password) {
          throw new Error(
            JSON.stringify({
              error: 'Email or password is empty',
              status: false,
            }),
          );
        }

        const response = await fetch('http://192.168.1.9:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        const user = await response.json();
        if (response.ok && user) {
          return user;
        }

        return Promise.reject(new Error(user.error));
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.SECRET_WORD,
  callbacks: {
    jwt({ token, user, account }) {
      if (account) {
        token.name = user.id;
      }
      if (user) {
        // @ts-ignore
        token.token = user?.token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // @ts-ignore
      session.user.token = token.token;
      console.log();

      return session;
    },
  },
};

export default NextAuth(authOptions);
