// NextJS stuff
import { useState } from 'react';
import { Password } from 'primereact/password';
import { color } from '../pages';
import makeid from '../utils/id';
import { Encrypt } from '../utils/aes';

/*
  "white",
  "blue",
  "green",
  "yellow",
  "violet",
  "red"
*/

const NewPass: React.FC<{ vis: any; userid: string }> = ({
  vis,
  userid,
}: {
  vis: any;
  userid: string;
}) => {
  const [prov, setProv] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');

  const [clr, setClr] = useState('white');

  function create() {
    fetch(`/api/encrypt`, {
      method: 'POST',
      body: JSON.stringify({
        input: pass,
      }),
    })
      .then((data) => data.json())
      .then((res) => {
        const data = {
          uid: makeid(8),
          provider: prov,
          account: name,
          password: res.encrypted || pass,
          color: color.findIndex((e) => e == clr),
        };

        console.log(data);
        fetch(`/api/create/${userid}`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      });
  }

  return (
    <>
      <div
        id="centerpoint"
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          vis('hide');
        }}>
        <div className="dialogBox" id={clr}>
          <dialog id="create-new" open>
            <form>
              <label htmlFor="#prov">Provider</label>
              <input
                autoComplete="off"
                value={prov}
                onChange={(e) => setProv(e.target.value)}
                id="prov"
                placeholder="Google"
              />
              <label htmlFor="#user">Username</label>
              <input
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="user"
                placeholder="example@gmail.com"
              />
              <label htmlFor="#passs">Password</label>
              <Password
                minLength={6}
                autoComplete="off"
                placeholder="Secret Value"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                feedback={false}
                tabIndex={1}
                toggleMask
              />
            </form>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label>Color</label>
              <div className="colorPicker">
                <button id="white" onClick={() => setClr('white')} />
                <button id="blue" onClick={() => setClr('blue')} />
                <button id="green" onClick={() => setClr('green')} />
                <button id="yellow" onClick={() => setClr('yellow')} />
                <button id="violet" onClick={() => setClr('violet')} />
                <button id="red" onClick={() => setClr('red')} />
              </div>
            </div>
          </dialog>
        </div>

        <button
          className="save"
          id="new"
          onClick={() => {
            create();
            vis('add');
          }}>
          Add
        </button>
      </div>
    </>
  );
};

export default NewPass;
