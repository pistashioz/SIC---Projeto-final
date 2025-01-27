import "../styles/globals.css";
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '../graphql/apolloClient'
export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
