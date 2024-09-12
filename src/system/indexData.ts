import fs from 'fs';
import { app } from 'electron';

export type IndexEntry = {
  id: string;
  title: string;
  subtitle?: string;
}

export type IndexEntryCategory = {
  Titel: string;
  Color?: string;
  entries: Array<IndexEntry>;
}

export type Index = {
  [category: string]: IndexEntryCategory;
}

let isInit = false;

function init() {
  if (isInit) return;
  fs.mkdirSync(`${app.getPath("userData")}/Vault`, { recursive: true });
  if (!fs.existsSync(`${app.getPath("userData")}/Vault/index.json`)) {
    fs.writeFileSync(`${app.getPath("userData")}/Vault/index.json`, JSON.stringify({}));
  }
  isInit = true;
}

export function getIndex(): Index {
  init();
  return JSON.parse(fs.readFileSync(`${app.getPath("userData")}/Vault/index.json`).toString());
}

export function setIndex(index: Index) {
  init();
  fs.writeFileSync(`${app.getPath("userData")}/Vault/index.json`, JSON.stringify(index));
}

