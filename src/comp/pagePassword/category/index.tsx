import React from 'react';
import './style.css'
import { PasswordEntry, PasswordEntryProps } from '../entry';

type PasswordCategoryProps = {
  categoryName: string;
  textColor: string;
  entries: Array<PasswordEntryProps>;
  isOpen: boolean;
}

export const PasswordCategory = (props: PasswordCategoryProps): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(props.isOpen);

  function toggleOpen() {
    setIsOpen(!isOpen);
    localStorage.setItem(props.categoryName, (!isOpen).toString());
  }

  return (
    <div className="categoryContainer">
      <div className="categoryHead" onClick={toggleOpen}>
        <div className={isOpen ? "categoryLever open" : "categoryLever"}></div>
        <div className="categoryName" style={{ color: props.textColor }}>{props.categoryName}</div>
      </div>
      <div className="categoryEntries" style={{display: isOpen? "flex" : "none"}}>
        {props.entries.map((entry, index) => {
          return (<PasswordEntry key={index} entryTitle={entry.entryTitle} entrySubTitle={entry.entrySubTitle} callback={entry.callback}></PasswordEntry>)
        })}
      </div>
    </div>
  );
}