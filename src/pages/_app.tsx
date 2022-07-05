import { AppProps } from 'next/app';

import '../../styles/global.scss';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
