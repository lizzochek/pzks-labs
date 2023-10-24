function getActiveName(machinesList) {
  for (let i = 0; i < machinesList.length; i++) {
    if (machinesList[i].prevState && !machinesList[i].prevState.notEnd) {
      return machinesList[i].name;
    }
  }
}

function resetAllRules(machinesList) {
  machinesList.forEach((item) => {
    item.resetState();
  });
}

const reservedWords = [
  'sin',
  'cos',
  'tan',
  'ctg',
  'pi',
  'sqrt',
  'acos',
  'asin',
  'e',
  'log',
  'lg',
  'ln',
];

const priorities = {
  '*': 1,
  '/': 1,
  '+': 2,
  '-': 2,
};

module.exports = {
  getActiveName,
  resetAllRules,
  reservedWords,
  priorities,
};
