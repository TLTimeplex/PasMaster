import React from 'react';
import { PasswordCategory } from './category';
import './style.css'
import { PasswordEntryProps } from './entry';

type localIndexElement = {
  key: string;
  title: string;
  color: string;
  entries: Array<PasswordEntryProps>;
}

export const PagePassword = () => {

  const [currentId, setCurrentId] = React.useState<string>("");
  const [index, setIndex] = React.useState<Array<localIndexElement>>([]);
  const [isInit, setIsInit] = React.useState(false);

  /**
   * A function to initialize the password page, can also be used to refresh the page
   * @param refresh Can be used to refresh the page if it is already initialized
   * @returns 
   */
  async function loadIndex(refresh = false) {
    if (isInit && !refresh) return;
    const index = await window.index.getIndex();
    const localIndex: localIndexElement[] = [];

    for (const category in index) {
      const entries: PasswordEntryProps[] = [];
      for (const entry of index[category].entries) {
        entries.push({ entryTitle: entry.title, entrySubTitle: entry.subtitle, callback: () => setCurrentId(entry.id) });
      }
      localIndex.push({ key: category, title: index[category].Titel, color: index[category].Color, entries: entries });
    }

    setIndex(localIndex);
    setIsInit(true);

    console.log("init");
  }

  React.useEffect(() => {
    loadIndex();
  });

  function isOpen(title: string) {
    return localStorage.getItem(title) ? (localStorage.getItem(title) == "true" ? true : false) : true;
  }

  return (
    <div id="passwordContainer">
      <div id="catalog">
        {
          index.map((element) => {
            return <PasswordCategory key={element.key} categoryName={element.title} textColor={element.color} entries={element.entries} isOpen={isOpen(element.title)} />
          })
        }
      </div>
      <div id="passwordView">
        {currentId !== "" ? <>PASSWORD_VIEW {currentId}</> : <></>}
      </div>
    </div >
  );
}