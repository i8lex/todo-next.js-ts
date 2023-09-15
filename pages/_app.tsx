import "@/styles/globals.css";
import { Provider } from "react-redux";
import { wrapper } from "@/redux/store";
import React, { FC } from "react";
import Header from "../components/Header";
import { AppProps } from "next/app";

const App: FC<AppProps> = ({ Component, pageProps, ...rest }) => {
  const { store } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <>
        <Header />
        <Component {...pageProps} />
      </>
    </Provider>
  );
};

export default App;
