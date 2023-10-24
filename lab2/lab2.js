const { treeBuilder } = require('./tree-builder');
const { lexicalAnaliser } = require('../lab1/lexicalAnaliser');
const { printTree } = require('./helpers');

const expression = 'a/b/c/d/e/f';
// 'a/b+c/d+(e/f)';
// '(A+B)+C/D+G+(K/L+M+N)';
//
// '-(a*b)/(c+d(4e-2.09f(g(4-h)+i*2)+3.1415))(k+l)+1'
// 'A+C/D+(M+K)'
const analizedExpression = lexicalAnaliser(expression);
const tree = treeBuilder(analizedExpression);
tree instanceof Object ? printTree(tree, 0) : console.log(tree);
