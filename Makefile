default: run

run: install
	npm start

install:
	npm i

clean:
	rm -rf ./node_modules

help:
	@echo "make file for running the application"
	@echo "default = target runs the application"
	@echo "clean = removes the node_modules"
	@echo "install = installs dependencies"