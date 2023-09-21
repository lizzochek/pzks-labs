const syntaxAnaliser = (tokens) => {
  const errors = [];

  let prevValue = null;

  const leftBrackets = tokens.filter(
    (obj) => obj.token === 'leftBracket'
  ).length;
  const rightBrackets = tokens.filter(
    (obj) => obj.token === 'rightBracket'
  ).length;
  if (leftBrackets !== rightBrackets)
    errors.push(
      `Number of brackets not correct: opening - ${leftBrackets}, closing - ${rightBrackets}`
    );

  for (let i = 0; i < tokens.length; i++) {
    let { token, lexeme } = tokens[i];

    if (!token) errors.push(`Element unidentified at position ${i}`);

    if (token === 'spaces') errors.push(`Please remove space at position ${i}`);

    if (i === 0 && ['*', '/', ')'].some((el) => lexeme.includes(el))) {
      errors.push(`Expression can't start with ${lexeme}`);
    }

    if (i === tokens.length - 1 && (token === 'sign' || lexeme === '(')) {
      errors.push(`Expression can't end with ${lexeme}`);
    }

    if (prevValue) {
      switch (token) {
        case 'sign':
          if (prevValue.token === 'sign')
            errors.push(
              `Can't use ${lexeme} after ${prevValue.lexeme}  at position ${i}`
            );

          if (prevValue.token === 'leftBracket')
            errors.push(
              `Expression in brackets can't start with ${lexeme}  at position ${i}`
            );

          break;
        case 'rightBracket':
          if (prevValue.token === 'leftBracket')
            errors.push(`Can't use empty brackets  at position ${i}`);
          if (prevValue.token === 'sign')
            errors.push(
              `Can't place  ${prevValue.lexeme} before closing bracket at position ${i}`
            );
          break;

        case 'dot':
          if (prevValue.token === 'number') {
            errors.push(`Can't have multiple dots in number at position ${i}`);
          } else {
            errors.push(
              `Dots can't be placed outside numbers at position ${i}`
            );
          }
      }

      if (
        prevValue.token === 'leftBracket' &&
        tokens[i + 1].token === 'rightBracket'
      )
        errors.push(`Can't use brackets for one character`);
    }

    prevValue = tokens[i];
  }

  if (errors.length === 0) return 'No errors found';

  return errors;
};

module.exports = {
  syntaxAnaliser,
};
