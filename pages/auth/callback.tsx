import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useInsertionEffect } from 'react';

export default function Callback() {
  const router = useRouter();
  const user = useUser();

  useInsertionEffect(() => {
    if (user) router.push('/');

    const timeout = setTimeout(() => {
      if (!user) router.push('/auth/signin');
    }, 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        flexDirection: 'column',
        gap: 12,
      }}>
      <h2>Loading</h2>
    </main>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  else
    return {
      props: {},
    };
};
