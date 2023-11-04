import styles from "../../styles/Signin.module.css";

// Icons
import { FaGoogle } from "react-icons/fa";

// Auth
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function SignIn() {
  const supabaseClient = useSupabaseClient();

  return (
    <main className={styles.main}>
      <div key="google" className={styles.container}>
        <h2>Sign In</h2>
        <p>
          Welcome to <b>Passket</b> !<br></br>Don&apos;t worry, this login is a
          secure process.
        </p>
        <button
          className={styles.signin}
          onClick={() =>
            supabaseClient.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${location.origin}/`,
                queryParams: {
                  access_type: "offline",
                  prompt: "consent",
                },
              },
            })
          }
        >
          <FaGoogle /> Authorize with Google
        </button>
      </div>
    </main>
  );
}