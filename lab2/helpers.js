const splitBrackets = (expression, ind) => {
  const initialIndex = ind;
  let split = [];
  let current = [];

  while (ind < expression.length) {
    if (expression[ind].lexeme === '(') {
      const [res, index] = splitBrackets(expression, ind + 1);
      current.push(res);
      ind = index;
      continue;
    } else if (expression[ind].lexeme == ')' && initialIndex != 0) {
      if (initialIndex != 0) {
        ind++;
        break;
      } else {
        continue;
      }
    }

    if (
      expression[ind].lexeme != '+' &&
      (expression[ind].lexeme != '-' || expression[ind].lexeme == '-')
    ) {
      expression[ind].level = initialIndex;
      current.push(expression[ind]);
    } else {
      split.push(current, [expression[ind]]);
      current = [];
    }
    ind++;
  }

  if (current) split.push(current);

  return [split, ind];
};

const formatResult = (nodes) => {
  let allSymbols = 0;
  let returnVal = null;
  for (let a = 0; a < nodes.length; a++) {
    let node = nodes[a];
    if (node.parent == null) returnVal = node;
    allSymbols += node.countSymbols;
  }
  if (returnVal) returnVal.countSymbols = allSymbols;
  return returnVal;
};

const checkSigns = (nodes) => {
  for (let i = 0; i < nodes.length; i++) {
    if (i > 0 && nodes[i].descriptor.token == 'sign' && nodes[i].left == null) {
      let left = nodes[i - 1];
      let j = i;
      while (left.parent != null) {
        j--;
        left = nodes[j - 1];
      }
      nodes[i].left = left;
      left.parent = nodes[i];
    } else if (i > 0 && nodes[i].parent == null) {
      let left = nodes[i - 1];
      nodes[i].parent = left;
      left.right = nodes[i];
    }
  }
  return nodes;
};

const getLeftRightNodes = (nodes) => {
  let indexComp = [];
  let valsLength = 0;
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    valsLength += node.countSymbols;
    indexComp.push.apply(indexComp, new Array(node.countSymbols).fill(i));
  }
  let rootI = Math.floor(valsLength / 2);
  let indexRoot = indexComp[rootI];
  if (nodes[indexRoot].countSymbols > 1) {
    let left_1 = indexComp.lastIndexOf(indexRoot - 1);
    let right_1 = indexComp.indexOf(indexRoot + 1);
    let leftDel = Math.abs(rootI - left_1);
    let rightDel = Math.abs(right_1 - rootI);
    if (leftDel < rightDel) rootI = indexComp[left_1];
    else rootI = indexComp[right_1];
  } else rootI = indexRoot;
  let root = nodes[rootI];
  if (root.descriptor.token != 'sign') {
    rootI++;
    root = nodes[rootI];
  }
  let leftNodes = nodes.slice(0, rootI);
  let rightNodes = nodes.slice(rootI + 1);
  let left = leftNodes.length > 1 ? createTree(leftNodes) : leftNodes[0];
  if (
    root.descriptor.lexeme == '-' &&
    root.descriptor.token == 'sign' &&
    rightNodes.length > 1
  ) {
    let minNode = {
      parent: null,
      descriptor: { token: 'sign', lexeme: '-', level: 0 },
      left: null,
      right: null,
      countSymbols: 1,
    };
    rightNodes.unshift(minNode);
    root.descriptor.lexeme = '+';
  }
  let right = rightNodes.length > 1 ? createTree(rightNodes) : rightNodes[0];

  nodes = [];
  if (left) nodes.push(left);
  if (root) nodes.push(root);
  if (right) nodes.push(right);

  return nodes;
};

const createBaseStructure = (nodes, split) => {
  for (let i = 0; i < split.length; i++) {
    let node = {
      parent: null,
      descriptor: split[i],
      left: null,
      right: null,
      countSymbols: 1,
    };

    if (split[i] instanceof Array) {
      let res = createTree(split[i]);
      if (res) node = res;
    } else if ('parent' in split[i]) node = split[i];
    nodes.push(node);
  }
  return nodes;
};

const formatStructure = (node) => {
  let children = [];
  if (node.right) children.push(formatStructure(node.right));
  if (node.left) children.push(formatStructure(node.left));
  return {
    text: node.descriptor.lexeme,
    children: children,
  };
};

const createTree = (split) => {
  let nodes = [];
  nodes = createBaseStructure(nodes, split);

  if (nodes.length > 3) {
    nodes = getLeftRightNodes(nodes);
  }

  nodes = checkSigns(nodes);

  return formatResult(nodes);
};

const printTree = (tree, depth) => {
  if (depth === 0) {
    console.log('| ' + tree.text);
  } else if (depth === 1) {
    console.log(`|${'────'.repeat(depth)} ${tree.text}`);
  } else {
    console.log(`|${'    '.repeat(depth - 1)} |──── ${tree.text}`);
  }

  if (tree.children) {
    tree.children.forEach((curr) => printTree(curr, depth + 1));
  }
};

module.exports = {
  splitBrackets,
  createTree,
  formatStructure,
  printTree,
};
