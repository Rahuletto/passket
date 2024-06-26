import { useEffect, useState } from 'react';

import styles from '../styles/Pass.module.css';

import Drop from '../components/Drop';
import NewPass from '../components/NewPass';

// Auth

// Auth and Database
import { useSession, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { PBKDF2 } from '../utils/pbkdf2';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';

export const color = ['white', 'blue', 'green', 'yellow', 'violet', 'red'];

export default function Home({ id, user, pass }) {
  const router = useRouter();

  const ses = useUser();

  useEffect(() => {
    if (!ses && !id) router.push('/auth/signin');
    if(ses) {
      id = ses.id
    }
  }, []);

  const supabaseClient = useSupabaseClient();
  const session = useSession();

  const [addToggle, setAddToggle] = useState(false);
  const [accToggle, setAcc] = useState(false);

  const [passes, setPass] = useState(pass);

  async function visible(element, pass) {
    if (element.style.filter == 'none') return;
    const pin = prompt('PIN Code');
    const data = {
      input: pass,
    };

    if (!Number(pin) || pin.length !== 4 || !pin) {
      alert('Please follow 4 number pin. Which should be numerical pin!');
    }

    if (PBKDF2(pin) == user.pin) {
      fetch('/api/decrypt', {
        method: 'POST',
        body: JSON.stringify(data),
      })
        .then((data) => data.json())
        .then((res) => {
          element.innerText = res.decrypted ? res.decrypted : pass;
          element.style.filter = 'none';
        })
        .catch(() => {
          element.innerText = pass;
          element.style.filter = 'none';
        });

      setTimeout(() => {
        element.innerText = pass;
        element.style.filter = 'blur(3px)';
      }, 15 * 1000);
    } else alert('Wrong Pin!');
  }

  function afterSub(str: string) {
    if (str && str == 'hide') setAddToggle(false);
    setTimeout(() => {
      fetch(`/api/fetch/${id}`)
        .then((a) => a.json())
        .then((res) => {
          setPass(res.keys);
          setAddToggle(false);
        });
    }, 100);
  }

  async function setNewPass() {
    if (!user || !user?.pin) {
      const pin = prompt('Set new PIN');

      if (!Number(pin) || pin.length !== 4 || !pin) {
        return alert(
          'Please follow a 4 number pin. Which should be numerical pin!'
        );
      }

      supabaseClient
        .from('Users')
        .insert({ userid: id, pin: PBKDF2(pin) })
        .then(async (a) => {
          alert('This is your new PIN.');
          return router.reload();
        });
    } else return alert('Seems like you have pin. Please refresh.');
  }

  async function changePin() {
    const old = prompt('Old PIN');

    if (!Number(old) || old.length !== 4 || !old) {
      alert('Please follow 4 number pin. Which should be numerical pin!');
    }

    if (PBKDF2(old) == user.pin) {
      const newpin = prompt('New PIN');

      if (!Number(newpin) || newpin.length !== 4 || !newpin) {
        return alert(
          'Please follow 4 number pin. Which should be numerical pin!'
        );
      } else {
        supabaseClient
          .from('Users')
          .update({ userid: id, pin: PBKDF2(newpin) })
          .eq('userid', id)
          .then(() => {
            alert('Changed your PIN.');
          });
      }
    } else alert('Wrong Old PIN !');
  }

  if (session)
    return (
      <main>
        <div className="header">
          <div className="left">
            <h1 id="title">Passket</h1>{' '}
            {!user || !user.pin || user.pin == null ? null : (
              <button
                id="new"
                className="header-add"
                onClick={() => setAddToggle(true)}>
                Add Pass
              </button>
            )}
          </div>
          <div>
            {session && (
              <img
                title="Account Options"
                onClick={() => {
                  setAcc((a) => !a);
                }}
                src={session?.user?.user_metadata?.avatar_url}
                alt="user"
                className={styles.profile}
              />
            )}
            {accToggle && (
              <div className={styles.options}>
                <p title="Change pin" onClick={() => changePin()}>
                  Change Pin
                </p>
                <p
                  title="Log out"
                  onClick={() => {
                    supabaseClient.auth.signOut().then((a) => {
                      router.push('/home');
                    });
                  }}>
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>

        {user && user.pin ? (
          <div className={styles.grid}>
            {passes && passes[0] != null && passes[0]?.uid ? (
              passes.map((pass) => {
                return (
                  <div
                    key={pass.uid}
                    id={color[pass.color]}
                    className={styles.passbox}>
                    <h2 style={{ userSelect: 'none' }}>{pass.provider}</h2>{' '}
                    <Drop update={afterSub} userid={id} pass={pass} />
                    <h3>{pass.account}</h3>
                    <p
                      onClick={(e) => visible(e.target, pass.password)}
                      className={styles.blur}>
                      {pass.password.split("").reverse().join("")}
                    </p>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '90vh',
                  flexDirection: 'column',
                  gap: 12,
                }}>
                <h2>
                  You currently dont have any passwords saved. Lets make one!
                </h2>
                <button
                  id="new"
                  onClick={() => setAddToggle(true)}
                  style={{
                    margin: '0 !important',
                    marginTop: 0,
                    marginBottom: 0,
                  }}>
                  Add Pass
                </button>
              </div>
            )}
          </div>
        ) : user?.pin && ((user && !passes[0]) || passes.length == 0) ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '90vh',
              flexDirection: 'column',
              gap: 12,
            }}>
            <h2>You currently dont have any passwords saved. Lets make one!</h2>
            <button
              id="new"
              onClick={() => setAddToggle(true)}
              style={{ margin: '0 !important', marginTop: 0, marginBottom: 0 }}>
              Add Pass
            </button>
          </div>
        ) : !user || !user.pin || user.pin == null ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '95vh',
              flexDirection: 'column',
              gap: 12,
            }}>
            <h2>Seems like you are new here. Lets create a pin for you</h2>
            <button
              id="new"
              style={{
                background: 'var(--bg)',
                margin: '0 !important',
                marginTop: 0,
                marginBottom: 0,
              }}
              onClick={() => setNewPass()}>
              Set PIN
            </button>
          </div>
        ) : null}

        {addToggle && <NewPass vis={afterSub} userid={id} />}
      </main>
    );
  else
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createPagesServerClient(context);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const id = user?.id;

  const { data } = await supabase
    .from('Users')
    .select('*')
    .eq('userid', id)
    .limit(1)
    .single();

  const passes = await fetch(`https://passket.vercel.app/api/fetch/${id}`);
  const res = await passes.json();

  return { props: { id: id || null, user: data, pass: res?.keys || null } };
}
