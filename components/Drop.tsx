
import { useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi'
import { MdOutlineContentCopy, MdOutlineDelete } from 'react-icons/md'
import { HiPencil } from 'react-icons/hi'
import { Password } from '../utils/types';

const Drop: React.FC<{ userid: string, pass: Password }> = ({ userid, pass }) => {
    const [visible, setVisible] = useState(false)

    function copy() {
        const pin = prompt("PIN Code")
        if (pin == "1234") {
            fetch('/api/decrypt', {
                method: "POST",
                body: JSON.stringify({ input: pass.password })
            }).then(data => data.json()).then(res => {
                navigator.clipboard.writeText(res.decrypted ? res.decrypted : pass.password);
                alert("Copied the secret")
                setVisible(false)
            }).catch(() => {
                navigator.clipboard.writeText(pass.password);
                alert("Copied the secret")
                setVisible(false)
            })
        }

    }

    function edit() {
        // Edit model dialog
    }

    function del() {
        const confirmation = confirm("Are you sure you want to delete ? This cannot be reversed.");
        if (confirmation == true) {
            fetch(`/api/delete/${userid}/${pass.provider}/${pass.account}`).then(a => a.json()).then(res => {
                setVisible(false)
            })
        } else return;
    }

    return (
        <>
            {visible && (
                <div className="copypaste">
                    <div id="copy"><MdOutlineContentCopy onClick={() => copy()} /></div>
                    <div id="edit"><HiPencil onClick={() => edit()} /></div>
                    <div id="delete"><MdOutlineDelete style={{ color: "var(--bg)" }} onClick={() => del()} /></div>
                </div>
            )
            }
            <button className="more" onClick={() => setVisible(a => !a)}><FiMoreVertical /></button>
        </>
    )
}
export default Drop;
