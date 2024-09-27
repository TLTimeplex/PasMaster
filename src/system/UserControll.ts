import { app } from "electron";
import crypto from "node:crypto";
import sqlite from "sqlite3";
import { Database, open as openDB } from "sqlite";
import bycrypt from "bcrypt";

interface User {
  username: string;
  password: string;
}

export let user: string;
let userPassword: string;

let userDB: Database;

const initDB = async () => {
  if (userDB) return;
  userDB = await openDB({
    filename: `${app.getPath("userData")}/Vault/users.db`,
    driver: sqlite.Database
  });
  await userDB.exec("CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)");
}

export const getAllUsers = async () => {
  await initDB();
  const result: string[] = [];
  (await (await userDB.prepare("SELECT username FROM users")).all()).forEach((user: User) => {
    result.push(user.username);
  });
  return result;
}

export const createUser = async (username: string, password: string) => {
  await initDB();
  if ((await (await userDB.prepare("SELECT * FROM users WHERE username = ?")).all(username)).length > 0) return "User already exists";
  if (password.length < 8) return "Password does not fullfil requirements";

  const hash = bycrypt.hashSync(password, 12);
  await userDB.run("INSERT INTO users (username, password) VALUES (?, ?)", username, hash);

  user = username;
  userPassword = password;

  return "Success";
}

export const login = async (username: string, password: string) => {
  if (userPassword) return bycrypt.compareSync(password, userPassword);
  await initDB();
  const userData = await (await userDB.prepare("SELECT * FROM users WHERE username = ?")).get(username) as User;
  if (!userData) throw new Error("User does not exist");

  if (!bycrypt.compareSync(password, userData.password)) return false;

  user = username;
  userPassword = password;

  return true;
}

export const createMasterKey = (iv: crypto.BinaryLike) => {
  return crypto.createCipheriv("aes-256-ctr", Buffer.from(userPassword), iv);
}

export const generateIV = () => {
  return crypto.randomBytes(16);
}

export const decrypt = (data: string, iv: crypto.BinaryLike) => {
  if (!userPassword) throw new Error("No user logged in");
  return createMasterKey(iv).update(data, "hex", "utf-8");
}

export const encrypt = (data: string, iv: crypto.BinaryLike) => {
  if (!userPassword) throw new Error("No user logged in");
  return createMasterKey(iv).update(data, "utf-8", "hex");
}

export const decryptBulk = (data: string, key: crypto.Cipher) => {
  return key.update(data, "hex", "utf-8");
}

export const encryptBulk = (data: string, key: crypto.Cipher) => {
  return key.update(data, "utf-8", "hex");
}