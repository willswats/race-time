import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function init() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
    verbose: true,
  });
  await db.migrate({ migrationsPath: './migrations-sqlite' });
  return db;
}

const dbConn = init();

export async function getUser(userId) {
  if (userId === null) {
    throw new Error('Invalid user id!');
  }

  const db = await dbConn;

  return db.get(
    `
    SELECT 
      users.user_role AS userRole
    FROM users
    WHERE 
      users.user_id = ?
    `,
    [userId],
  );
}
