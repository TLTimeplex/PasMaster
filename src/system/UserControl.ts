import { app } from "electron";
import crypto from "node:crypto";
import sqlite from "sqlite3";
import { Database, open as openDB } from "sqlite";
import bycrypt from "bcrypt";
import fs from "fs";
import { PMUser } from "./User";

export const connectAndCreateIfNotExistsUserDB = async (): Promise<Database> => {
  fs.mkdirSync(`${app.getPath("userData")}/Vault`, { recursive: true });

  const userDB = await openDB({
    filename: `${app.getPath("userData")}/Vault/users.db`,
    driver: sqlite.Database
  });

  await userDB.exec(
    `CREATE TABLE IF NOT EXISTS "users"  (
    "uid"	      TEXT NOT NULL UNIQUE,
	  "username"	TEXT NOT NULL UNIQUE,
	  "password"	TEXT NOT NULL,
	  PRIMARY KEY("username")
    );`);

  return userDB;
}

export const getAllUsers = async (userDB: Database) => {
  const result: string[] = [];
  (await (await userDB.prepare("SELECT username FROM users")).all()).forEach((user: UserInstance) => {
    result.push(user.username);
  });
  return result;
}

export const createUser = async (userDB: Database, user: PMUser, username: string, password: string) => {
  if ((await (await userDB.prepare("SELECT * FROM users WHERE username = ?")).all(username)).length > 0) return "User already exists";
  if (password.length < 8) return "Password does not fullfil requirements";

  const hash = bycrypt.hashSync(password, 12);
  const userID = crypto.randomUUID();
  await userDB.run("INSERT INTO users (uid, username, password) VALUES (?, ?, ?)", userID, username, hash);

  user.username = username;
  user.password = password;
  user.uid = userID;
  user.isLoggedIn = true;

  const passwordDB = await openDB({
    filename: `${app.getPath("userData")}/Vault/${user.uid}.db`,
    driver: sqlite.Database
  });

  await passwordDB.exec(
    `CREATE TABLE IF NOT EXISTS "category"  (
      "id"	      INTEGER NOT NULL UNIQUE,
      "color"	    TEXT NOT NULL,
      "titel"	    TEXT NOT NULL,
      PRIMARY KEY("id" AUTOINCREMENT)
    );`);

  await passwordDB.exec(
    `CREATE TABLE IF NOT EXISTS "passwords"  (
      "id"	      TEXT NOT NULL UNIQUE,
      "title"	    TEXT NOT NULL,
      "url"	      TEXT NOT NULL,
      "username"	TEXT NOT NULL,
      "password"	TEXT NOT NULL,
      "iv"	      TEXT NOT NULL,
      "notes"	    TEXT NOT NULL,
      "category"	TEXT NOT NULL,
      "created"	  TEXT NOT NULL,
      "modified"	TEXT NOT NULL,
      "tags"	    TEXT NOT NULL,
      "synced"	  TEXT NOT NULL,
      PRIMARY KEY("id"),
	    CONSTRAINT passwords_category_FK FOREIGN KEY (category) REFERENCES category(id)
    );`);

  await passwordDB.exec(
    `INSERT INTO category (id, color, titel) VALUES (0, '#ffffff', 'Default');`);

  return "Success";
}

export const login = async (userDB: Database, user: PMUser, username: string, password: string) => {
  if (user.isLoggedIn) return password === user.password;
  const userData = await (await userDB.prepare("SELECT * FROM users WHERE username = ?")).get(username) as UserInstance;
  if (!userData) throw new Error("User does not exist");

  if (!bycrypt.compareSync(password, userData.password)) return false;

  user.username = userData.username;
  user.password = password;
  user.uid = userData.uid;
  user.isLoggedIn = true;

  return true;
}

export const logout = (user: PMUser) => {
  user.username = "";
  user.password = "";
  user.uid = "";
  user.isLoggedIn = false;
}

