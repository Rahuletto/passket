import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className={styles.main}>
      <div className={styles.container}>

        <div className={styles.hero}>
          <img src="/favicon.svg" className={styles.bolt} />
          <div className={styles.tag}>
            <h1 style={{ marginBottom: -6 }}>Passket</h1>
            <p>A Secure yet Transparent way to store your password</p>
          </div>
          <div className={styles.buttons}>
            <Link className={styles.login} href="/auth/signin">
              Login
            </Link>
          </div>
        </div>

        <div className={styles.features}>
          <div>
            <h3 style={{ opacity: 0.9 }}>What’s this</h3>
            <p>
              Passket (Password-Bucket) is a password manager which stores all
              of the user’s password in an encrypted way which even “we” can’t
              access to it.
              <br />
              Uses AES-128 algorithm and PDBFK2
            </p>
          </div>

          <div>
            <h3 style={{ opacity: 0.9 }}>Why Passket ?</h3>
            <p>
              As most of the users save their password in Notes app or with
              Google Password Manager, If the device gets compromised then its
              GAME OVER. Thats why we made Passket which requires a specific pin
              to access your passwords everytime. So even if the device gets
              compromised, your passwords won’t. It’s also synced across devices
              so you can easily access it from anywhere, anytime.
            </p>
          </div>
        </div>
        </div>
      </main>
    </>
  );
}
