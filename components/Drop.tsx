import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { MdOutlineContentCopy, MdOutlineDelete } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import { Password } from "../utils/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const Drop: React.FC<{ userid: string; pass: Password; update: any }> = ({
  userid,
  pass,
  update,
}) => {
  const [visible, setVisible] = useState(false);
  const supabaseClient = useSupabaseClient();

  async function copy() {
    const pin = prompt("PIN Code");
    const { data: pinpass } = await supabaseClient
      .from("Users")
      .select("*")
      .eq("userid", userid)
      .limit(1)
      .single();

    if (pin == pinpass.pin) {
      fetch("/api/decrypt", {
        method: "POST",
        body: JSON.stringify({ input: pass.password }),
      })
        .then((data) => data.json())
        .then((res) => {
          navigator.clipboard.writeText(
            res.decrypted ? res.decrypted : pass.password
          );
          alert("Copied the secret");
          setVisible(false);
        })
        .catch(() => {
          navigator.clipboard.writeText(pass.password);
          alert("Copied the secret");
          setVisible(false);
        });
    } else return alert("Wrong PIN!");
  }

  function edit() {
    // Edit model dialog
  }

  function del() {
    const confirmation = confirm(
      "Are you sure you want to delete ? This cannot be reversed."
    );
    if (confirmation == true) {
      fetch(`/api/delete/${userid}/${pass.uid}`)
        .then((a) => a.json())
        .then((res) => {
          setVisible(false);
        });
    } else return;
  }

  return (
    <>
      {visible && (
        <div className="copypaste">
          <div id="copy">
            <MdOutlineContentCopy onClick={() => copy()} />
          </div>
          <div id="edit">
            <HiPencil
              onClick={() => {
                edit();
                update();
              }}
            />
          </div>
          <div id="delete">
            <MdOutlineDelete
              style={{ color: "var(--bg)" }}
              onClick={() => {
                del();
                update();
              }}
            />
          </div>
        </div>
      )}
      <button className="more" onClick={() => setVisible((a) => !a)}>
        <FiMoreVertical />
      </button>
    </>
  );
};
export default Drop;
