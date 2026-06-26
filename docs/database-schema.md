# Database Schema

The database uses PostgreSQL.

## `users` Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique user identifier |
| `name` | VARCHAR(255) | NOT NULL | User's full name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email |
| `password_hash` | TEXT | NOT NULL | Bcrypt hashed password |
| `role` | VARCHAR(50) | DEFAULT 'INVESTIGATOR' | e.g. ADMIN, INVESTIGATOR, ANALYST, VIEWER |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date account was created |

## `cases` Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique case identifier |
| `title` | VARCHAR(255) | NOT NULL | Name of the investigation |
| `description` | TEXT | NULL | Brief background of the case |
| `status` | VARCHAR(50) | DEFAULT 'Open' | e.g. Open, Closed, Archival |
| `is_public` | BOOLEAN | DEFAULT false | Flags if the case can be shared externally |
| `share_token` | UUID | UNIQUE | Public routing token for shared viewing |
| `share_created_at` | TIMESTAMP | NULL | Date the case was made public |
| `created_by` | INTEGER | REFERENCES users(id) | Investigator who created the case |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date created |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date updated |

## `evidence` Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique evidence identifier |
| `case_id` | INTEGER | REFERENCES cases(id) ON DELETE CASCADE | Associated case |
| `title` | VARCHAR(255) | NOT NULL | Title of the evidence |
| `type` | VARCHAR(50) | NOT NULL | Evidence type (Image, PDF, URL, Note, Text) |
| `content` | TEXT | NULL | Text content or URL link |
| `file_path` | VARCHAR(255) | NULL | Local path in `uploads/` |
| `original_filename` | VARCHAR(255) | NULL | Original filename of upload |
| `file_hash` | TEXT | NULL | SHA-256 hash of the uploaded file |
| `uploaded_by` | INTEGER | REFERENCES users(id) | Investigator who uploaded the file |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date uploaded |

## `entities` Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique entity identifier |
| `case_id` | INTEGER | REFERENCES cases(id) ON DELETE CASCADE | Associated case |
| `evidence_id` | INTEGER | REFERENCES evidence(id) ON DELETE CASCADE | Associated evidence |
| `entity_type` | VARCHAR(50) | NOT NULL | Category of extracted intelligence (e.g., EMAIL, IP_ADDRESS) |
| `entity_value` | TEXT | NOT NULL | The extracted string |
| `confidence_score` | NUMERIC | DEFAULT 1.0 | AI/Regex confidence indicator |
| `source_text_excerpt` | TEXT | NULL | A small window of text providing context around the extraction |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Extraction date |
*(Note: Has UNIQUE constraint on `evidence_id`, `entity_type`, `entity_value`)*

## `relationships` Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique relationship identifier |
| `case_id` | INTEGER | REFERENCES cases(id) ON DELETE CASCADE | Associated case |
| `source_entity_id` | INTEGER | REFERENCES entities(id) ON DELETE CASCADE | The origin entity |
| `target_entity_id` | INTEGER | REFERENCES entities(id) ON DELETE CASCADE | The destination entity |
| `relationship_type` | VARCHAR(50) | NOT NULL | e.g. ASSOCIATED_WITH, BELONGS_TO, REPEATED_INDICATOR |
| `source_evidence_id` | INTEGER | REFERENCES evidence(id) | Originating evidence item |
| `confidence_score` | NUMERIC | DEFAULT 1.0 | Certainty of relationship (0.0 to 1.0) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date associated |

## `audit_logs` Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique log identifier |
| `user_id` | INTEGER | REFERENCES users(id) | User who performed the action |
| `action` | VARCHAR(255) | NOT NULL | e.g. CASE_CREATED, EVIDENCE_UPLOADED |
| `resource_type` | VARCHAR(100) | NULL | e.g. CASE, EVIDENCE |
| `resource_id` | INTEGER | NULL | ID of the mutated resource |
| `details` | TEXT | NULL | Action context |
| `ip_address` | VARCHAR(100) | NULL | IP of the requester |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date logged |
*(Note: Has UNIQUE constraint on `source_entity_id`, `target_entity_id`, `source_evidence_id`)*
