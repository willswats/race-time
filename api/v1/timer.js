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

export async function getTimer() {
  const db = await dbConn;

  const timer = db.get('SELECT timer_start_date AS timerStartDate FROM timer');
  return timer;
}

export async function addTimer(startDate) {
  const db = await dbConn;

  await db.run('INSERT INTO timer VALUES (?)', [startDate]);

  return getTimer();
}

export async function deleteTimer() {
  const db = await dbConn;

  await db.run('DELETE FROM timer;');

  return getTimer();
}
