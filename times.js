import uuid from 'uuid-random';

const times = [];

export const getTimes = () => {
  return times;
};

export const addTime = (time) => {
  if (time.trim() === '') return times;

  const newTime = { id: uuid(), time };
  times.push(newTime);

  return times;
};
