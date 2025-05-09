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

export async function getRaceResult(raceResultId) {
  const db = await dbConn;
  return db.get(
    `
    SELECT 
      race_result.race_result_id AS raceResultId,
      race_result.race_result_id AS raceResult,
      race_result.race_result_first_name AS raceResultFirstName,
      race_result.race_result_last_name AS raceResultLastName
    FROM race_result 
    WHERE 
      race_result.race_result_id = ?
    `,
    [raceResultId],
  );
}

export async function getAllRaceResults() {
  const db = await dbConn;
  return db.all(
    `
    SELECT 
      race_results.race_results_id AS raceResultsId,
      race_results.race_results_time AS raceResultsTime,
      json_group_array(
        json_object(
            'raceResultId', race_result.race_result_id,
            'raceResult', race_result.race_result
        )
      ) AS raceResults
    FROM race_results 
      INNER JOIN race_result ON race_results.race_result_id = race_result.race_result_id
    GROUP BY
      race_results.race_results_time
    ORDER BY
      race_results.race_results_time desc;
    `,
  );
}

export async function addRaceResults(raceResults) {
  if (raceResults.length === 0) return raceResults;

  const db = await dbConn;
  const raceResultsTime = new Date().toISOString();

  for (const raceResult of raceResults) {
    const raceResultId = uuid();
    await db.run('INSERT INTO race_result VALUES (?, ?, ?, ?)', [
      raceResultId,
      raceResult,
      '',
      '',
    ]);

    const raceResultsId = uuid();
    await db.run('INSERT INTO race_results VALUES (?, ?, ?)', [
      raceResultsId,
      raceResultsTime,
      raceResultId,
    ]);
  }

  return getAllRaceResults();
}

export async function updateRaceResultNames(
  raceResultId,
  raceResultFirstName,
  raceResultLastName,
) {
  if (raceResultId === null) {
    throw new Error('Invalid race result id!');
  } else if (
    raceResultId === null ||
    (raceResultFirstName.length === '' && raceResultLastName === '')
  )
    throw new Error('First name or last name must contain a value!');

  const db = await dbConn;

  await db.run(
    `
    UPDATE race_result
    SET 
      race_result_first_name = (?),
      race_result_last_name = (?)
    WHERE
      race_result_id = (?)
    `,
    [raceResultFirstName, raceResultLastName, raceResultId],
  );

  return getRaceResult(raceResultId);
}
