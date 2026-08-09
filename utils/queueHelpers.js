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

// Generates something like "INC-014" - counts today's tokens for that service and increments.
async function generateTokenNumber(Token, serviceCode) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const countToday = await Token.countDocuments({
    serviceType: serviceCode,
    createdAt: { $gte: startOfToday }
  });

  const nextNumber = countToday + 1;
  return `${serviceCode}-${String(nextNumber).padStart(3, '0')}`;
}

module.exports = { sortByPriority, calculateEstimatedWait, generateTokenNumber };
