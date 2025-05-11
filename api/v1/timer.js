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

export async function updateTimer(startDate) {
  const db = await dbConn;

  await db.run('UPDATE timer SET timer_start_date = (?)', [startDate]);

  return getTimer();
}
