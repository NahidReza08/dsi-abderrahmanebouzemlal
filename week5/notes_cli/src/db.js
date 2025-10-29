import fs from 'node:fs/promises';

const DB_path = new URL('../db.json', import.meta.url).pathname;

export const getDB = async () => {
  try {
    const db = await fs.readFile(DB_path, 'utf-8');
    return JSON.parse(db);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const initialDB = { notes: [] };
      await fs.writeFile(DB_path, JSON.stringify(initialDB, null, 2));
      return initialDB;
    } else {
      throw error;
    }
  }
};

export const saveDB = async (db) => {
  await fs.writeFile(DB_path, JSON.stringify(db, null, 2));
  return db;
};

export const insert = async (data) => {
  const db = await getDB();
  db.notes.push(data);
  await saveDB(db);
  return data;
};
