class StateMachine {
  constructor(name, rules) {
    this.prevState = { name: 'begin' };
    this.state = { name: 'begin' };
    this.rules = rules;
    this.name = name;
  }

  inputChar(char) {
    this.prevState = this.state;
    if (this.state) {
      this.state = this.rules[this.state.name](char);
    }
  }

  resetState() {
    this.prevState = { name: 'begin' };
    this.state = { name: 'begin' };
  }
}

const wordMachine = new StateMachine('word', {
  begin: (char) => {
    if (/[a-z]/i.test(char)) {
      return { name: 'begin' };
    }
  },
});

const spaceMachine = new StateMachine('spaces', {
  begin: (char) => {
    if (char === ' ') {
      return { name: 'begin' };
    }
  },
});

const signMachine = new StateMachine('sign', {
  begin: (char) => {
    if (/[\/\+\-\*]/i.test(char)) {
      return { name: 'begin' };
    }
  },
  end: () => undefined,
});

const leftBracketMachine = new StateMachine('leftBracket', {
  begin: (char) => {
    if ('('.includes(char)) {
      return { name: 'begin' };
    }
  },
});

const rightBracketMachine = new StateMachine('rightBracket', {
  begin: (char) => {
    if (')'.includes(char)) {
      return { name: 'begin' };
    }
  },
});

const numberMachine = new StateMachine('number', {
  begin: (char) => {
    if (/[0-9]/.test(char)) {
      return { name: 'num' };
    }
  },
  num: (char) => {
    if (/[0-9]/.test(char)) {
      return { name: 'num' };
    } else if (char === '.') {
      return { name: 'dot', notEnd: true };
    }
  },
  dot: (char) => {
    if (/[0-9]/.test(char)) {
      return { name: 'dot' };
    }
  },
});

const dotMachine = new StateMachine('dot', {
  begin: (char) => {
    if (char === '.') {
      return { name: 'begin' };
    }
  },
});

module.exports = {
  spaceMachine,
  signMachine,
  leftBracketMachine,
  rightBracketMachine,
  numberMachine,
  wordMachine,
  dotMachine,
};
