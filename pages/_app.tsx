// NextJS Stuff
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';

// Fonts
import { Space_Grotesk } from 'next/font/google';
const sg = Space_Grotesk({
  weight: ['500', '700'],
  display: 'swap',
  style: ['normal'],
  subsets: ['latin'],
  variable: '--root-font',
});

import '../styles/mobile.css';
import '../styles/globals.css'

import MetaTags from '../components/MetaTags';

// Auth
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {

  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}>
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
      </SessionContextProvider>
    </>
  );
}

export default MyApp;