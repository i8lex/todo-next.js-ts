/* eslint-disable @typescript-eslint/ban-ts-comment */
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import * as process from 'process';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
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
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        const user = await response.json();
        if (user.isConfirmed) {
          return user;
        }

        return Promise.reject(new Error(user.message));
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
        token.name = user?.name;
        // @ts-ignore
        token.sub = user?._id;
        token.email = user?.email;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.token = token.token;
      // @ts-ignore
      session.user.name = token.name;
      // @ts-ignore
      session.user.id = token.sub;
      // @ts-ignore
      session.user.email = token.email;
      return session;
    },
  },
};

export default NextAuth(authOptions);
