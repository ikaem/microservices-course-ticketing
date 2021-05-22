// client\pages\_app.js
import 'bootstrap/dist/css/bootstrap.css';
import { buildClient } from '../api/build-client';

import { Header } from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  console.log('page props', pageProps);
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const { Component, ctx } = appContext;
  const { data } = await buildClient(ctx).get('/api/users/currentuser');

  let pageProps = {};
  if (Component.getInitialProps)
    pageProps = await Component.getInitialProps(ctx);

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
