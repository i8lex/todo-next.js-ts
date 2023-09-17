import '@/styles/globals.css';
import { Provider } from 'react-redux';
import { wrapper } from '@/redux/store';
import React, { FC } from 'react';
import Header from '../components/Header';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

const App: FC<AppProps> = ({ Component, pageProps, ...rest }) => {
  const { store } = wrapper.useWrappedStore(rest);

  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
};

export default App;
