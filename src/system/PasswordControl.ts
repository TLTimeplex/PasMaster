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
  const categories = await (await passwordDB.prepare("SELECT * FROM category")).all() as CategoryDB[];
  for (const category of categories) {
    const entries = await (await passwordDB.prepare("SELECT * FROM passwords WHERE category = ? ORDER BY title, username")).all(category.id);
    result[category.id] = {
      titel: category.titel,
      color: category.color,
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
  const decryptedPassword = user.decryptIV(entry.password, entry.iv);
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

export const addEntry = async (passwordDB: Database, user: PMUser, entry: PasswordEntry): Promise<string> => {
  if (!user.isLoggedIn) throw new Error("No user logged in");

  const iv = user.generateIV();

  const id = crypto.randomUUID();
  const title = entry.title || "";
  const url = entry.url || "";
  const username = entry.username || "";
  const password = entry.password != null ? user.encryptIV(entry.password, iv) : "";
  const notes = entry.notes || "";
  const category = entry.category || 0;
  const created = new Date().toISOString();
  const modified = created;
  const tags = entry.tags ? JSON.stringify(entry.tags) : "[]";
  const synced = entry.synced ? JSON.stringify(entry.synced) : "[]";

  await passwordDB.run(`INSERT INTO passwords (id, title, url, username, password, iv, notes, category, created, modified, tags, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, id, title, url, username, password, iv, notes, category, created, modified, tags, synced);

  return id;
}

export const updateEntry = async (passwordDB: Database, user: PMUser, updateEntry: PasswordEntry): Promise<void> => {
  if (!user.isLoggedIn) throw new Error("No user logged in");
  if (!updateEntry.id) throw new Error("No ID provided");

  const id = updateEntry.id;
  const existingEntry = await (await passwordDB.prepare("SELECT * FROM passwords WHERE id = ?")).get(id) as PasswordEntryDB;
  if (!existingEntry) throw new Error("Entry not found");

  const iv = Buffer.from(existingEntry.iv) || user.generateIV();

  const title = updateEntry.title || existingEntry.title || "";
  const url = updateEntry.url || existingEntry.url || "";
  const username = updateEntry.username || existingEntry.username || "";
  const password = updateEntry.password !== null ? user.encryptIV(updateEntry.password, iv) : (existingEntry.password || "");
  const notes = updateEntry.notes || existingEntry.notes || "";
  const category = Number.isInteger(updateEntry.category) ? updateEntry.category : existingEntry.category || 0;
  const created = existingEntry.created;
  const modified = new Date().toISOString();
  const tags = updateEntry.tags != null ? JSON.stringify(updateEntry.tags) : existingEntry.tags || "[]";
  const synced = JSON.stringify(updateEntry.synced || existingEntry.synced || []);

  await passwordDB.run(`UPDATE passwords SET title = ?, url = ?, username = ?, password = ?, iv = ?, notes = ?, category = ?, created = ?, modified = ?, tags = ?, synced = ? WHERE id = ?`, title, url, username, password, iv, notes, category, created, modified, tags, synced, id);
}

export const deleteEntry = async (passwordDB: Database, user: PMUser, id: string): Promise<void> => {
  if (!user.isLoggedIn) throw new Error("No user logged in");
  await passwordDB.run(`DELETE FROM passwords WHERE id = ?`, id);
}

export const deleteCategory = async (passwordDB: Database, user: PMUser, id: number): Promise<void> => {
  if (!user.isLoggedIn) throw new Error("No user logged in");
  if (!id) throw new Error("No ID provided");

  await passwordDB.run(`DELETE FROM category WHERE id = ?`, id);
}

export const addCategory = async (passwordDB: Database, user: PMUser, title: string, color: string): Promise<void> => {
  if (!user.isLoggedIn) throw new Error("No user logged in");

  await passwordDB.run(`INSERT INTO category (titel, color) VALUES (?, ?)`, title, color);
}

export const updateCategory = async (passwordDB: Database, user: PMUser, id: number, title: string, color: string): Promise<void> => {
  if (!user.isLoggedIn) throw new Error("No user logged in");
  if (!id) throw new Error("No ID provided");
  if (id <= 0) throw new Error("ID must be greater than 0");

  await passwordDB.run(`UPDATE category SET titel = ?, color = ? WHERE id = ?`, title, color, id);
}

export const getAllCategories = async (passwordDB: Database, user: PMUser): Promise<CategoryDB[]> => {
  if (!user.isLoggedIn) throw new Error("No user logged in");

  return await (await passwordDB.prepare("SELECT * FROM category")).all() as CategoryDB[];
}

export const getCategory = async (passwordDB: Database, user: PMUser, id: number): Promise<CategoryDB> => {
  if (!user.isLoggedIn) throw new Error("No user logged in");
  if (!id) throw new Error("No ID provided");

  const category = await (await passwordDB.prepare("SELECT * FROM category WHERE id = ?")).get(id) as CategoryDB;
  if (!category) throw new Error("Category not found");

  return category;
}