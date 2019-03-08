default: run

run: install
	npm start

install:
	npm i

clean:
	rm -rf ./node_modules

build: install
	npm run build

production: build
	node server.js& http-server build/ -P http://localhost:8080 -p 3000

help:
	@echo "make file for running the application"
	@echo "default = target runs the application"
	@echo "clean = removes the node_modules"
	@echo "install = installs dependencies"