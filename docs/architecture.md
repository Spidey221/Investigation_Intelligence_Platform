# System Architecture

The Investigation Intelligence Platform (IIP) utilizes a modern, decoupled client-server architecture designed for high availability and secure data processing.

## High-Level Components

### 1. Frontend Client (React)
- **Framework:** React 18 / Vite
- **Routing:** React Router DOM (with Route-based Authorization Guards)
- **State Management:** React Context API (Auth Context)
- **Visualizations:** React Flow / Dagre / html2canvas
- **Styling:** Tailwind CSS v3

### 2. Backend API (Node.js)
- **Framework:** Express.js
- **Security:** JWT (JSON Web Tokens) securely stored in HTTP-Only cookies, Bcrypt password hashing.
- **Role-Based Access Control:** Middleware enforcing `ADMIN`, `INVESTIGATOR`, `ANALYST`, and `VIEWER` constraints.
- **Reporting:** PDFKit dynamically streaming multi-page intelligence reports to the client.
- **Logging:** Winston and Morgan capturing structured HTTP streams and specific Security events (`LOGIN_FAILED`, `INTEGRITY_FAILURE`, etc.) into `logs/`.

### 3. Database (PostgreSQL 15)
- **Schema Structure:** Highly relational schemas mapping users to cases, evidence, extracted entities, relationships, and audit logs.
- **File Integrity:** Automatically maintains cryptographic SHA-256 hashes of all uploaded binaries (Images, PDFs) to guarantee strict chain of custody.

### 4. Infrastructure & Pipeline
- **Orchestration:** Docker Compose binds the Nginx Client, Node Backend, and PostgreSQL database into a single, cohesive, production-ready environment.
- **Testing:** Jest + Supertest (Backend), Vitest + React Testing Library (Frontend).
- **CI/CD:** GitHub Actions sequentially checks out, tests, builds, and verifies backend health before approving pull requests.
