interface Window {
  darkMode: {
    toggle: () => Promise<void>;
    system: () => Promise<void>;
  };
  passwordEntry: {
    /**
     * Get all password entries
     * @returns A list of all password entries
     */
    getIndex: () => Promise<Index>;
    /**
     * Get a password entry by id
     * @param id The id of the password entry
     * @returns The password entry with the given id
     */
    getEntry: (id: string) => Promise<PasswordEntry>;
    /**
     * Add a password entry
     * @param entry The password entry to add
     * @returns The id of the added password entry
     */
    addEntry: (entry: PasswordEntry) => Promise<void>;
    /**
     * Update a password entry
     * @param entry The password entry to update
     * @returns The id of the updated password entry
     */
    updateEntry: (entry: PasswordEntry) => Promise<void>;
    /**
     * Delete a password entry by id
     * @param id The id of the password entry to delete
     * @returns The id of the deleted password entry
     */
    deleteEntry: (id: string) => Promise<void>;
    /**
     * Add a category
     * @param category The category to add
     * @returns The id of the added category
     */
    addCategory: (category: Category) => Promise<void>;
    /**
     * Delete a category by id
     * @param id The id of the category to delete
     * @returns The id of the deleted category
     */
    deleteCategory: (id: number) => Promise<void>;
    /**
     * Update a category by id
     * @param id The id of the category to update
     * @param category The category to update
     * @returns The id of the updated category
     */
    updateCategory: (id: number, category: Category) => Promise<void>;
    /**
     * Get all categories
     * @returns A list of all categories
     */
    getAllCategories: () => Promise<CategoryDB[]>;
    /**
     * Get a category by id
     * @param id The id of the category to get
     * @returns The category with the given id
     */
    getCategory: (id: number) => Promise<CategoryDB>;
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
  category: number;
  created: Date;
  modified: Date;
  tags: Array<string>;
  synced: Array<SyncedConnection>;
}

interface SyncedConnection {
  // TODO: Define Type
  ip: string;
  port: number;
}

interface PasswordEntry {
  id?: string;
  title?: string;
  url?: string;
  username?: string;
  password?: string;
  notes?: string;
  category?: number;
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

interface IndexEntryCategory extends Category {
  entries: Array<IndexEntry>;
}

interface CategoryDB extends Category {
  id: number;
}

interface Category {
  titel: string;
  color?: string;
}

interface Index {
  [categoryID: number]: IndexEntryCategory;
}