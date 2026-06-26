# Database Schema

The database uses PostgreSQL.

## `cases` Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique case identifier |
| `title` | VARCHAR(255) | NOT NULL | Title of the investigation |
| `description` | TEXT | NOT NULL | Summary of the case |
| `status` | VARCHAR(50) | DEFAULT 'Active' | Case status (Active, Closed, Archived) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date case was created |

## `evidence` Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique evidence identifier |
| `case_id` | INTEGER | REFERENCES cases(id) ON DELETE CASCADE | Associated case |
| `title` | VARCHAR(255) | NOT NULL | Title of the evidence |
| `type` | VARCHAR(50) | NOT NULL | Evidence type (Image, PDF, URL, Note, Text) |
| `content` | TEXT | NULL | Text content or URL link |
| `file_path` | VARCHAR(255) | NULL | Local path in `uploads/` |
| `original_filename` | VARCHAR(255) | NULL | Name of the uploaded file |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Upload/Creation date |
