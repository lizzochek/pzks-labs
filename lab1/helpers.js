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

module.exports = {
  getActiveName,
  resetAllRules,
};
