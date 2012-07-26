SHELL := /bin/bash

build:
	@interleave build --wrap=amd,commonjs,glob,ender

test:
	@mocha --reporter spec

.PHONY: test