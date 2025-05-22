import { useState } from "react";
import "./style.css";

interface ViewToolbarProp {
  onEdit: () => void;
  onRevert: () => void;
  onDelete: () => void;
  onSave: () => void;
  editMode: boolean;
}

export const ViewToolbar = (props: ViewToolbarProp) => {
  const [deleteMode, setDeleteMode] = useState(false);

  const toggleEditMode = () => {
    props.onEdit();
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  return (
    <div className="view-toolbar">
      <button onClick={() => props.editMode? props.onRevert() : toggleEditMode()}>{props.editMode ? "Cancel" : "Edit"}</button>
      {props.editMode && (<button onClick={props.onSave}>Save</button>)}
      {deleteMode && (<button onClick={props.onDelete}>Confirm</button>)}
      <button onClick={toggleDeleteMode}>{deleteMode ? "Cancel" : "Delete"}</button>
    </div>
  );
}