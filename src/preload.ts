// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('index', {
  getIndex: () => ipcRenderer.invoke('index:get'),
})

contextBridge.exposeInMainWorld('passwordEntry', {
  getEntry: (id: string) => ipcRenderer.invoke('passwordEntry:get', id),
  setEntry: (entry: PasswordEntry, category?: string) => ipcRenderer.invoke('passwordEntry:set', entry, category),
  addEntry: (entry: PasswordEntry, category?: string) => ipcRenderer.invoke('passwordEntry:add', entry, category),
  deleteEntry: (id: string) => ipcRenderer.invoke('passwordEntry:delete', id)
})