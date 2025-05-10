import { useState } from "react";

interface ViewToolbarProp {
  onEdit: () => void;
  onRevert: () => void;
  onDelete: () => void;
  onSave: () => void;
  editMode?: boolean;
}

export const ViewToolbar = (props: ViewToolbarProp) => {
  const [editMode, setEditMode] = useState(props.editMode || false);
  const [deleteMode, setDeleteMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    props.onEdit();
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    props.onDelete();
  };

  return (
    <div className="view-toolbar">
      <button onClick={toggleEditMode}>{editMode ? "Cancel" : "Edit"}</button>
      <button onClick={toggleDeleteMode}>{deleteMode ? "Cancel" : "Delete"}</button>
      <button onClick={props.onSave}>Save</button>
    </div>
  );
}