const { lexicalAnaliser } = require('./lexicalAnaliser');
const { syntaxAnaliser } = require('./syntaxAnaliser');

const string = '-(x1*x2)/(a+b(4c-2.09a(J(4-i)+N*2)+3.1415))mm+1';
const tokens = lexicalAnaliser(string);
const errors = syntaxAnaliser(tokens);
console.log(tokens);
console.log(errors);
