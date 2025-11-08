

run-auth:
	@echo "Starting Hono server..."
	cd auth && bun run dev
run-dc:
	@echo "Starting Docker Compose..."
	docker compose up
