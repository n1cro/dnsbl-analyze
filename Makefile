start:
	docker compose --env-file ./backend/.env.prod up --build -d
	
stop:
	docker-compose down