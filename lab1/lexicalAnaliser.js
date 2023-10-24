const {
  getActiveName,
  resetAllRules,
  reservedWords,
  priorities,
} = require('./helpers');
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
              priority: priorities[character] ? priorities[character] : null,
            })
          );
        } else {
          let lexeme = string.substring(i - charsCounter + 1, i);
          let prevToken = tokens[tokens.length - 1];
          if (
            token === 'word' &&
            prevToken?.token === 'word' &&
            prevToken?.lexeme !== 'e'
          ) {
            prevToken.lexeme += lexeme;
          } else {
            tokens.push({
              token,
              lexeme,
              priority: priorities[lexeme] ? priorities[lexeme] : null,
            });
          }
        }

        i--;
      } else {
        tokens.push({
          token: undefined,
          lexeme: string.substring(i, i + 1),
          priority: priorities[string.substring(i, i + 1)]
            ? priorities[string.substring(i, i + 1)]
            : null,
        });
      }
      charsCounter = 0;
      resetAllRules(allRules);
    }
  }

  tokens.forEach((el, index) => (el.position = index));

  return additionalTokens(tokens);
};

const additionalTokens = (tokens) => {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].lexeme === '(' && tokens[i - 1]?.lexeme === ')') {
      tokens.splice(i, 0, { token: 'sign', lexeme: '*', priority: 1 });
    }
    if (
      tokens[i].token === 'word' &&
      reservedWords.includes(tokens[i].lexeme) &&
      tokens[i - 1]?.lexeme === ')'
    ) {
      tokens.splice(i, 0, { token: 'sign', lexeme: '*', priority: 1 });
    }
    if (
      tokens[i].token === 'word' &&
      !reservedWords.includes(tokens[i].lexeme)
    ) {
      if (tokens[i].lexeme.length > 1) {
        let newTokens = [];
        tokens[i].lexeme.split('').forEach((letter, index, arr) => {
          newTokens.push({ token: 'word', lexeme: letter });
          if (index !== arr.length - 1) {
            newTokens.push({ token: 'sign', lexeme: '*', priority: 1 });
          }
        });
        tokens.splice(i, 1, ...newTokens);
      }
      if (
        tokens[i - 1] &&
        !['sign', 'leftBracket'].includes(tokens[i - 1]?.token) &&
        tokens[i - 1]?.lexeme !== '('
      ) {
        tokens.splice(i, 0, { token: 'sign', lexeme: '*', priority: 1 });
      }
      if (
        tokens[i + 1].lexeme === '(' ||
        reservedWords.includes(tokens[i + 1].lexeme)
      )
        tokens.splice(i + 1, 0, { token: 'sign', lexeme: '*', priority: 1 });
    }
  }

  tokens.forEach((el, index) => (el.position = index));
  return tokens;
};

module.exports = {
  lexicalAnaliser,
  additionalTokens,
};
