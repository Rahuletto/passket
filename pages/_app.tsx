// NextJS Stuff
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';

// Fonts
import { Space_Grotesk } from 'next/font/google';
const sg = Space_Grotesk({
  fallback: ['system-ui', 'arial'],
  weight: ['500', '700'],
  display: 'swap',
  style: ['normal'],
  subsets: ['latin'],
  variable: '--root-font',
});

import '../styles/globals.css';
import '../styles/mobile.css';
import MetaTags from '../components/MetaTags';


function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {

  return (
    <>
      <MetaTags />
      <style jsx global>
        {`
            html {
              --root-font: ${sg.style.fontFamily};=
            }
          `}
      </style>

      <Component className={sg.variable} {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;