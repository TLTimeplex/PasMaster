import crypto from "node:crypto";

export class PMUser implements UserInstance {
  username: string;
  password: string;
  uid: string;
  isLoggedIn: boolean;

  constructor(username: string, password: string, uid: string, isLoggedIn: boolean) {
    this.username = username;
    this.password = password;
    this.uid = uid;
    this.isLoggedIn = isLoggedIn;
  }

  generateMasterKey = (iv: crypto.BinaryLike) => {
    if (!this.isLoggedIn) throw new Error("No user logged in");
    return crypto.createCipheriv("aes-256-ctr", this.password, iv);
  }

  generateIV = () => {
    return crypto.randomBytes(16).toString("hex");
  }

  decryptIV = (data: string, iv: crypto.BinaryLike) => {
    if (!this.isLoggedIn) throw new Error("No user logged in");
    return this.generateMasterKey(iv).update(data, "hex", "utf-8");
  }

  decrypt = (data: string, key: crypto.Cipher) => {
    return key.update(data, "hex", "utf-8");
  }

  encryptIV = (data: string, iv: crypto.BinaryLike) => {
    if (!this.isLoggedIn) throw new Error("No user logged in");
    return this.generateMasterKey(iv).update(data, "utf-8", "hex");
  }

  encrypt = (data: string, key: crypto.Cipher) => {
    return key.update(data, "utf-8", "hex");
  }
}

export default PMUser;