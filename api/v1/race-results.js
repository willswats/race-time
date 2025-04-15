import uuid from 'uuid-random';
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

export const getAllRaceResults = async () => {
  const db = await dbConn;
  return db.all('SELECT * FROM race_result ORDER BY race_result_time');
};

export const addRaceResults = async (raceResults) => {
  if (raceResults.length === 0) return raceResults;

  const db = await dbConn;
  const currentTime = new Date().toISOString();
  for (const raceResult of raceResults) {
    const id = uuid();
    await db.run('INSERT INTO race_result VALUES (?, ?, ?)', [
      id,
      currentTime,
      raceResult,
    ]);
  }

  return getAllRaceResults();
};
