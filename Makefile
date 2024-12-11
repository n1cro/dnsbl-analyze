start:
	docker compose --env-file ./backend/.env.prod up --build
	
stop:
	docker-compose down