// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('passwordEntry', {
  getIndex: () => ipcRenderer.invoke('passwordEntry:getIndex'),
  getEntry: (id: string) => ipcRenderer.invoke('passwordEntry:get', id),
  addEntry: (entry: PasswordEntry) => ipcRenderer.invoke('passwordEntry:add', entry),
  updateEntry: (entry: PasswordEntry) => ipcRenderer.invoke('passwordEntry:update', entry),
  deleteEntry: (id: string) => ipcRenderer.invoke('passwordEntry:delete', id),

  addCategory: (category: Category) => ipcRenderer.invoke('passwordEntry:addCategory', category),
  deleteCategory: (id: number) => ipcRenderer.invoke('passwordEntry:deleteCategory', id),
  updateCategory: (id: number, category: Category) => ipcRenderer.invoke('passwordEntry:updateCategory', id, category),
  getAllCategories: () => ipcRenderer.invoke('passwordEntry:getAllCategories'),
  getCategory: (id: number) => ipcRenderer.invoke('passwordEntry:getCategory', id),
})

contextBridge.exposeInMainWorld('masterPassword', {
  getAllUsers: () => ipcRenderer.invoke('masterPassword:getAllUsers'),
  createUser: (username: string, password: string) => ipcRenderer.invoke('masterPassword:createUser', username, password),
  login: (username: string, password: string) => ipcRenderer.invoke('masterPassword:login', username, password),
  logout: () => ipcRenderer.invoke('masterPassword:logout'),
  info: () => ipcRenderer.invoke('masterPassword:info')
})