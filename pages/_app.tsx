import "@/styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store, wrapper } from "../redux/store";
import { Header } from "../components/Header";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    // <Provider store={store}>
    <>
      <Header />
      <Component {...pageProps} />
    </>
    // </Provider>
  );
};

export default wrapper.withRedux(App);
