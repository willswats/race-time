import uuid from 'uuid-random';

const allRaceResults = [];

export const getAllRaceResults = () => {
  return allRaceResults;
};

export const addRaceResults = (raceResults) => {
  if (raceResults.length === 0) return raceResults;

  const newRaceResults = {
    id: uuid(),
    date: new Date().toLocaleString('UK'),
    results: raceResults,
  };
  allRaceResults.push(newRaceResults);

  return allRaceResults;
};
