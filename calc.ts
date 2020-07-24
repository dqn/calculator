type TreeNode = {
  value: string;
  left?: TreeNode;
  right?: TreeNode;
};

function isNumber(c: string): boolean {
  return /^\d+$/.test(c);
}

function isSpace(c: string): boolean {
  return c === ' ';
}

function isOperator(c: string): boolean {
  return /^[\+\-\*\/]$/.test(c);
}

function consume(tokens: string[], expect: string) {
  if (tokens[0] !== expect) {
    throw new Error(`${expect} expected, but got ${tokens[0]}.`);
  }
  tokens.shift();
}

function tokenize(str: string): string[] {
  let temp = '';
  const tokens = [];
  for (const c of str) {
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
}

function number(tokens: string[]): TreeNode {
  if (isNumber(tokens[0])) {
    return { value: tokens.shift()! };
  }
  consume(tokens, '(');
  const node = expression(tokens);
  consume(tokens, ')');
  return node;
}

function term(tokens: string[]): TreeNode {
  let node = number(tokens);
  while (true) {
    switch (tokens[0]) {
      case '*':
      case '/':
        node = { value: tokens.shift()!, left: node, right: number(tokens) };
        break;
      default:
        return node;
    }
  }
}

function expression(tokens: string[]): TreeNode {
  let node = term(tokens);
  while (true) {
    switch (tokens[0]) {
      case '+':
      case '-':
        node = { value: tokens.shift()!, left: node, right: term(tokens) };
        break;
      default:
        return node;
    }
  }
}

function printAssembly(node: TreeNode) {
  if (!node.left || !node.right) {
    console.log(`  push ${node.value}`);
    return;
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
      console.log('  cqo');
      console.log(`  idiv rdi`);
      break;
    default:
      throw new Error(`Unknown value ${node.value}.`);
  }

  console.log('  push rax');
}

const main = (argv: string[]) => {
  const tokens = tokenize(argv[2]);
  const node = expression(tokens);

  console.log('.intel_syntax noprefix');
  console.log('.global main');
  console.log('main:');

  printAssembly(node);

  console.log('  pop rax');
  console.log('  ret');
};

main(process.argv);
