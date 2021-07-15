// client\pages\_app.js
import 'bootstrap/dist/css/bootstrap.css';
import { buildClient } from '../api/build-client';

import { Header } from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  console.log('page props', pageProps);
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  console.log('starting up');

  const { Component, ctx } = appContext;
  const client = buildClient(ctx);

  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (Component.getInitialProps)
    pageProps = await Component.getInitialProps(ctx, client, data.currentUser);

  console.log({ pageProps });

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
