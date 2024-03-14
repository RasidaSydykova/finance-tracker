import React from 'react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import Toolbar from '@/components/UI/Toolbar/Toolbar';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer />
      <Toolbar />
      <Component {...pageProps} />
    </>
  );
}
