'use strct'

const isNumber = c =>
	/\d+/.test(c);

const isBlank = c =>
	(c === ' ');

const tokenize = string => {
	let temp = '';
	const tokens = [];
	for (const c of string) {
		if (isNumber(c)) {
			temp += c;
			continue;
		}
		if (isBlank(c)) {
			continue;
		}
		tokens.push(temp);
		tokens.push(c);
		temp = '';
	}
	return [...tokens, temp];
};

const number = tokens => {
	return { value: Number(tokens.shift()) };
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
