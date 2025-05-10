import React from "react";
import { PasswordCategory } from "./category";
import "./style.css";
import { PasswordEntry, PasswordEntryProps } from "./entry";
import { PasswordView } from "./view";

type localIndexElement = {
  key: number;
  title: string;
  color: string;
  entries: Array<PasswordEntryProps>;
};

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
    const index: Index = await window.passwordEntry.getIndex();
    const localIndex: localIndexElement[] = [];

    for (const categoryID in index) {
      const entries: PasswordEntryProps[] = [];
      if (index[categoryID].entries.length == 0) continue;

      for (const entry of index[categoryID].entries) {
        entries.push({
          entryTitle: entry.title,
          entrySubTitle: entry.subtitle,
          callback: () => {
            setCurrentId(entry.id);
            console.log("clicked", entry.id);
          },
        });
      }
      // THIS IS STUPID, categoryID is a number but typescript thinks it is a string, so we have to parse it to a number
      localIndex.push({
        key: parseInt(categoryID),
        title: index[categoryID].titel,
        color: index[categoryID].color,
        entries: entries,
      });
    }

    setIndex(localIndex);
    setIsInit(true);
  }

  React.useEffect(() => {
    loadIndex();
  });

  function isOpen(title: string) {
    return localStorage.getItem(title)
      ? localStorage.getItem(title) == "true"
        ? true
        : false
      : true;
  }

  return (
    <div id="passwordContainer">
      <div className="catalogContainer">
        <div id="catalog">
          {index.map((element) => {
            return (
              <PasswordCategory
                key={element.key}
                categoryName={element.title}
                textColor={element.color}
                entries={element.entries}
                isOpen={isOpen(element.title)}
              />
            );
          })}
        </div>
        <div id="addNewEntry" onClick={() => { setCurrentId("new"); }}>
          + New Entry
        </div>
      </div>
      <div id="passwordView">
        {currentId !== "" ? (
          <PasswordView entryID={currentId} key={currentId} onDelete={() => { setCurrentId(""); loadIndex(true) }}></PasswordView>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
