const { splitBrackets, createTree, formatStructure } = require('./helpers');

const treeBuilder = (expression) => {
  try {
    const signs = expression.filter((el) => el.token === 'sign');
    const areAllDivide = signs.every((el) => el.lexeme === '/');
    const areAllMinus = signs.every((el) => el.lexeme === '-');
    if (areAllDivide || areAllMinus)
      return `Oops! Expression cannot contain only / or -. Please change at least ${Math.floor(
        expression.length / 4
      )} signs`;

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
