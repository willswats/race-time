import uuid from 'uuid-random';

const allRaceResults = [];

export const getAllRaceResults = () => {
  return allRaceResults;
};

export const addRaceResults = (results) => {
  if (results.length === 0) return results;

  const newRaceResults = { id: uuid(), results };
  allRaceResults.push(newRaceResults);

  return allRaceResults;
};
