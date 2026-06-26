# IIP Server

This directory contains the Express.js and PostgreSQL backend for the Investigation Intelligence Platform.

## Architecture
- **Controllers**: Handle incoming HTTP requests and map them to business logic.
- **Routes**: Define API endpoints using Express Router.
- **Database**: PostgreSQL connection pool setup.

## Setup
1. Run `npm install`
2. Copy `.env.example` to `.env` and fill in DB credentials.
3. Run `npm start` to start the server.
