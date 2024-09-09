import { useState } from "react";
import "./style.css"
import { PageGeneratePassword } from "../pageGeneratePassword";
import { PagePassword } from "../pagePassword";

export const Navigation = () => {
  const [currentPage, setCurrentPage] = useState<JSX.Element>(<></>);

  // PAGES //
  const page_gp = <PageGeneratePassword></PageGeneratePassword>;
  const page_p = <PagePassword></PagePassword>;
  ///////////

  const buttons = ['menu_password', 'menu_generator'];

  const setActive = (target: HTMLElement) => {
    buttons.forEach(buttonName => {
      const button = document.getElementById(buttonName) as HTMLDivElement;
      button.classList.remove('active');
    });

    target.classList.add('active');
  }

  return (
    <div id="mainContentContainer">
      <div id="menuBar">
        <div id="menuItemContainer">
          <div id="menu_password" className="menuItem" onClick={(e) => { setCurrentPage(page_p); setActive(e.currentTarget) }}>
            <div className="menuItemImg"></div>
          </div>
          <div id="menu_generator" className="menuItem" onClick={(e) => { setCurrentPage(page_gp); setActive(e.currentTarget) }}>
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