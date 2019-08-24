'use strict'

const isNumber = c =>
  /\d+/.test(c);

const isSpace = c =>
  (c === ' ');

const isOperator = c =>
  /[\+\-\*\/]/.test(c);

const consume = (tokens, expect) => {
  if (tokens[0] !== expect) {
    throw new Error(`${expect} expected, but got ${tokens[0]}.`)
  }
  tokens.shift();
};

const tokenize = string => {
  let temp = '';
  const tokens = [];
  for (const c of string) {
    if (isNumber(c)) {
      temp += c;
      continue;
    }
    if (isSpace(c)) {
      continue;
    }
    if (temp) {
      tokens.push(temp);
      temp = '';
    }
    tokens.push(c);
  }
  return [...tokens, temp];
};

const number = tokens => {
  if (isNumber(tokens[0])) {
    return { value: Number(tokens.shift()) };
  }
  consume(tokens, '(');
  const node = expression(tokens);
  consume(tokens, ')');
  return node;
};

const term = tokens => {
  let node = number(tokens);
  while (true) {
    switch (tokens[0]) {
    case '*':
    case '/':
      node = { value: tokens.shift(), left: node, right: number(tokens) };
      break;
    default:
      return node;
    }
  }
};

const expression = tokens => {
  let node = term(tokens);
  while (true) {
    switch (tokens[0]) {
    case '+':
    case '-':
      node = { value: tokens.shift(), left: node, right: term(tokens) };
      break;
    default:
      return node;
    }
  }
};

const printAssembly = node => {
  if (!node.left || !node.right) {
    console.log(`  push ${node.value}`);
    return
  }

  printAssembly(node.left);
  printAssembly(node.right);

  console.log(`  pop rdi`);
  console.log(`  pop rax`);

  switch (node.value) {
    case '+':
      console.log(`  add rax, rdi`);
      break;
    case '-':
      console.log(`  sub rax, rdi`);
      break;
    case '*':
      console.log(`  imul rax, rdi`);
      break;
    case '/':
      console.log('  cqo')
      console.log(`  idiv rdi`);
      break;
    default:
      throw new Error(`Unknown value ${node.value}.`);
  }

  console.log('  push rax');
};

const main = argv => {
  const tokens = tokenize(argv[2]);
  const node = expression(tokens);

  console.log('.intel_syntax noprefix');
  console.log('.global main');
  console.log('main:');

  printAssembly(node);

  console.log('  pop rax');
  console.log('  ret');
};

if (require.main === module) {
  main(process.argv);
}
