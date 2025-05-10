import React, { useState } from "react";
import "./style.css";

interface PasswordViewProp {
  entryID: string;
  onDelete: () => void;
}

export const PasswordView = (props: PasswordViewProp) => {
  const [entry, setEntry] = useState<PasswordEntry>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isInit, setIsInit] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const [categories, setCategories] = useState<CategoryDB[]>([]);

  const [backupEntry, setBackupEntry] = useState<PasswordEntry>(null);

  React.useEffect(() => {
    if (isInit) return;
    window.passwordEntry
      .getEntry(props.entryID)
      .then((entry) => {
        setEntry(entry);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    setIsInit(true);
  }, [isInit, props.entryID]);

  // TODO: Add animation when finished loading
  const setUserClipboard = (textEntry: string) => {
    navigator.clipboard.writeText(textEntry).then(
      () => {
        console.log("Copied to clipboard: " + textEntry);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  // TODO: Add Crtl + S to do the same as the save button
  const toggleEditMode = async (cancel?: boolean) => {
    if (!editMode) {
      setBackupEntry(entry);
      setCategories(await window.passwordEntry.getAllCategories());
      setEditMode(true);
      return;
    }

    if (cancel) {
      setEntry(backupEntry);
      setEditMode(false);
      /** TODO: Force Reload */
      return;
    }

    setEditMode(false);
    setLoading(true);

    try {
      console.log("EntryS", entry);
      await window.passwordEntry.updateEntry(entry);
      setIsInit(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async () => {
    if (!deleteMode) return;
    setLoading(true);
    try {
      await window.passwordEntry.deleteEntry(entry.id);
      setLoading(false);
      props.onDelete();
      return;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  console.log("Entry", entry);

  return (
    <div className="viewContainerWrapper">
      <div className="viewContainer">
        <input
          className="viewTitle"
          defaultValue={entry?.title}
          id="title"
          type="text"
          readOnly={!editMode}
          onChange={(e) => {
            setEntry({ ...entry, title: e.target.value });
          }}
        />
        <div className="viewContentContainer">
          {
            loading && <div className="viewLoading">Loading...</div>
            /* TODO: Add loading animation? */
          }
          {error && <div className="viewError">{error}</div>}
          {!loading && !error && (
            <div className="viewContent">
              <div className="viewItemField">
                <label className="viewContentTitle" htmlFor="url">
                  URL
                </label>
                <input
                  className="viewContentInput"
                  id="url"
                  type="text"
                  defaultValue={entry?.url}
                  readOnly={!editMode}
                  onClick={() => setUserClipboard(entry?.url)}
                  onChange={(e) => {
                    setEntry({ ...entry, url: e.target.value });
                  }}
                />
              </div>

              <div className="viewItemField">
                <label className="viewContentTitle" htmlFor="username">
                  Username
                </label>
                <input
                  className="viewContentInput"
                  id="username"
                  type="text"
                  defaultValue={entry?.username}
                  readOnly={!editMode}
                  onClick={() => setUserClipboard(entry?.username)}
                  onChange={(e) => {
                    setEntry({ ...entry, username: e.target.value });
                  }}
                />
              </div>

              <div className="viewItemField">
                <label className="viewContentTitle" htmlFor="password">
                  Password
                </label>
                <input
                  className="viewContentInput"
                  id="password"
                  type={editMode ? "text" : "password"}
                  defaultValue={entry?.password}
                  readOnly={!editMode}
                  onClick={() => setUserClipboard(entry?.password)}
                  onChange={(e) => {
                    setEntry({ ...entry, password: e.target.value });
                  }}
                />
              </div>

              {/** TODO: Remove resizing? */}
              <div className="viewItemField">
                <label className="viewContentTitle" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  className="viewContentInput"
                  id="notes"
                  defaultValue={entry?.notes}
                  readOnly={!editMode}
                  onChange={(e) => {
                    setEntry({ ...entry, notes: e.target.value });
                  }}
                />
              </div>

              {editMode && (
                <>
                  <div className="viewItemField">
                    <label className="viewContentTitle" htmlFor="tags">
                      Tags
                    </label>
                    <input
                      className="viewContentInput"
                      id="tags"
                      type="text"
                      defaultValue={entry?.tags.join(", ")}
                      readOnly={!editMode}
                      onChange={(e) => {
                        setEntry({
                          ...entry,
                          tags: e.target.value.split(",").map((tag) => tag.trim()),
                        });
                      }}
                    />
                  </div>

                  <div className="viewItemField">
                    <label className="viewContentTitle" htmlFor="category">
                      Category
                    </label>
                    <select
                      className="viewContentInput"
                      id="category"
                      defaultValue={entry?.category}
                      onChange={(e) => {
                        setEntry({
                          ...entry,
                          category: parseInt(e.target.value),
                        });
                      }}
                    >
                      {categories.map((cat) => {
                        return (
                          <option key={cat.id} value={cat.id}>
                            {cat.titel}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <h3 className="viewSubTitle">
          {entry?.modified.getFullYear() +
            "-" +
            String(entry?.modified.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(entry?.modified.getDate()).padStart(2, "0") +
            " " +
            String(entry?.modified.getHours()).padStart(2, "0") +
            ":" +
            String(entry?.modified.getMinutes()).padStart(2, "0")}
        </h3>
      </div>
      <div className="viewToolbar">
        <div className="viewToolbarItemContainer">
          <div className="viewToolbarItem" onClick={() => toggleEditMode()}>
            {editMode ? "Save" : "Edit"}
          </div>
          {editMode && (
            <div
              className="viewToolbarItem"
              onClick={() => toggleEditMode(true)}
            >
              Cancel
            </div>
          )}
        </div>
        <div className="viewToolbarItemContainer">
          <div
            className="viewToolbarItem"
            onClick={() => setDeleteMode(!deleteMode)}
          >
            {deleteMode ? "Cancel" : "Delete"}
          </div>
          {deleteMode && (
            <div className="viewToolbarItem" onClick={() => deleteEntry()}>
              Confirm
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
