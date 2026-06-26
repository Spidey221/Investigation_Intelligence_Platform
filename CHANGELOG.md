# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.3.0] - Automated Entity Extraction
### Added
- Automated `entityExtractor` service relying purely on Regex.
- Real-time synchronous detection of Emails, Phones, URLs, Domains, IPs, Usernames, Hashtags, and UPI IDs.
- Normalization module to trim spaces, lowercase strings, and standardized phone numbers.
- `entities` database table containing extraction timestamp, confidence score, and source text excerpts.
- "Detected Entities" section in `CaseDetails.jsx` grouped by type.
- Entity filtering, searching, and copy-to-clipboard functionality.

## [v0.2.0] - Evidence Management
### Added
- `evidence` table with foreign key linking to `cases`.
- Multer configuration for file uploads (max 5MB, JPG/PNG/WEBP/PDF).
- Evidence API endpoints (GET, POST, DELETE).
- `CaseDetails.jsx` frontend page with chronological evidence timeline.
- Dynamic `AddEvidenceModal.jsx` handling file drops, URLs, and notes.

## [v0.1.0] - Case Management
### Added
- Node/Express backend initialization.
- PostgreSQL `cases` table for foundational case management.
- React/Vite frontend with Tailwind CSS.
- Basic routing and `Dashboard` layout.
- CRUD operations for investigation cases.
