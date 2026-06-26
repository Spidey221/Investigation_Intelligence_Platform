# Deployment Guide

The Investigation Intelligence Platform has been completely Dockerized for rapid, cross-platform production deployments.

## Prerequisites
- Docker Engine
- Docker Compose

## Production Setup

1. **Clone the repository onto your production server.**
   ```bash
   git clone https://github.com/your-org/iip.git
   cd iip
   ```

2. **Configure Environment Variables**
   ```bash
   cp server/.env.production.example server/.env
   ```
   Open `server/.env` and rigorously set your database credentials, `CLIENT_URL` (your production domain), and importantly, a strong, random `JWT_SECRET`. The application will purposefully crash on startup if these are left undefined.

3. **Deploy using Docker Compose**
   ```bash
   docker compose up --build -d
   ```

### What happens next?
- **PostgreSQL (`db`)** starts up and automatically ingests the schema defined in `server/init.sql`. It exposes itself securely on port 5432 internally.
- **Node.js (`server`)** mounts the environment, establishes a healthy connection to the database via Docker networking (`DB_HOST=db`), and exposes the backend APIs on port 5000. It also mounts persistent volumes for `uploads/` and `logs/`.
- **Nginx (`client`)** builds a highly optimized production static bundle using Vite, then securely serves it via an Nginx alpine container on port 80.

## Troubleshooting

- **Check Backend Logs:** `docker compose logs -f server`
- **Verify Database Connection:** Ensure `DB_HOST=db` inside the `.env` file since Docker resolves the container by its service name.
- **Security Audits:** Check the `server/logs/security.log` file directly on the host to monitor for unauthorized access attempts.
