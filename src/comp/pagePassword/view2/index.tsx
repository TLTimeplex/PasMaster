import React, { useState } from "react";
import { ViewToolbar } from "./toolbar";

interface PasswordViewProp {
  entryID: string;

  isNewEntry: boolean;

  onDelete: () => void;
  onSave: () => void;
}

export const PasswordView = (props: PasswordViewProp) => {
  const [entry, setEntry] = useState<PasswordEntry>({});

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
    const entry = await window.passwordEntry.getEntry(id);
    setEntry(entry);
    setTitle(entry.title);
    setUsername(entry.username);
    setPassword(entry.password);
    setUrl(entry.url);
    setNotes(entry.notes);
    setTags(entry.tags);
    setCategory(entry.category);
  }

  React.useEffect(() => {
    if (isInit) return;
    if (props.isNewEntry) {
      setLoading(false);
      setEditMode(true);

      loadCategories();

      setIsInit(true);
      return;
    }
    window.passwordEntry
      .getEntry(props.entryID)
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
  }, [isInit, props.isNewEntry, props.entryID]);

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
    setLoading(true);
    const newEntry: PasswordEntry = {
      id: props.entryID,
      title: titel,
      username: username,
      password: password,
      url: url,
      notes: notes,
      tags: tags,
      category: category,
    };

    if (props.isNewEntry) {
      props.entryID = await window.passwordEntry.addEntry(newEntry);
    } else {
      await window.passwordEntry.updateEntry(newEntry);
    }

    await loadEntry(props.entryID);
    props.onSave()
    setLoading(false);
  }

  const deleteEntry = async () => {
    setLoading(true);
    await window.passwordEntry.deleteEntry(props.entryID);
    props.onDelete();
    setLoading(false);
  }

  return (
    <div className="password-view">
      <div className="password-view-content-container">
        <div className="password-view-content-header">
          <input type="text" value={titel} onChange={(e) => setTitle(e.target.value)} placeholder="Title" readOnly={!editMode} />
        </div>

        <div className="password-view-content-main">
        </div>

        <div className="password-view-content-footer">
        </div>
      </div>
      <ViewToolbar editMode={editMode} onEdit={() => { setEditMode(true) }} onRevert={restoreEntry} onDelete={deleteEntry} onSave={saveEntry} />
    </div>
  );
}