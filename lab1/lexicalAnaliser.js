const { getActiveName, resetAllRules } = require('./helpers');
const {
  spaceMachine,
  signMachine,
  leftBracketMachine,
  rightBracketMachine,
  numberMachine,
  wordMachine,
  dotMachine,
} = require('./stateMachines');

const allRules = [
  wordMachine,
  spaceMachine,
  numberMachine,
  signMachine,
  leftBracketMachine,
  rightBracketMachine,
  dotMachine,
];

const lexicalAnaliser = (string) => {
  const tokens = [];
  let charsCounter = 0;
  for (let i = 0; i <= string.length; i++) {
    charsCounter++;
    let hasActiveMachine = false;
    allRules.forEach((machine) => {
      machine.inputChar(string[i]);
      if (machine.state) {
        hasActiveMachine = true;
      }
    });

    if (!hasActiveMachine) {
      if (charsCounter > 1) {
        let token = getActiveName(allRules);
        let lexeme = string.substring(i - charsCounter + 1, i);
        if (
          (token === 'sign' || token.includes('Bracket')) &&
          token.length > 1
        ) {
          lexeme.split('').map((character) =>
            tokens.push({
              token,
              lexeme: character,
            })
          );
        } else {
          tokens.push({
            token,
            lexeme: string.substring(i - charsCounter + 1, i),
          });
        }

        i--;
      } else {
        tokens.push({
          token: undefined,
          lexeme: string.substring(i, i + 1),
        });
      }
      charsCounter = 0;
      resetAllRules(allRules);
    }
  }

  return tokens;
};

module.exports = {
  lexicalAnaliser,
};
