// Lower weight = served first. Priority categories share weight 1 (fair among themselves,
// ordered by arrival time within that tier) and sit ahead of "normal" citizens at weight 2.
const priorityWeight = {
  senior_disability: 1,
  pregnant: 1,
  time_sensitive: 1,
  normal: 2
};

function sortByPriority(tokens) {
  return tokens.sort((a, b) => {
    const weightDiff = priorityWeight[a.priorityCategory] - priorityWeight[b.priorityCategory];
    if (weightDiff !== 0) return weightDiff;
    return new Date(a.createdAt) - new Date(b.createdAt); // FCFS within the same tier
  });
}

function calculateEstimatedWait(peopleAhead, avgServiceTimeMinutes) {
  return peopleAhead * avgServiceTimeMinutes;
}

// Generates something like "INC-014" - counts ALL tokens ever issued for that service
// and increments. (Previously this counted only today's tokens and reset to -001 daily,
// but tokenNumber is a globally-unique field in the database, so a fresh "-001" on any
// day after the first would always collide with an old token and crash token creation.
// Counting all-time avoids that collision permanently, at the cost of not resetting to
// -001 each morning - numbers just keep climbing, which is fine for a demo/prototype.)
async function generateTokenNumber(Token, serviceCode) {
  const countAllTime = await Token.countDocuments({
    serviceType: serviceCode
  });

  const nextNumber = countAllTime + 1;
  return `${serviceCode}-${String(nextNumber).padStart(3, '0')}`;
}

module.exports = { sortByPriority, calculateEstimatedWait, generateTokenNumber };