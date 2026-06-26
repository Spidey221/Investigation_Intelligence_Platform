# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.7.0] - Production Engineering & Infrastructure
### Added
- Complete Dockerization of the application stack using `docker-compose`.
- Multi-stage frontend Docker build utilizing highly performant Nginx serving.
- GitHub Actions CI pipeline implementing automated tests and build verifications.
- Robust environment validation failing-fast on missing critical secrets.
- Comprehensive Test Suites utilizing Jest (Backend) and Vitest (Frontend).
- Structured application and security logging implemented natively via Winston and Morgan.
- Extensive documentation rewrites (`deployment.md` and `architecture.md`).

## [v0.6.0] - Authentication, RBAC, Audit Logging & Integrity
### Added
- Comprehensive JWT-based authentication system utilizing secure `httpOnly` cookies.
- Robust Role-Based Access Control (RBAC) supporting `ADMIN`, `INVESTIGATOR`, `ANALYST`, and `VIEWER` roles.
- `auditService.js` to chronologically track all major CRUD operations across the system.
- Integration of `crypto` hash generation mapping SHA-256 hashes for all uploaded evidence files.
- Dedicated `POST /api/evidence/:id/verify` endpoint dynamically recomputing hashes to guarantee file integrity.
- New frontend authentication views (`Login.jsx`, `Register.jsx`, `Profile.jsx`, `Unauthorized.jsx`).
- Embeddable `AuditTimeline.jsx` giving a complete timeline inside `CaseDetails.jsx`.

## [v0.5.0] - Investigation Reports & Case Sharing
### Added
- Phase 6 Implementation.
- Server-side `pdfkit` report generation engine via `POST /api/cases/:id/report`.
- Frontend DOM-to-Canvas export using `html2canvas` to capture the Intelligence Graph.
- Public sharing access toggle on cases, provisioning unique `share_token` URLs.
- Read-only `/shared/:shareToken` dashboard isolating unauthenticated external viewers from internal data mutation endpoints.

## [v0.4.0] - Relationship Engine & Intelligence Graph
### Added
- Phase 4 Implementation.
- `relationships` database table with foreign keys to entities and cases.
- Automatic backend relationship generation (`ASSOCIATED_WITH`, `BELONGS_TO`, `REPEATED_INDICATOR`, `CO_OCCURS`).
- Confidence scoring for graph relationships.
- Interactive Investigation Graph using `@xyflow/react` and `dagre` layout.
- Graph Sidebar displaying deep metadata for clicked nodes.
- Tabbed interface in `CaseDetails.jsx` (Evidence, Entities, Relationships, Graph).
- Endpoints `GET /api/cases/:id/relationships` and `GET /api/cases/:id/graph` containing nodes, edges, and statistics.

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
