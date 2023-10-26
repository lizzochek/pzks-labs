const { splitBrackets, createTree, formatStructure } = require('./helpers');

const treeBuilder = (expression) => {
  try {
    const signs = expression.filter((el) => el.token === 'sign');
    const areAllDivide = signs.every((el) => el.lexeme === '/');
    const areAllMinus = signs.every((el) => el.lexeme === '-');
    if (areAllDivide || areAllMinus) {
      const firstSign = expression.find((el) => el.token === 'sign');
      expression.splice(firstSign.position + 1, 0, {
        token: 'leftBracket',
        lexeme: '(',
        priority: null,
      });
      expression.push({ token: 'rightBracket', lexeme: ')', priority: null });
      expression.forEach((el, ind) => (el.position = ind));
      signs.forEach((sign, ind) => {
        if (ind > 0)
          expression[sign.position].lexeme = areAllDivide ? '*' : '+';
      });
    }

    const [split] = splitBrackets(expression, 0);
    const tree = createTree(split);
    const formattedStructure = formatStructure(tree);
    console.dir(formattedStructure, { depth: 50 });
    return formattedStructure;
  } catch (err) {
    console.log('Oops! Something went wrong!');
  }
};

module.exports = { treeBuilder };
