
import { useMemo, useState } from "react";

import styles from "../styles/Pass.module.css"

import Drop from "../components/Drop";
import {Password} from '../utils/types'

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

  return (
    <main>
      <h1>Passket</h1>
      <div className={styles.grid}>
        {
          passes && passes.map(pass => {
            return (
              <div key={passes.indexOf(pass)} id={color[pass.color]} className={styles.passbox}>
                <h2 style={{ userSelect: "none" }}>{pass.provider}</h2> <Drop userid={userid} pass={pass}/>
                <h3>{pass.account}</h3>
                <p className={styles.blur}>{pass.password}</p>
              </div>
            )
          })
        }
      </div>
    </main>
  );
}