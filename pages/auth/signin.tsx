import styles from '../../styles/Signin.module.css';

// Icons
import { FaGoogle } from 'react-icons/fa';

// Auth
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SignIn() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if(user) router.push('/');
  }, []);

  return (
    <main className={styles.main}>
      <div key="google" className={styles.container}>
        <div className={styles.login}>
          <div className={styles.lefty}>
            <div className={styles.titles}>
              <div className={styles.name}>
                <h1>Passket</h1>
              </div>
              <p>
                A Secure yet Transparent way to store your password locked
                behind a 4-digit pin
              </p>
            </div>
          </div>

          <div className={styles.inputs}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button
                className={styles.signin}
                onClick={() =>
                  supabaseClient.auth.signInWithOAuth({
                    provider: 'google',

                    options: {
                      redirectTo: `${location.origin}/auth/callback`,
                    },
                  })
                }>
                <FaGoogle /> Authorize with Google
              </button>
            </div>
          </div>
          <p className={styles.credits}>
            Made by <a href="https://marban.is-a.dev">Marban</a> and{' '}
            <a href="https://www.linkedin.com/in/harshan-am">Harshan</a>
          </p>
        </div>
      </div>
    </main>
  );
}
