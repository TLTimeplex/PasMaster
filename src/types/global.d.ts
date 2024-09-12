interface Window {
  index: {
    getIndex: () => Promise<Index>;
  };
  darkMode: {
    toggle: () => Promise<void>;
    system: () => Promise<void>;
  };
  passwordEntry: {
    getEntry: (id: string) => Promise<PasswordEntry>;
    setEntry: (entry: PasswordEntry, category?: string) => Promise<void>;
    /**
     * Add a Entry to the password storage
     * @param entry The entry to add, id will not be read
     * @param category The category to add the entry to, if not provided the entry will be added to the default category
     * @returns 
     */
    addEntry: (entry: PasswordEntry, category?: string) => Promise<string>;
    deleteEntry: (id: string) => Promise<void>;
  };
}

interface PasswordEntry {
  id: string;
  title: string;
  url: string;
  username: string;
  password: string;
  notes: string;
}