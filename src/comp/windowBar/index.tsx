import "./style.css";

export const WindowBar = () => {
  return (
    <div id="titleBarContainer">
      <div id="titleBar" className=" draggable">
        <span id="title" className="draggable">PasMaster
          <span id="author" className="draggable">by TLTimeplex</span>
        </span>
      </div>
    </div>
  );
};

export default WindowBar;