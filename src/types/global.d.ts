interface Window {
  darkMode: {
    toggle: () => Promise<void>;
    system: () => Promise<void>;
  };
  passwordEntry: {
    /**
     * Get the index of all entries
     * @returns The index of all entries
     */
    getIndex: () => Promise<Index>;
    /**
     * Get a entry by id
     */
    getEntry: (id: string) => Promise<PasswordEntry>;
    setEntry: (entry: PasswordEntry, category?: string) => Promise<void>;
    /**
     * Add a Entry to the password storage
     * @param entry The entry to add, id will not be read
     * @param category The category to add the entry to, if not provided the entry will be added to the default category
     * @returns The id of the added entry
     */
    addEntry: (entry: PasswordEntry, category?: string) => Promise<string>;
    deleteEntry: (id: string) => Promise<void>;
  };
  masterPassword: {
    /**
     * Get all users
     * @returns A list of all users (Usernames)
     */
    getAllUsers: () => Promise<string[]>;
    /**
     * Create a new user account
     * @param username 
     * @param password 
     * @returns "Success" if the user was created successfully, "User already exists" if the user already exists, "Password does not fullfil requirements" if the password does not fullfil the requirements
     */
    createUser: (username: string, password: string) => Promise<"Success" | "User already exists" | "Password does not fullfil requirements">;
    /**
     * Login to a user account
     * @param username 
     * @param password 
     * @returns true if the login was successful, false if the login was not successful
     */
    login: (username: string, password: string) => Promise<boolean>;
    /**
     * Logout of the current user account
     * @returns 
     */
    logout: () => Promise<void>;
    /**
     * Get the current user account information
     * @returns The current user account information with password set to ""
     */
    info: () => Promise<UserInstance>;
  };
}

interface PasswordEntryDB {
  id: string;
  title: string;
  url: string;
  username: string;
  iv: string;
  password: string;
  notes: string;
  category: string;
  created: Date;
  modified: Date;
  tags: Array<string>;
  synced: any; // TODO: Define Type
}

interface PasswordEntry {
  id?: string;
  title?: string;
  url?: string;
  username?: string;
  password?: string;
  notes?: string;
  category?: string;
  created?: Date;
  modified?: Date;
  tags?: Array<string>;
  synced?: any; // TODO: Define Type
}

interface UserInstance {
  username: string;
  password: string;
  uid: string;
  isLoggedIn: boolean;
}

interface IndexEntry {
  id: string;
  title: string;
  subtitle?: string;
}

interface IndexEntryCategory {
  Titel: string;
  Color?: string;
  entries: Array<IndexEntry>;
}

interface Index {
  [category: string]: IndexEntryCategory;
}