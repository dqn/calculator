# calculator

## Initialization
```sh
$ docker-compose up -d
$ docker-compose exec calc bash
# into container
```

## Test
```sh
$ npm run test
```

## Output assembly
```sh
$ node calc.js 42/(10-3)+12*2 > calc.s
```

## Execute assembly
```sh
$ gcc -o calc calc.s
$ ./calc
$ echo $?
# => 30
```
