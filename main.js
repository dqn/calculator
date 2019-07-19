'use strict'

const printTree = (node, depth=0) => {
  if (!node) {
    return;
  }

  console.log(new Array(depth).fill().map(_ => '-').join('') + node.value);

  printTree(node.left, depth + 1);
  printTree(node.right, depth + 1);
};

const calcTree = node => {
  if (isNumber(node.value)) {
    return Number(node.value);
  }

  const [v1, v2] = [calcTree(node.left), calcTree(node.right)];

  switch (node.value) {
    case '+': return v1 + v2;
    case '-': return v1 - v2;
    case '*': return v1 * v2;
    case '/': return v1 / v2;
  }
};

const makeNode = (value, left, right) => ({
  value, left, right,
});

const isNumber = text =>
  text.split('').every(c => '0123456789'.includes(c));

const tokenize = text => {
  const tokens = [];
  let temp = '';

  for (const c of text) {
    if (isNumber(c)) {
      temp += c;
      continue;
    }
    tokens.push(temp);
    tokens.push(c);
    temp = '';
  }

  return [...tokens, temp];
};

const term = tokens => {
  if (isNumber(tokens[0])) {
    return makeNode(tokens.shift(), null, null);
  }
  return expr(tokens);
};

const mul = tokens => {
  let node = term(tokens);

  while (true) {
    const token = tokens[0];
    switch (token) {
      case '*':
      case '/':
        tokens.shift();
        node = makeNode(token, node, term(tokens));
        break;
      default:
        return node;
    }
  }
};

const expr = tokens => {
  let node = mul(tokens);

  while (true) {
    const token = tokens[0];
    switch (token) {
      case '+':
      case '-':
        tokens.shift();
        node = makeNode(token, node, mul(tokens));
        break;
      default:
        return node;
    }
  }
};

const execute = text => {
  const tokens = tokenize(text);
  const root = expr(tokens);
  // printTree(root);
  console.log(calcTree(root));
};

const main = argv => {
  if (argv.length !== 3) {
    console.error('Usage: node main.js <expression>');
    return 1;
  }

  execute(argv[2]);
};

if (require.main === module) {
  main(process.argv);
}
