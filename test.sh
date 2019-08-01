#!/bin/bash

try() {
  expected="$1"
  input="$2"

  node calc.js "$input" > tmp.s
  gcc -o tmp tmp.s
  ./tmp

  actual="$?"

  if [ "$actual" = "$expected" ]; then
    echo "$input => $actual"
  else
    echo "$expected expected, but got $actual"
    exit 1
  fi
}

try 0 0
try 42 42
try 21 '5+20-4'
try 30 '24*10/6-10'
try 18 '(2+3)*4-12/(1+5)'

echo OK
