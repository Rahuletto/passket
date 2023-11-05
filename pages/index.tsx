import { useEffect, useState } from 'react';

import styles from '../styles/Pass.module.css';

import Drop from '../components/Drop';
import { Password } from '../utils/types';
import NewPass from '../components/NewPass';

// Auth
import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { PBKDF2 } from '../utils/pbkdf2';

export const color = ['white', 'blue', 'green', 'yellow', 'violet', 'red'];

export default function Home() {
  const router = useRouter();
  const session = useSession();

  const supabaseClient = useSupabaseClient();

  const [passes, setPasses] = useState<Password[]>([]);

  const [addToggle, setAddToggle] = useState(false);
  const [accToggle, setAcc] = useState(false);

  const [userid, setUserid] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUserid(session ? session?.user?.id : null);

    setTimeout(() => {
      if (!session) router.push('/auth/signin');
    }, 2000);

    (async () => {
      if (session?.user?.id) {
        const { data } = await supabaseClient
          .from('Users')
          .select()
          .eq('userid', session?.user?.id)
          .limit(1);

        setUser(data[0]);
      }
    })();

    fetch(`/api/fetch/${session?.user?.id}`)
      .then((a) => a.json())
      .then((res) => {
        console.log(res);
        setPasses(res?.keys);
      });
  }, [session]);

  async function visible(element, pass) {
    if (element.style.filter == 'none') return;
    const pin = prompt('PIN Code');
    const data = {
      input: pass,
    };

    const { data: pinpass } = await supabaseClient
      .from('Users')
      .select('*')
      .eq('userid', userid)
      .limit(1);

    if (!Number(pin) || pin.length !== 4 || !pin) {
      alert('Please follow 4 number pin. Which should be numerical pin!');
    }
    console.log(PBKDF2(pin) == pinpass[0].pin);
    if (PBKDF2(pin) == pinpass[0].pin) {
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
      }, 10 * 1000);
    } else alert('Wrong Pin!');
  }

  function afterSub(str: string) {
    if (str && str == 'hide') setAddToggle(false);
    setTimeout(() => {
      fetch(`/api/fetch/${userid}`)
        .then((a) => a.json())
        .then((res) => {
          setPasses(res.keys);
          setAddToggle(false);
        });
    }, 1000);
  }

  async function setNewPass() {
    const { data: pinpass } = await supabaseClient
      .from('Users')
      .select('*')
      .eq('userid', userid)
      .limit(1);

    if (!pinpass || !pinpass[0]?.pin) {
      const pin = prompt('Set new PIN');

      if (!Number(pin) || pin.length !== 4 || !pin) {
        return alert(
          'Please follow a 4 number pin. Which should be numerical pin!'
        );
      }

      supabaseClient
        .from('Users')
        .insert({ userid: userid, pin: PBKDF2(pin) })
        .then(async (a) => {
          const { data: userData } = await supabaseClient
            .from('Users')
            .select('*')
            .eq('userid', userid)
            .limit(1);

          setUser(userData);

          alert('This is your new PIN.');
        });
    } else return alert('Seems like you have pin. Please refresh.');
  }

  async function changePin() {
    const old = prompt('Old PIN');

    const { data: pinpass } = await supabaseClient
      .from('Users')
      .select('*')
      .eq('userid', userid)
      .limit(1)
      .single();

    if (!Number(old) || old.length !== 4 || !old) {
      alert('Please follow 4 number pin. Which should be numerical pin!');
    }

    if (PBKDF2(old) == pinpass.pin) {
      const newpin = prompt('New PIN');

      if (!Number(newpin) || newpin.length !== 4 || !newpin) {
        return alert(
          'Please follow 4 number pin. Which should be numerical pin!'
        );
      } else {
        supabaseClient
          .from('Users')
          .update({ userid: userid, pin: PBKDF2(newpin) })
          .eq('userid', userid)
          .then((a) => {
            alert('Changed your PIN.');
          });
      }
    } else alert('Wrong Old PIN !');
  }

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
                    router.push('/auth/signin');
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
          {passes[0] != null && passes[0]?.uid ? (
            passes.map((pass) => {
              return (
                <div
                  key={pass.uid}
                  id={color[pass.color]}
                  className={styles.passbox}>
                  <h2 style={{ userSelect: 'none' }}>{pass.provider}</h2>{' '}
                  <Drop update={afterSub} userid={userid} pass={pass} />
                  <h3>{pass.account}</h3>
                  <p
                    onClick={(e) => visible(e.target, pass.password)}
                    className={styles.blur}>
                    {pass.password}
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
                height: '95vh',
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
      ) : (user && !passes[0]) || passes.length == 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '95vh',
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

      {addToggle && <NewPass vis={afterSub} userid={userid} />}
    </main>
  );
}
