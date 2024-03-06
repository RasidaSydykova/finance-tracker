import type { AppProps } from 'next/app';
import Toolbar from '@/UI/Toolbar/Toolbar';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toolbar />
      <Component {...pageProps} />
    </>
  );
}
