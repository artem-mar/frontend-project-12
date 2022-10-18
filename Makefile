install:
	npm ci

lint:
	make -C frontend lint

start-frontend:
	make -C frontend start

start-backend:
	npm start

start:
	make start-backend & make start-frontend