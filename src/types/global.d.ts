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
     * @returns The id of the added entry
     */
    addEntry: (entry: PasswordEntry, category?: string) => Promise<string>;
    deleteEntry: (id: string) => Promise<void>;
  };
  masterPassword: {
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