# API Documentation

Base URL: `/api`

## Authentication (`/api/auth`)

### `POST /register`
Creates a new user. Expects `{ name, email, password }`.

### `POST /login`
Authenticates a user. Expects `{ email, password }`. Sets HTTP-only cookie.

### `POST /logout`
Clears authentication cookie.

### `GET /profile`
Retrieves details of the authenticated user.

---

## Cases

### `GET /cases`
Retrieves a list of all cases.
**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Operation Alpha",
    "description": "Internal network breach",
    "status": "Active",
    "created_at": "2026-06-26T12:00:00Z"
  }
]
```

### `GET /cases/:id`
Retrieves details for a specific case.

### `POST /cases`
Creates a new case.
**Payload:**
```json
{
  "title": "New Case",
  "description": "Case details",
  "status": "Active"
}
```

### `PUT /cases/:id`
Updates a case.

### `DELETE /cases/:id`
Deletes a case and all associated evidence.

---

## Evidence

### `GET /cases/:id/evidence`
Retrieves all evidence mapped to the specified case ID.

### `POST /cases/:id/evidence`
Uploads new evidence for a case. Requires `multipart/form-data`.
**Fields:**
- `title` (String)
- `type` (Enum: Image, PDF, URL, Note, Text)
- `content` (String, Optional depending on type)
- `file` (File, Optional depending on type)

### `DELETE /evidence/:id`
Deletes an evidence record and removes the file from local storage.

### `POST /evidence/:id/verify`
Recomputes the hash of the target evidence file and compares it to the database `file_hash` to ensure data integrity.
Returns `{ valid: true/false }`

---

## Entities

### `GET /cases/:id/entities`
Retrieves all entities associated with a specific case.

### `GET /evidence/:id/entities`
Retrieves all entities discovered within a specific piece of evidence.

---

## Relationships & Graph

### `GET /cases/:id/relationships`
Retrieves a table-ready list of all relationships formed in the case.

### `GET /cases/:id/graph`
Retrieves intelligence relationships formatted exclusively for graph visualization.
Returns `{ nodes: [...], edges: [...], statistics: {...} }`

---

## Report Generation & Sharing

### `PUT /cases/:id/public`
Toggles the public visibility of a case and provisions a `share_token`.

### `POST /cases/:id/report`
Generates a PDF Investigation Report. Accepts a base64 `{ graphImage }` payload to embed the visual intelligence graph into the document. Returns a PDF blob.

### `GET /shared/cases/:shareToken`
Retrieves case metadata for a shared case (requires `is_public` = true).

### `GET /shared/cases/:shareToken/evidence`
### `GET /shared/cases/:shareToken/entities`
### `GET /shared/cases/:shareToken/relationships`
### `GET /shared/cases/:shareToken/graph`
Read-only endpoints specifically for populating the external Shared Dashboard without exposing actual case IDs.

---

## Audit Logs (`/api/audit`)

### `GET /case/:caseId`
Retrieves a chronological sequence of all logged actions associated with the specified case.
