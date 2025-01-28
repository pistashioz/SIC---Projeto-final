import "../styles/globals.css";
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '../graphql/apolloClient'
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noNavbarRoutes = ['/', '/login', '/register']; 
  const showNavbar = !noNavbarRoutes.includes(router.pathname);
  return (
    <ApolloProvider client={client}>
        {showNavbar && <Navbar />}
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
