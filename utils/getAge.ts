const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

export const getAge = (birthday: string) => {
  const dateParts = birthday.split('.')!;
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const year = parseInt(dateParts[2], 10);
  const birthDate = new Date(year, month - 1, day);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthName = months[birthDate.getMonth()];
  return `${day} ${monthName}, ${age}`;
};
