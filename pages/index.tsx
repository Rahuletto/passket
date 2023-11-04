import { useEffect, useState } from "react";

import styles from "../styles/Pass.module.css";

import Drop from "../components/Drop";
import { Password } from "../utils/types";
import NewPass from "../components/NewPass";

// Auth
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export const color = ["white", "blue", "green", "yellow", "violet", "red"];

export default function Home() {
  const router = useRouter();
  const session = useSession();

  const supabaseClient = useSupabaseClient();

  const [passes, setPasses] = useState<Password[]>([]);

  const [addToggle, setAddToggle] = useState(false);
  const [accToggle, setAcc] = useState(false);

  const [userid, setUserid] = useState(null);

  useEffect(() => {
    setUserid(session ? session?.user?.id : null);
    if (!session?.user?.id) router.push("/auth/signin");

    fetch(`/api/fetch/${session?.user?.id}`)
      .then((a) => a.json())
      .then((res) => {
        setPasses(res.keys);
      });
  }, [session]);

  async function visible(element, pass) {
    if (element.style.filter == "none") return;
    const pin = prompt("PIN Code");
    const data = {
      input: pass,
    };

    const { data: pinpass } = await supabaseClient
      .from("Users")
      .select("*")
      .eq("userid", userid)
      .limit(1)
      .single();

    if (!Number(pin) || pin.length !== 4 || !pin) {
      alert("Please follow 4 number pin. Which should be number pin!");
    }

    if (pin == pinpass.pin) {
      fetch("/api/decrypt", {
        method: "POST",
        body: JSON.stringify(data),
      })
        .then((data) => data.json())
        .then((res) => {
          element.innerText = res.decrypted ? res.decrypted : pass;
          element.style.filter = "none";
        })
        .catch(() => {
          element.innerText = pass;
          element.style.filter = "none";
        });

      setTimeout(() => {
        element.innerText = pass;
        element.style.filter = "blur(3px)";
      }, 10 * 1000);
    } else alert("Wrong Pin!");
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

  async function changePin() {
    const old = prompt("Old PIN");

    const { data: pinpass } = await supabaseClient
      .from("Users")
      .select("*")
      .eq("userid", userid)
      .limit(1)
      .single();

    if (!Number(old) || old.length !== 4 || !old) {
      alert("Please follow 4 number pin. Which should be number pin!");
    }

    if (old == pinpass.pin) {
      const newpin = prompt("New PIN");

      if (!Number(newpin) || newpin.length !== 4 || !newpin) {
        return alert("Please follow 4 number pin. Which should be number pin!");
      } else {
        supabaseClient
          .from("Users")
          .update({ userid: userid, pin: newpin })
          .eq("userid", userid)
          .then((a) => {
            alert("Changed your PIN.");
          });
      }
    } else alert("Wrong Old PIN !");
  }

  return (
    <main>
      <div className="header">
        <div className="left">
          <h1 id="title">Passket</h1>{" "}
          <button
            id="new"
            className="header-add"
            onClick={() => setAddToggle(true)}
          >
            Add Pass
          </button>
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
                    router.push("/auth/signin");
                  });
                }}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {passes &&
          passes.map((pass) => {
            return (
              <div
                key={pass.uid}
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
