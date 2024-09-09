import { useState } from "react";
import "./style.css"
import { PageGeneratePassword } from "../pageGeneratePassword";

export const Navigation = () => {
  const [currentPage, setCurrentPage] = useState<JSX.Element>(<></>);

  // PAGES //
  const pgp = <PageGeneratePassword></PageGeneratePassword>;
  ///////////

  const buttonPassword = document.getElementById('menu_password') as HTMLDivElement;
  const buttonGenerate = document.getElementById('menu_generator') as HTMLDivElement;

  const buttons = [buttonPassword, buttonGenerate];

  const setActive = (target: HTMLElement) => {
    buttons.forEach(button => {
      if (button) // TODO: Why does react sometimes say that button is null?
        button.classList.remove('active');
    });

    target.classList.add('active');
  }

  return (
    <div id="mainContentContainer">
      <div id="menuBar">
        <div id="menuItemContainer">
          <div id="menu_password" className="menuItem" onClick={(e) => { setCurrentPage(<>TO DO</>); setActive(e.currentTarget) }}>
            <div className="menuItemImg"></div>
          </div>
          <div id="menu_generator" className="menuItem" onClick={(e) => { setCurrentPage(pgp); setActive(e.currentTarget) }}>
            <div className="menuItemImg"></div>
          </div>
          <div className="menuItem">
            <div className="menuItemImg"></div>
          </div>
          <div className="menuItem">
            <div className="menuItemImg"></div>
          </div>
        </div>
      </div>
      <div id="contentContainer">
        {currentPage}
      </div>
    </div>
  );
}