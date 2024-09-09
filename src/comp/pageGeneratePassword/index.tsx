import { useState } from 'react';
import './style.css'

export const PageGeneratePassword = () => {
  const [password, setPassword] = useState<string>('READY');
  const [length, setLength] = useState<number>(16);

  const [allowLowercase, setAllowLowercase] = useState<boolean>(true);
  const [allowUppercase, setAllowUppercase] = useState<boolean>(true);
  const [allowNumbers, setAllowNumbers] = useState<boolean>(true);
  const [allowSymbols, setAllowSymbols] = useState<boolean>(true);

  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+';

  function syncLength(target: HTMLInputElement) {
    setLength(target.value as unknown as number);
    generatePassword(target.value as unknown as number);
  }

  function sanityCheckbox(target: HTMLInputElement): boolean {
    if (target.disabled) return false;

    let checkedCount = 0;

    const checkboxes = [
      document.getElementById('lowercaseCheckbox') as HTMLInputElement,
      document.getElementById('uppercaseCheckbox') as HTMLInputElement,
      document.getElementById('numbersCheckbox') as HTMLInputElement,
      document.getElementById('symbolsCheckbox') as HTMLInputElement,
    ]

    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        checkedCount++;
      }
    });

    if (checkedCount === 0) {
      target.checked = true;
    }

    if (checkedCount === 1 || checkedCount === 0) {
      checkboxes.forEach(checkbox => {
        checkbox.disabled = checkbox.checked;
      });
    } else {
      checkboxes.forEach(checkbox => {
        checkbox.disabled = false;
      });
    }

    generatePassword();
    return true;
  }

  function generatePassword(overrideLength?: number) {
    const useLength = overrideLength || length;
    const useLowerCase = (document.getElementById('lowercaseCheckbox') as HTMLInputElement).checked;
    const useUpperCase = (document.getElementById('uppercaseCheckbox') as HTMLInputElement).checked;
    const useNumbers   = (document.getElementById('numbersCheckbox') as HTMLInputElement).checked;
    const useSymbols   = (document.getElementById('symbolsCheckbox') as HTMLInputElement).checked;

    let chars = '';

    if (useLowerCase) {
      chars += lowercaseChars;
    }

    if (useUpperCase) {
      chars += uppercaseChars;
    }

    if (useNumbers) {
      chars += numberChars;
    }

    if (useSymbols) {
      chars += symbolChars;
    }

    setPassword(generatePasswordFromChars(useLength, chars));
  }

  function generatePasswordFromChars(length: number, chars: string) {
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }

  return (
    <>
      <h1>Password Generator</h1>
      <div id="output">
        <button id="generateButton" onClick={() => generatePassword()}>
          <div id="generateButtonIcon"></div>
        </button>
        <input type="text" id="passwordOutput" value={password} readOnly />
        <button id="copyButton">
          <div id="copyButtonIcon"></div>
        </button>
      </div>
      <div id="controlPanel">
        <div id="sliderContainer">
          <div>
            <label htmlFor="lengthSlider">Length:</label>
            <input type="number" id="lengthValue" value={length} onChange={(e) => syncLength(e.target)} />
          </div>
          <input type="range" id="lengthSlider" min="8" max="64" value={length} step="1" onChange={(e) => syncLength(e.target)} />
        </div>
        <table id="checkboxContainer">
          <tbody>
            <tr className="checkboxField">
              <td>
                <input type="checkbox" id="lowercaseCheckbox" checked={allowLowercase} onChange={(e) => {
                  setAllowLowercase(!allowLowercase);
                  sanityCheckbox(e.target)
                }} />
              </td>
              <td>
                <label htmlFor="lowercaseCheckbox">Lowercase</label>
              </td>
            </tr>
            <tr className="checkboxField">
              <td>
                <input type="checkbox" id="uppercaseCheckbox" checked={allowUppercase} onChange={(e) => {
                  setAllowUppercase(!allowUppercase);
                  sanityCheckbox(e.target)
                }} />
              </td>
              <td>
                <label htmlFor="uppercaseCheckbox">Uppercase</label>
              </td>
            </tr>
            <tr className="checkboxField">
              <td>
                <input type="checkbox" id="numbersCheckbox" checked={allowNumbers} onChange={(e) => {
                  setAllowNumbers(!allowNumbers);
                  sanityCheckbox(e.target)
                }} />
              </td>
              <td>
                <label htmlFor="numbersCheckbox">Numbers</label>
              </td>
            </tr>
            <tr className="checkboxField">
              <td>
                <input type="checkbox" id="symbolsCheckbox"  checked={allowSymbols} onChange={(e) => {
                  setAllowSymbols(!allowSymbols);
                  sanityCheckbox(e.target)
                }} />
              </td>
              <td>
                <label htmlFor="symbolsCheckbox">Symbols</label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

