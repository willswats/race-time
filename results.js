import uuid from 'uuid-random';

const allResults = [];

export const getAllResults = () => {
  return allResults;
};

export const addResults = (results) => {
  if (results.length === 0) return results;

  const newResult = { id: uuid(), results };
  allResults.push(newResult);

  return allResults;
};
