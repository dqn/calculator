# calculator

Parse formula and output assembly.

## Usage

```bash
$ docker-compose run calc bash
$ npm run tsc
$ node calc.js 42/(10-3)+12*2 > tmp.s # output assembly
$ gcc -o tmp tmp.s # assemble
$ ./tmp
$ echo $? # => 30
```

## Test

```bash
$ npm run test
```

## License

MIT
