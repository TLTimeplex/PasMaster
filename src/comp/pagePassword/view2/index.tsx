import React, { useState } from "react";
import { ViewToolbar } from "./toolbar";
import { TextInput } from "./TextInput";
import "./style.css";
import { CategorySelect } from "./CategorySelect";

const MAX_RETRIES = 5;

interface PasswordViewProp {
  entryID: string;

  isNewEntry: boolean;

  onDelete: () => void;
  onSave: () => void;
}

export const PasswordView = (props: PasswordViewProp) => {
  const [entry, setEntry] = useState<PasswordEntry>({});

  const [id, setID] = useState<string>(props.entryID);
  const [titel, setTitle] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [category, setCategory] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isInit, setIsInit] = useState(false);

  const [editMode, setEditMode] = useState(props.isNewEntry);

  const [categories, setCategories] = useState<CategoryDB[]>([]);

  const loadCategories = async () => {
    const categories = await window.passwordEntry.getAllCategories();
    setCategories(categories);
  }

  const loadEntry = async (id: string) => {
    setLoading(true);

    let entry = {} as PasswordEntry;

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        entry = await window.passwordEntry.getEntry(id);
        break;
      } catch (e) {
        if (i === MAX_RETRIES - 1) {
          setError("Failed to load entry");
          setLoading(false);
          return;
        }
        setError("Failed to load entry, retrying..." + (i + 1) + "/" + MAX_RETRIES);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setEntry(entry);
    setID(entry.id);
    setTitle(entry.title);
    setUsername(entry.username);
    setPassword(entry.password);
    setUrl(entry.url);
    setNotes(entry.notes);
    setTags(entry.tags);
    setCategory(entry.category);

    setLoading(false);
  }

  React.useEffect(() => {
    if (isInit) return;

    loadCategories();

    if (props.isNewEntry) {
      setLoading(false);
      setEditMode(true);

      setIsInit(true);
      return;
    }

    window.passwordEntry
      .getEntry(id || props.entryID)
      .then((entry) => {
        setEntry(entry);
        setTitle(entry.title);
        setUsername(entry.username);
        setPassword(entry.password);
        setUrl(entry.url);
        setNotes(entry.notes);
        setTags(entry.tags);
        setCategory(entry.category);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    setIsInit(true);
  }, [isInit, props.isNewEntry, props.entryID, id]);

  const restoreEntry = () => {
    setTitle(entry.title);
    setUsername(entry.username);
    setPassword(entry.password);
    setUrl(entry.url);
    setNotes(entry.notes);
    setTags(entry.tags);
    setCategory(entry.category);

    setEditMode(false);
  }

  const saveEntry = async () => {
    if (!editMode) return;

    setEditMode(false);
    setLoading(true);
    const newEntry: PasswordEntry = {
      id: id,
      title: titel,
      username: username,
      password: password,
      url: url,
      notes: notes,
      tags: tags,
      category: category,
    };

    let newID = id;

    if (props.isNewEntry) {
      newID = await window.passwordEntry.addEntry(newEntry);
      setID(newID);
    } else {
      await window.passwordEntry.updateEntry(newEntry);
    }

    await loadEntry(newID);
    props.onSave()
    setLoading(false);
  }

  const deleteEntry = async () => {
    setLoading(true);
    await window.passwordEntry.deleteEntry(id);
    props.onDelete();
    setLoading(false);
  }

  return (
    <div className="password-view">
      <div className="password-view-content-container">
        <div className="password-view-content-header">
          <input className="password-view-title" type="text" value={titel} onChange={(e) => setTitle(e.target.value)} placeholder="Title" readOnly={!editMode} />
        </div>

        <div className="password-view-content-main">
          {loading && <div className="password-view-loading">Loading...</div>}
          {error && <div className="password-view-error">{error}</div>}
          {!loading && !error && (
            <>
              <TextInput type="text" value={username} onInputChange={(value) => setUsername(value)} label="Username" readOnly={!editMode} />
              <TextInput type="password" value={password} onInputChange={(value) => setPassword(value)} label="Password" readOnly={!editMode} />
              <TextInput type="text" value={url} onInputChange={(value) => setUrl(value)} label="URL" readOnly={!editMode} />
              <TextInput type="text" value={notes} onInputChange={(value) => setNotes(value)} label="Notes" readOnly={!editMode} />
              {editMode && (
                <>
                  <TextInput type="text" value={tags.join(",")} onInputChange={(value) => setTags(value.split(","))} label="Tags" readOnly={!editMode} />
                  <CategorySelect 
                    categories={categories}
                    selectedCategory={category}
                    onCategoryChange={(value) => setCategory(value.id)}
                    readOnly={!editMode}
                  />
                </>
              )}
            </>
          )}
        </div>

        <div className="password-view-content-footer">
          <div className="password-view-last-modified">
            {!props.isNewEntry && entry?.modified && entry?.modified.getFullYear() +
              "-" +
              String(entry?.modified.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(entry?.modified.getDate()).padStart(2, "0") +
              " " +
              String(entry?.modified.getHours()).padStart(2, "0") +
              ":" +
              String(entry?.modified.getMinutes()).padStart(2, "0")}
          </div>
        </div>
      </div>
      <ViewToolbar editMode={editMode} onEdit={() => { setEditMode(true); loadCategories(); }} onRevert={restoreEntry} onDelete={deleteEntry} onSave={saveEntry} />
    </div>
  );
}