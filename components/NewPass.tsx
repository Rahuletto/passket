// NextJS stuff
import Head from 'next/head';
import { useState } from 'react';

const NewPass: React.FC = () => {

    const [prov, setProv] = useState('')
    const [name, setName] = useState('')
    const [pass, setPass] = useState('')

    return (
        <>
            <dialog id="create-new" open>
                <form>
                    <label htmlFor='#prov'>Provider</label>
                    <input value={prov} onChange={(e) => setProv(e.target.value)} id="prov" placeholder="Google" />
                    <label htmlFor='#user'>Username</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} id="user" placeholder="example@gmail.com" />
                    <label htmlFor='#passs'>Password</label>
                    <input value={pass} onChange={(e) => setPass(e.target.value)} id="passs" placeholder="password1234" />
                </form>
            </dialog>
        </>
    );
};

export default NewPass;
