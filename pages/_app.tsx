// import "@/styles/globals.css";
// import React, { FC } from "react";
// import type { AppProps } from "next/app";
// import {persistor, wrapper} from "../redux/store";
// import Header from "../components/Header";
// import {PersistGate} from "redux-persist/integration/react";
//
// const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => (
//
//     <PersistGate persistor={persistor} loading={null}>
//         <>
//             <Header />
//             <Component {...pageProps} />
//         </>
//     </PersistGate>
//
// );
// export default wrapper.withRedux(WrappedApp);

import "@/styles/globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { createWrapper } from "next-redux-wrapper";
import { store } from "../redux/store";
import { persistStore } from "redux-persist";
import React from "react";
import Header from "../components/Header";

const App = ({ Component, pageProps }) => {
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <>
          <Header />
          <Component {...pageProps} />
        </>
      </PersistGate>
    </Provider>
  );
};

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(App);
