
import { useMemo, useState } from "react";

import styles from "../styles/Pass.module.css"

import Drop from "../components/Drop";
import { Password } from '../utils/types'

const color = [
  "white",
  "blue",
  "green",
  "yellow",
  "violet",
  "red"
]
export default function Home() {
  const [passes, setPasses] = useState<Password[]>([]);

  const userid = "12345678"

  useMemo(() => {
    fetch(`/api/fetch/${userid}`).then(a => a.json()).then(res => {
      setPasses(res.keys)
    })
  }, [])

  function visible(element, pass) {
    const pin = prompt("PIN Code")
    if (pin == "1234") {
      fetch('/api/decrypt', {
        method: "POST",
        body: JSON.stringify({ input: pass })
      }).then(data => data.json()).then(res => {
        element.innerHtml = res.decrypted ? res.decrypted : pass
        element.style.filter = "none";
      }).catch(() => {
        element.innerHtml = pass
        element.style.filter = "none";
      })

      setTimeout(() => {
        element.innerHtml = pass
        element.style.filter = "blur(3px)";
      }, 10 * 1000)
      
    }
  }

  return (
    <main>
      <h1>Passket</h1>
      <div className={styles.grid}>
        {
          passes && passes.map(pass => {
            return (
              <div key={passes.indexOf(pass)} id={color[pass.color]} className={styles.passbox}>
                <h2 style={{ userSelect: "none" }}>{pass.provider}</h2> <Drop userid={userid} pass={pass} />
                <h3>{pass.account}</h3>
                <p onClick={(e) => visible(e.target, pass.password)} className={styles.blur}>{pass.password}</p>
              </div>
            )
          })
        }
      </div>
    </main>
  );
}