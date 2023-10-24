// NextJS stuff
import Head from 'next/head';

const MetaTags: React.FC = () => {
  return (
    <>
      <Head>
        <title>Passket</title>
        <meta name="title" content="Passket" />
        <meta
          name="description"
          content="A Secure yet Transparent way to store your password. Uses AES256 algorithm to encrypt"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://passket.vercel.app" />
        <meta property="og:title" content="Passket" />
        <meta property="og:color" content="#FFC633" />
        <meta name="theme-color" content="#FFC633" />
        <meta
          property="og:description"
          content="A Secure yet Transparent way to store your password. Uses AES256 algorithm to encrypt"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://passket.vercel.app" />
        <meta property="twitter:title" content="Passket" />
        <meta
          property="twitter:description"
          content="A Secure yet Transparent way to store your password. Uses AES256 algorithm to encrypt"
        />

        <link key="icon" rel="icon" href="/favicon.svg" />
      </Head>
    </>
  );
};

export default MetaTags;
