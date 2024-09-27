import './style.css';
import { useState, useEffect } from 'react';

interface MasterPasswordProps {
  onLogin: () => void;
}

export const MasterPassword = (props: MasterPasswordProps) => {
  const [users, setUsers] = useState<string[]>(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(-1);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');

  useEffect(() => {
    if (users) return;
    window.masterPassword.getAllUsers().then((res) => {
      setUsers(res);
      if (res.length > 0) setSelectedUserIndex(0);
    });
  });

  const hCUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserIndex(Number(e.target.value));
  };

  const hCUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const field = document.getElementById('UsernameInput');
    const error = document.getElementById('UsernameInputError');

    if (value.length === 0) {
      field.classList.remove('invalid');
      error.innerText = '';
    } else if (users.includes(value)) {
      field.classList.add('invalid');
      error.innerText = 'Username already exists';
    } else {
      field.classList.remove('invalid');
      error.innerText = '';
    }

    setUsername(value);
  };

  const hCPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const field = document.getElementById('MasterPasswordInput');
    const error = document.getElementById('MasterPasswordError');

    if (selectedUserIndex === -1) {

      if (value.length === 0) {
        field.classList.remove('invalid');
        error.innerText = '';
      } else if (value.length < 8) {
        field.classList.add('invalid');
        error.innerText = 'Password must be at least 8 characters long';
      } else if (value.length > 64) {
        field.classList.add('invalid');
        error.innerText = 'Password must be at most 64 characters long';
      } else if (value.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,64}$/) === null) {
        field.classList.add('invalid');
        error.innerText = 'Password must contain at least one number, one lowercase letter, one uppercase letter, one special character and no spaces';
      } else {
        field.classList.remove('invalid');
        error.innerText = '';
      }

    } else {
      const field = document.getElementById('MasterPasswordInput');
      field.classList.remove('invalid');
    }

    setPassword(e.target.value);
  }

  const hCPasswordRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const field = document.getElementById('MasterPasswordInputRepeat');
    const error = document.getElementById('MasterPasswordRepeatError');

    if (value !== password) {
      field.classList.add('invalid');
      error.innerText = 'Passwords do not match';
    } else {
      field.classList.remove('invalid');
      error.innerText = '';
    }

    setRepeatPassword(value);
  }

  const submitForm = () => {
    if (selectedUserIndex === -1) {
      if (username.length === 0) {
        const field = document.getElementById('UsernameInput');
        const error = document.getElementById('UsernameInputError');
        field.classList.add('invalid');
        error.innerText = 'Username cannot be empty';
        return;
      }

      if (password.length === 0) {
        const field = document.getElementById('MasterPasswordInput');
        const error = document.getElementById('MasterPasswordError');
        field.classList.add('invalid');
        error.innerText = 'Password cannot be empty';
        return;
      }

      if (repeatPassword !== password) {
        const field = document.getElementById('MasterPasswordInputRepeat');
        const error = document.getElementById('MasterPasswordRepeatError');
        field.classList.add('invalid');
        error.innerText = 'Passwords do not match';
        return;
      }

      window.masterPassword.createUser(username, password).then((res) => {
        const field = document.getElementById('UsernameInput');
        const error = document.getElementById('UsernameInputError');
        switch (res) {
          case "Success":
            props.onLogin();
            break;
          case "User already exists":
            field.classList.add('invalid');
            error.innerText = res;
            break;
          case 'Password does not fullfil requirements':
            field.classList.add('invalid');
            error.innerText = res;
            break;
          default:
            field.classList.add('invalid');
            error.innerText = 'An error occurred';
            break;
        }
      });
    } else {
      window.masterPassword.login(users[selectedUserIndex], password).then((res) => {
        if (res) {
          props.onLogin();
        } else {
          const field = document.getElementById('MasterPasswordInput');
          const error = document.getElementById('MasterPasswordError');
          field.classList.add('invalid');
          error.innerText = 'Incorrect password';
        }
      });
    }
  }

  return (
    <div id="MasterPassword">
      <div id="MasterPasswordTitle">Master Login</div>
      <select id="MasterPasswordUserDropdownSelect" value={selectedUserIndex} onChange={hCUserSelect}>
        {users?.map((user, index) => {
          return <option key={index} value={index}>{user}</option>
        })}
        <option value={-1}>-- Create New --</option>
      </select>
      <input id="UsernameInput" type="text" placeholder={"Username"} className={selectedUserIndex === -1 ? '' : 'hidden'} onChange={hCUsername} value={username}></input>
      <input id="MasterPasswordInput" type="password" placeholder={"Password"} onChange={hCPassword} value={password}></input>
      <input id="MasterPasswordInputRepeat" type="password" placeholder={"Repeat Password"} className={selectedUserIndex === -1 ? '' : 'hidden'} onChange={hCPasswordRepeat} value={repeatPassword}></input>
      <button id="MasterPasswordSubmit" onClick={submitForm}>{selectedUserIndex === -1 ? 'Register' : 'Login'}</button>
      <div id="UsernameInputError" className='ErrorMessage'></div>
      <div id="MasterPasswordError" className='ErrorMessage'></div>
      <div id="MasterPasswordRepeatError" className='ErrorMessage'></div>
    </div>
  );
}