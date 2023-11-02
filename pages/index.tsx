import { useEffect, useMemo, useState } from "react";

import styles from "../styles/Pass.module.css";

import Drop from "../components/Drop";
import { Password } from "../utils/types";
import NewPass from "../components/NewPass";

// Auth
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const color = ["white", "blue", "green", "yellow", "violet", "red"];

export default function Home() {
  const router = useRouter();
  const session = useSession();

  const supabaseClient = useSupabaseClient();

  const [passes, setPasses] = useState<Password[]>([]);

  const [addToggle, setAddToggle] = useState(false);

  const [userid, setUserid] = useState(null);

  useMemo(() => {
    setUserid(session ? session?.user?.id : null);

    fetch(`/api/fetch/${userid}`)
      .then((a) => a.json())
      .then((res) => {
        setPasses(res.keys);
      });
  }, []);

  useEffect(() => {
    if (!session?.user?.id) router.push("/auth/signin");
  }, []);

  function visible(element, pass) {
    if (element.style.filter == "none") return;
    const pin = prompt("PIN Code");
    if (pin == "1234") {
      fetch("/api/decrypt", {
        method: "POST",
        body: JSON.stringify({ input: pass }),
      })
        .then((data) => data.json())
        .then((res) => {
          element.innerHtml = res.decrypted ? res.decrypted : pass;
          element.style.filter = "none";
        })
        .catch(() => {
          element.innerHtml = pass;
          element.style.filter = "none";
        });

      setTimeout(() => {
        element.innerHtml = pass;
        element.style.filter = "blur(3px)";
      }, 10 * 1000);
    }
  }

  function afterSub(str: string) {
    if (str && str == "hide") setAddToggle(false);
    fetch(`/api/fetch/${userid}`)
      .then((a) => a.json())
      .then((res) => {
        setPasses(res.keys);
        setAddToggle(false);
      });
  }

  return (
    <main>
      <div className="header">
        <div className="left">
          <h1>Passket</h1>{" "}
          <button id="new" onClick={() => setAddToggle(true)}>
            Add Pass
          </button>
        </div>
        <div>
          {session && (
            <img
              title="Log out"
              onClick={() => {
                supabaseClient.auth.signOut().then((a) => {
                  router.push("/auth/signin");
                });
              }}
              src={session?.user?.user_metadata?.avatar_url}
              alt="user"
              className={styles.profile}
            />
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {passes &&
          passes.map((pass) => {
            return (
              <div
                key={passes.indexOf(pass)}
                id={color[pass.color]}
                className={styles.passbox}
              >
                <h2 style={{ userSelect: "none" }}>{pass.provider}</h2>{" "}
                <Drop update={afterSub} userid={userid} pass={pass} />
                <h3>{pass.account}</h3>
                <p
                  onClick={(e) => visible(e.target, pass.password)}
                  className={styles.blur}
                >
                  {pass.password}
                </p>
              </div>
            );
          })}
      </div>

      {addToggle && <NewPass vis={afterSub} userid={userid} />}
    </main>
  );
}
