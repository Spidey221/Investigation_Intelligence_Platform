# API Documentation

Base URL: `/api`

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

---

## Entities

### `GET /cases/:id/entities`
Retrieves all entities associated with a specific case.

### `GET /evidence/:id/entities`
Retrieves all entities discovered within a specific piece of evidence.
