# IIP Roadmap

## Phase 1: Case Management (Completed ✅)
- Establish backend infrastructure and PostgreSQL DB.
- Build React/Vite UI with a dark cybersecurity theme.
- Implement Case CRUD operations.

## Phase 2: Evidence Management (Completed ✅)
- Expand database schema with `evidence` relationships.
- Support Multer file uploads for images and PDFs.
- Render chronological timelines with type-specific badges.

## Phase 3: Entity Extraction (Completed ✅)
- Parse text notes and uploaded documents to extract key entities (IP addresses, URLs, emails, phones).
- Regex-based logic for synchronized intelligence extraction.
- Entity groups with filtering, search, and copy features in the UI.

## Phase 4: Relationship Engine (Completed ✅)
- Allow users to manually link extracted entities or map evidence to multiple cases.
- Automatically generate relationships (`ASSOCIATED_WITH`, `BELONGS_TO`, etc.) upon evidence extraction.
- Expose `/api/cases/:caseId/graph` to format nodes and edges.

## Phase 5: Intelligence Graph Visualization (Completed ✅)
- Use a frontend graph library (`@xyflow/react`) to map out entity relationships.
- Include Dagre graph layout for automatic positioning.
- Allow investigators to visualize how a phone number from Case A links to an email from Case B.
- Interactive nodes for exploring the investigation graph.

## Phase 6: Report Generation (Completed ✅)
- Export full case profiles, evidence timelines, and graph visuals to PDF.
- Shareable URLs for read-only access.
