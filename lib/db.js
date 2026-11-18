import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { SCHEMA } from "./schema.js";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// DB open kiya , foreign keys ON kiya krna pdta hai isme, tables bana diya
const db = new Database(path.join(dataDir, "coy.db"));
db.pragma("foreign_keys = ON");
db.exec(SCHEMA);

export default db;
