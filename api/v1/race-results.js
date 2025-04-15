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
  return db.all(
    `
    SELECT 
      race_results.race_results_id AS raceResultsId,
      race_results.race_results_time AS raceResultsTime,
      json_group_array (race_result.race_result) AS raceResults 
    FROM race_results 
      INNER JOIN race_result ON race_results.race_result_id = race_result.race_result_id
    GROUP BY
      race_results.race_results_time
    ORDER BY
      race_results.race_results_time desc;
    `,
  );
};

export const addRaceResults = async (raceResults) => {
  if (raceResults.length === 0) return raceResults;

  const db = await dbConn;
  const raceResultsTime = new Date().toISOString();

  for (const raceResult of raceResults) {
    const raceResultId = uuid();
    await db.run('INSERT INTO race_result VALUES (?, ?)', [
      raceResultId,
      raceResult,
    ]);

    const raceResultsId = uuid();
    await db.run('INSERT INTO race_results VALUES (?, ?, ?)', [
      raceResultsId,
      raceResultsTime,
      raceResultId,
    ]);
  }

  return getAllRaceResults();
};
