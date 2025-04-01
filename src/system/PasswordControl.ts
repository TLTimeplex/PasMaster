import { PMUser } from "./User";
import { open as openDB, Database } from "sqlite";
import sqlite from "sqlite3";
import { app } from "electron";
import crypto from "node:crypto";

export const connectPasswordDB = async (user: PMUser): Promise<Database> => {
  if (!user.isLoggedIn) throw new Error("No user logged in");
  return await openDB({
    filename: `${app.getPath("userData")}/Vault/${user.uid}.db`,
    driver: sqlite.Database
  });
}

export const getIndex = async (passwordDB: Database): Promise<Index> => {
  const result: Index = {};
  const categories = await (await passwordDB.prepare("SELECT * FROM category")).all();
  for (const category of categories) {
    const entries = await (await passwordDB.prepare("SELECT * FROM passwords WHERE category = ?")).all(category.name);
    result[category.name] = {
      Titel: category.titel,
      Color: category.color,
      entries: entries.map((entry: PasswordEntry) => ({
        id: entry.id,
        title: entry.title,
        subtitle: entry.username
      }))
    }
  }
  return result;
}

export const getEntry = async (passwordDB: Database, user: PMUser, id: string): Promise<PasswordEntry> => {
  const entry = await (await passwordDB.prepare("SELECT * FROM passwords WHERE id = ?")).get(id);
  if (!entry) throw new Error("Entry not found");
  const decryptedPassword = user.decrypt(entry.password, entry.iv);
  return {
    id: entry.id,
    title: entry.title,
    url: entry.url,
    username: entry.username,
    password: decryptedPassword,
    notes: entry.notes,
    category: entry.category,
    created: new Date(entry.created),
    modified: new Date(entry.modified),
    tags: JSON.parse(entry.tags),
    synced: JSON.parse(entry.synced)
  };
}

export const addEntry = async (passwordDB: Database, user: PMUser, entry: PasswordEntry): Promise<void> => {
  if (!user.isLoggedIn) throw new Error("No user logged in");

  const iv = user.generateIV();

  const id = crypto.randomUUID();
  const title = entry.title || "";
  const url = entry.url || "";
  const username = entry.username || "";
  const password = entry.password !== null ? user.encryptIV(entry.password, iv) : "";
  const notes = entry.notes || "";
  const category = entry.category || "default";
  const created = new Date().toISOString();
  const modified = created;
  const tags = JSON.stringify(entry.tags);
  const synced = JSON.stringify(entry.synced);

  await passwordDB.run(`INSERT INTO passwords (id, title, url, username, password, iv, notes, category, created, modified, tags, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, id, title, url, username, password, iv, notes, category, created, modified, tags, synced);
}