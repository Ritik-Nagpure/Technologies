# Jira and Confluence – Architecture, System Design, Technology Stack and Interview Preparation

## 1. What are Jira and Confluence?

Both products are developed by Atlassian.

- **Jira:** Work management and issue-tracking platform. It manages what needs to be done, who will do it, when it should be completed, and its current status.
- **Confluence:** Knowledge management and collaboration platform. It manages documentation, technical decisions, meeting notes, architecture diagrams, requirements, and organizational knowledge.

They solve different problems but integrate closely.

| Area | Jira | Confluence |
|---|---|---|
| Primary purpose | Work and issue management | Knowledge and documentation |
| Main entity | Issue | Page |
| Organization | Projects | Spaces |
| Examples | Epics, stories, tasks, bugs, sprints | Requirements, architecture, API docs, meeting notes |
| Main value | Track execution | Preserve and share knowledge |

### Example: UniPass authentication project

In Confluence, document:
- Authentication architecture.
- Database schema.
- API specifications.
- JWT authentication flow.
- Security requirements.

In Jira, create:
- Epic: Authentication Service.
- Story: User Login.
- Story: JWT Token Generation.
- Story: Token Validation.
- Tasks: Database implementation, API development, UI integration.
- Bugs: Invalid token validation.

Link Jira issues from Confluence pages to provide traceability between requirements, technical decisions, and implementation.

## 2. How Jira and Confluence work together

| Activity | Platform |
|---|---|
| Document business requirements | Confluence |
| Document technical architecture | Confluence |
| Create epics and stories | Jira |
| Assign developers | Jira |
| Track sprint progress | Jira |
| Document API specifications | Confluence |
| Track bugs | Jira |
| Document production incidents | Confluence |
| Track incident resolution | Jira |

They are separate products. Confluence should not directly access Jira's internal database. Integrations use supported APIs, links, macros, webhooks, and app capabilities.

## 3. Jira architecture – high-level design

Jira has different deployment models:

1. **Jira Cloud:** Atlassian manages infrastructure, application deployment, scaling, upgrades, and operations.
2. **Jira Data Center:** The customer operates Jira on its own infrastructure, commonly using a clustered deployment.

A simplified conceptual Jira Cloud architecture:

```text
                  USERS
                    |
             Web / Mobile UI
                    |
                HTTPS / TLS
                    |
             EDGE / CDN LAYER
                    |
           API GATEWAY / ROUTING
                    |
        AUTHENTICATION / AUTHORIZATION
                    |
          JIRA APPLICATION SERVICES
                    |
      +-------------+-------------+
      |             |             |
   Project       Issue         Workflow
   Service       Service        Service
      |             |             |
      +-------------+-------------+
                    |
             DATA ACCESS LAYER
                    |
      +-------------+-------------+
      |             |             |
  Relational     Search         Cache
  Database       Index          Layer
      |             |             |
      +-------------+-------------+
                    |
          STORAGE / ATTACHMENTS
```

This is a conceptual model of responsibilities, not Atlassian's exact internal service diagram. Atlassian does not publicly disclose every internal service boundary or implementation detail.

### 3.1 Frontend layer

Responsibilities:
- Display project dashboards.
- Display Scrum and Kanban boards.
- Create and update issues.
- Display reports.
- Handle user interactions.

A component-based web frontend is useful because it supports reusable UI components, complex interactive interfaces, maintainable feature boundaries, and responsive updates.

Do not assume every internal Jira frontend implementation detail from its public APIs. Atlassian uses a JavaScript/TypeScript ecosystem across its products.

### 3.2 API and application layer

The application layer:
- Validates requests.
- Checks permissions.
- Executes business rules.
- Creates and updates issues.
- Executes workflow transitions.
- Communicates with data storage.

Illustrative Jira Cloud REST API paths:

```http
POST /rest/api/3/issue
GET /rest/api/3/issue/PROJ-101
PUT /rest/api/3/issue/PROJ-101
POST /rest/api/3/issue/PROJ-101/transitions
```

### 3.3 Authentication and authorization

- **Authentication:** Who are you?
- **Authorization:** What are you allowed to do?

A developer may be allowed to view project issues, create stories, and update assigned tasks, but not delete a project or change global permissions.

Enterprise systems need fine-grained authorization because users have different responsibilities.

### 3.4 Database layer

Jira stores structured information such as:
- Projects.
- Issues.
- Users and permissions.
- Workflows.
- Comments.
- Issue relationships.
- Configuration.
- History and audit-related data.

Relational databases are a natural fit because the domain contains structured relationships and transactional requirements.

Benefits:
- ACID transactions.
- Referential integrity.
- Structured relationships.
- Complex querying.
- Reliable updates.

Examples of databases supported in self-managed Jira deployments have included PostgreSQL, Oracle, and Microsoft SQL Server, depending on the supported Jira version.

Do not assume MongoDB is unsuitable for every part of such a platform. The point is that a relational model is a strong fit for core transactional issue data.

### 3.5 Search and indexing

A large Jira installation may contain hundreds of thousands or millions of issues. A dedicated search index supports efficient full-text search and filtering.

Example JQL:

```text
project = ZENFITW
AND status = "In Progress"
AND assignee = currentUser()
```

Benefits:
- Fast text searches.
- Efficient filtering.
- Reduced pressure on transactional database queries.

Jira Data Center has used Apache Lucene for indexing and has documented OpenSearch options in relevant versions. The search index is a derived representation; the primary persistent store remains authoritative.

### 3.6 Caching

Frequently accessed information may be cached:
- Project configuration.
- User permissions.
- Workflow configuration.
- Frequently accessed metadata.

Benefits:
- Lower database load.
- Reduced latency.
- Better throughput.

Trade-off: Cache invalidation and consistency become more complicated, especially when data changes frequently.

### 3.7 File and attachment storage

Jira supports screenshots, documents, logs, and other attachments.

A scalable design separates attachment metadata from binary storage:

```text
Issue
  |
  +---- Attachment metadata
              |
              +---- File ID
              +---- File name
              +---- File size
              +---- Storage reference
```

Object storage is a natural choice in cloud architectures. Do not assume every Atlassian internal storage implementation uses the same service.

## 4. Jira Data Center – clustered deployment

A conceptual Jira Data Center architecture:

```text
                  USERS
                    |
              LOAD BALANCER
                    |
          +---------+---------+
          |         |         |
       JIRA-1    JIRA-2    JIRA-3
       NODE      NODE      NODE
          |         |         |
          +---------+---------+
                    |
          +---------+---------+
          |                   |
     SHARED DATABASE     SHARED FILE SYSTEM
          |                   |
      PostgreSQL          Attachments
      Oracle              Exports
      SQL Server          Shared files
```

### Why multiple application nodes?

If many employees access Jira simultaneously, one application server can become a bottleneck. Multiple nodes distribute requests.

If Node 2 crashes:
1. Health checks detect the failed node.
2. The load balancer stops routing requests to it.
3. Healthy nodes continue processing requests.
4. The service remains available if the remaining capacity is sufficient.

### Why a shared database?

All nodes must access the same authoritative application data. If Node 1 creates an issue, Node 2 must be able to retrieve it.

Independent databases per node would create consistency problems.

### Why shared file storage?

If a user uploads an attachment through Node 1, a request routed to Node 3 must still be able to retrieve it. Shared storage avoids dependence on one node's local disk.

### Index and cache synchronization

Nodes need fast local access to search indexes and cached information. When an issue changes, other nodes must receive relevant updates. This introduces distributed consistency concerns.

**Advantages**
- High availability.
- Horizontal application scaling.
- Node-level failure isolation.
- Infrastructure control.
- Data residency control.

**Disadvantages**
- Infrastructure complexity.
- Shared database bottlenecks.
- Cache and index synchronization complexity.
- Higher operational cost.
- Administration and upgrade responsibilities.

Important lesson: Scaling application servers horizontally does not automatically scale the database, storage, cache, or search infrastructure.

## 5. Jira data model and hierarchy

A simplified issue hierarchy:

```text
PROJECT: ZENVIV

    EPIC: Authentication System
        |
        +---- STORY: User Login
        |        |
        |        +---- SUBTASK: Login API
        |        +---- SUBTASK: Login UI
        |        +---- SUBTASK: Login Testing
        |
        +---- STORY: JWT Authentication
        |        |
        |        +---- SUBTASK: Generate JWT
        |        +---- SUBTASK: Validate JWT
        |
        +---- STORY: Password Reset
                 |
                 +---- SUBTASK: Reset API
                 +---- SUBTASK: Reset UI
```

A simplified standard hierarchy is:
- Epic above standard issues.
- Story, Task, and Bug at the standard issue level.
- Subtask below a standard issue.

A Task is not automatically a child of a Story. Use a Subtask for that parent-child relationship. Jira hierarchy can also be extended or configured.

### Important entities

| Entity | Responsibility |
|---|---|
| Project | Container for project work |
| Epic | Large body of work |
| Story | User-focused requirement |
| Task | General unit of work |
| Bug | Defect |
| Subtask | Smaller part of a parent issue |
| Sprint | Time-boxed development iteration |
| Workflow | Defines issue lifecycle |
| Board | Visual representation of work |
| Component | Logical grouping within a project |
| Version | Release or delivery milestone |

### Conceptual relational model

This is a simplified teaching model, not Jira's actual internal database schema.

```text
PROJECT
-------
id (PK)
name
key

ISSUE
-----
id (PK)
project_id (FK)
parent_id (FK)
issue_type_id
status_id
assignee_id
reporter_id
summary
description
priority
created_at
updated_at

ISSUE_TYPE
----------
id (PK)
name

STATUS
------
id (PK)
name

USER
----
id (PK)
email
display_name

COMMENT
-------
id (PK)
issue_id (FK)
user_id (FK)
content
created_at

ISSUE_HISTORY
-------------
id (PK)
issue_id (FK)
field_name
old_value
new_value
changed_by
changed_at

SPRINT
------
id (PK)
name
start_date
end_date
state

SPRINT_ISSUE
------------
sprint_id (FK)
issue_id (FK)
```

Relational design fits these relationships: project-to-issue, issue-to-comment, issue-to-history, and issue-to-user.

## 6. Jira workflows

A workflow defines how an issue moves through its lifecycle.

Example:

```text
TO DO
  |
  v
IN PROGRESS
  |
  v
IN REVIEW
  |
  v
QA TESTING
  |
  v
DONE
```

A workflow contains:

- **Statuses:** Current state of an issue.
- **Transitions:** Operations that move issues between states.
- **Conditions:** Determine whether a user can execute a transition.
- **Validators:** Check whether required information is valid.
- **Post-functions:** Execute operations after a transition.

Example: When a developer moves an issue from In Review to Done:
- Condition: Is the user authorized?
- Validator: Has the required review been completed?
- Post-function: Update the issue and execute configured actions.

Why use a workflow engine instead of hardcoded status changes?
- Different organizations have different processes.
- Business rules can be configured without changing application code.
- Approval and validation requirements can differ by project.

Trade-off: Highly configurable workflows increase flexibility but can become difficult to maintain, test, and understand.

## 7. Confluence architecture – high-level design

Confluence is a knowledge-management and collaboration platform. Its special requirement is that multiple users may edit the same document simultaneously.

A conceptual architecture:

```text
                  USERS
                    |
             WEB / MOBILE UI
                    |
                HTTPS
                    |
            EDGE / ROUTING
                    |
         AUTHENTICATION / IDENTITY
                    |
           CONFLUENCE SERVICES
                    |
      +-------------+-------------+
      |             |             |
   Content       Permission    Space
   Service       Service       Service
      |             |             |
      +-------------+-------------+
                    |
             DATA LAYER
                    |
      +-------------+-------------+
      |             |             |
   Database      Search        Object /
                 Index         File Storage

                    |
           COLLABORATION LAYER
                    |
                 SYNCHRONY
                    |
               WEBSOCKETS
                    |
             OTHER EDITORS
```

This is a conceptual model, not Atlassian's exact internal service diagram.

Atlassian has publicly described its Cloud platform as AWS-hosted and has discussed distributed services, containerized applications, and internal platform infrastructure.

### 7.1 Space management

A Space is a logical container for related documentation.

Example:

```text
Company Space
    |
    +---- HR Documentation
    +---- Engineering Documentation
    +---- Architecture Documentation
    +---- Security Documentation
```

Spaces provide:
- Logical separation.
- Permission management.
- Content organization.
- Easier navigation.

### 7.2 Page management

A page stores documentation such as:
- API documentation.
- System architecture.
- Database schema.
- Technical specifications.
- Meeting notes.

Pages can have parent-child relationships:

```text
Engineering Space
    |
    +---- Architecture
    |        |
    |        +---- Authentication Architecture
    |        +---- Payment Architecture
    |
    +---- API Documentation
    |
    +---- Database Design
```

### 7.3 Content storage

Confluence must manage:
- Page content.
- Page metadata.
- Version history.
- Page relationships.
- Comments.
- Permissions.
- Labels.
- Attachment metadata.

A relational database is suitable for structured metadata and relationships. Attachments are better handled through separate file storage rather than storing large binary objects in ordinary database records.

### 7.4 Version management

Example:

```text
Version 1: Initial architecture
Version 2: Added Redis caching
Version 3: Changed authentication flow
Version 4: Updated database design
```

Page history helps users understand:
- What changed?
- Who changed it?
- When did it change?
- What was the previous design?

This is similar to version control, but for collaborative documentation.

### 7.5 Search and indexing

A dedicated search index helps users discover content across large spaces. Indexing can introduce a short delay between publishing a page and its availability in search.

### 7.6 Permissions

Confluence supports permissions at different levels, including global, space, and page restrictions.

Example:
- HR documentation is restricted.
- Architecture documentation may be readable by developers but editable only by architects.

Authorization must be checked on the server, not just by hiding UI elements.

## 8. Confluence collaborative editing – Synchrony and WebSockets

Confluence Cloud uses a collaboration service called **Synchrony** for collaborative editing.

Conceptual flow:

```text
           USER A                    USER B
              |                         |
         Browser A                 Browser B
              |                         |
              +------------+------------+
                           |
                     CONFLUENCE
                           |
                    SYNCHRONY SERVICE
                           |
                     WEBSOCKET
                           |
                  REAL-TIME UPDATES
                           |
              +------------+------------+
              |                         |
          Browser A                 Browser B
```

Step-by-step:
1. User A opens a Confluence page.
2. User B opens the same page.
3. Both browsers initialize the collaborative editor.
4. Clients establish WebSocket connections with Synchrony.
5. User A modifies the document.
6. The editor sends document changes to Synchrony.
7. Synchrony synchronizes changes with connected editing sessions.
8. User B receives updates in real time.
9. Changes are persisted through Confluence's content-management mechanisms.

Atlassian documents Synchrony, JWT-based connection authorization, and WebSocket-based synchronization.

### Why WebSockets instead of HTTP polling?

| HTTP polling | WebSockets |
|---|---|
| Client repeatedly asks for updates | Persistent bidirectional connection |
| Repeated HTTP requests | Lower messaging overhead after connection |
| More unnecessary requests | Efficient for frequent real-time updates |
| Suitable for periodic updates | Suitable for collaborative editing |

Polling example:

```text
Client -> Server: Any updates?
Server -> Client: No

Client -> Server: Any updates?
Server -> Client: Yes
```

WebSocket example:

```text
Client A <---- WebSocket ----> Server
Client B <---- WebSocket ----> Server

Server -> Client B: Document updated
```

### Concurrent editing and conflicts

Suppose two users edit the same content at approximately the same time. A naive last-write-wins approach could overwrite one user's changes.

Collaborative editing systems need a synchronization and conflict-resolution strategy.

Two common approaches:

**Operational Transformation (OT)**
- Represents changes as operations.
- Transforms operations against concurrent operations.
- Maintains a consistent document state.

**Conflict-free Replicated Data Types (CRDTs)**
- Uses data structures designed to merge concurrent updates.
- Supports convergence across replicas.
- Can be useful in distributed collaborative systems.

Do not claim that Confluence Synchrony specifically uses OT or CRDT unless you have verified the implementation for the version being discussed. These are general collaborative-editing approaches, not a confirmed description of Synchrony's internal algorithm.

### WebSocket advantages and disadvantages

Advantages:
- Real-time communication.
- Bidirectional communication.
- Lower repeated-request overhead.
- Suitable for collaboration.

Disadvantages:
- Persistent connection management.
- More complex load balancing.
- Reconnection handling.
- Connection state consumes resources.

Production concerns:
- Heartbeats.
- Connection timeouts.
- Reconnection with exponential backoff.
- Authentication and authorization.
- Handling disconnected clients.
- Synchronizing missed updates.
- Scaling connection servers.

## 9. Technology stack – why these technologies?

The exact internal Atlassian technology choices are not all publicly disclosed. Separate documented technologies from architectural recommendations and common implementation choices.

| Technology / approach | Why it fits | Alternatives and trade-offs |
|---|---|---|
| AWS | Mature cloud infrastructure and regional availability | Azure and GCP are also viable |
| Kubernetes | Container orchestration and deployment | VM-based deployment can be simpler |
| Relational DB | Transactions and structured relationships | Document DBs offer flexible schemas but different consistency/query trade-offs |
| Lucene / OpenSearch | Efficient full-text and filtered search | Database search is simpler but can become expensive |
| Redis / caching | Fast access to frequently used data | Database-only access increases load |
| WebSockets | Bidirectional real-time editing | Polling is simpler but less efficient for frequent updates |
| REST APIs | Standardized integrations and resource-oriented operations | GraphQL offers flexible fetching but adds complexity |
| Containers | Consistent deployment and isolation | Traditional VMs have a simpler operational model |
| Load balancer | Traffic distribution and node failover | A single node is simpler but less resilient |

### Monolith vs microservices

**Monolithic architecture**

```text
         Application
              |
      +-------+-------+
      |       |       |
    Issue  Workflow  Project
    Logic   Logic    Logic
      |       |       |
      +-------+-------+
              |
           Database
```

Advantages:
- Simpler initial development.
- Easier local debugging.
- Straightforward transactions.
- Lower infrastructure complexity.

Disadvantages:
- Larger deployment units.
- Scaling individual features is difficult.
- Changes can have a larger blast radius.
- Tight coupling can develop over time.

**Microservices architecture**

```text
           API / ROUTING
                |
       +--------+--------+
       |        |        |
     Issue   Workflow  Project
    Service  Service   Service
       |        |        |
       +--------+--------+
                |
       Distributed Data Layer
```

Advantages:
- Independent deployments.
- Independent scaling.
- Clearer service ownership.
- Better isolation of failures when designed correctly.

Disadvantages:
- Network failures.
- Distributed transactions.
- Service discovery.
- Observability complexity.
- Eventual consistency.
- Operational overhead.

Atlassian has publicly described a distributed Cloud architecture. That does not mean every business operation must be a separate microservice. Service boundaries should reflect ownership, scaling requirements, and domain boundaries.

## 10. Jira and Confluence integration

Common integration mechanisms:
1. Jira issue links and macros inside Confluence pages.
2. REST APIs.
3. Atlassian authentication and authorization.
4. App integrations and extensions.
5. Webhooks and automation.

Example Confluence specification:

```text
Authentication Architecture

Related Jira Issues:

ZENFITW-101 - Implement Login API
ZENFITW-102 - Implement JWT Validation
ZENFITW-103 - Implement Refresh Token
ZENFITW-104 - Implement Login UI
```

Illustrative API request:

```http
GET /rest/api/3/issue/ZENFITW-101
```

Illustrative response:

```json
{
  "key": "ZENFITW-101",
  "fields": {
    "summary": "Implement Login API",
    "status": {
      "name": "In Progress"
    },
    "assignee": {
      "displayName": "Developer A"
    }
  }
}
```

The response is illustrative. Real API fields depend on permissions, requested fields, and API version.

## 11. Extensibility – Forge, Connect and Marketplace

Organizations may need:
- Advanced reporting.
- Custom approval workflows.
- Third-party integrations.
- Additional project management capabilities.
- Custom dashboards.

**Forge:** Atlassian's cloud app development platform, providing managed infrastructure and platform capabilities.

**Connect:** An earlier app integration framework for external applications. It is in its deprecation lifecycle; for new Cloud development, Forge is generally the preferred direction. Verify current migration guidance before choosing a framework.

Why use an extension framework rather than modifying the product's core source code?
- Core product remains upgradeable.
- Extensions have clearer boundaries.
- Third-party integrations are supported.
- Security and permissions can be managed through platform mechanisms.

## 12. Security architecture

### Authentication

Establishes the identity of the user.

Enterprise authentication mechanisms include:
- SAML SSO.
- OAuth 2.0.
- OpenID Connect.
- Multi-factor authentication.

### Authorization

Determines what the authenticated user can access.

Example:

```text
User: Developer A

Jira:
  View project: YES
  Create issue: YES
  Delete project: NO

Confluence:
  View Engineering Space: YES
  Edit Engineering Space: YES
  View HR Space: NO
```

### Multi-tenancy

Multiple organizations use the same cloud platform. Underlying infrastructure may be shared while tenant data and access remain logically isolated.

Security controls:
- Tenant isolation.
- Authorization on every protected operation.
- Encryption in transit.
- Encryption at rest.
- Secure session management.
- Audit logging.
- Rate limiting.
- Protection against CSRF, XSS, and injection attacks.
- Secure attachment access.

Never rely on frontend restrictions for authorization. A user can call APIs directly, so the backend must enforce permissions.

## 13. Reliability, scalability and production engineering

| Problem | Architectural solution |
|---|---|
| Application node failure | Load balancer and redundant nodes |
| Database failure | Database HA, backups and disaster recovery |
| High search traffic | Search indexes |
| Repeated database queries | Caching |
| Large attachment uploads | Separate file storage |
| Concurrent document editing | Synchronization service |
| Network interruptions | Retry and reconnection strategies |
| High traffic | Horizontal scaling |
| Unauthorized access | Authentication and authorization |
| Slow APIs | Monitoring, tracing and performance optimization |

### What if the search index becomes inconsistent?

If an issue exists in the database but is missing from search results, possible causes include:
- Indexing operation failed.
- Index update is delayed.
- A node has a stale index.
- Index corruption occurred.

The database remains the authoritative source. A reindex operation can rebuild the search index from underlying application data.

### What if the database becomes unavailable?

The application may be unable to persist new changes. Production systems need:
- Database redundancy.
- Backups.
- Recovery procedures.
- Connection-pool management.
- Health monitoring.
- Disaster recovery planning.

Caching cannot replace a reliable persistent data store.

### What if Synchrony becomes unavailable?

Real-time collaborative editing can be affected. The system needs to handle:
- Connection failures.
- Reconnection.
- Unsynchronized client changes.
- Recovery of document state.
- Avoiding silent loss of edits.

## 14. Jira vs Confluence – architectural comparison

| Dimension | Jira | Confluence |
|---|---|---|
| Primary domain | Work management | Knowledge management |
| Core entity | Issue | Page |
| Organization | Projects | Spaces |
| Main operation | Create/update/transition issues | Create/edit/publish pages |
| Relationships | Issue hierarchy and links | Page hierarchy and links |
| Versioning | Issue history | Page history |
| Search | Issue search/JQL | Content search |
| Collaboration | Teams managing work | Users editing content |
| Workflow | Issue state transitions | Content lifecycle and publishing |
| Real-time feature | Collaborative work visibility | Collaborative editing |
| Integrations | APIs, webhooks, apps | APIs, macros, apps |

### Jira advantages
- Strong issue tracking.
- Configurable workflows.
- Scrum and Kanban support.
- Powerful filtering using JQL.
- Extensive integrations.
- Good project visibility.

### Jira disadvantages
- Complex configuration.
- Learning curve.
- Workflow maintenance overhead.
- Poorly designed issue hierarchies create clutter.
- Too many custom fields and plugins can reduce maintainability.

### Confluence advantages
- Centralized documentation.
- Collaborative editing.
- Version history.
- Structured knowledge management.
- Jira integration.
- Searchable technical knowledge.

### Confluence disadvantages
- Documentation can become outdated.
- Duplicate pages create confusion.
- Permission management can become complicated.
- Large spaces require good information architecture.
- Documentation quality depends on team discipline.

## 15. Design a simplified Jira-like system

This is a useful system design interview exercise.

### Functional requirements
1. Create projects.
2. Create and update issues.
3. Assign issues to users.
4. Define custom workflows.
5. Track issue history.
6. Search issues.
7. Support comments and attachments.
8. Manage permissions.
9. Create Scrum and Kanban boards.

### Non-functional requirements
1. High availability.
2. Horizontal scalability.
3. Strong consistency for critical issue updates.
4. Fast search.
5. Tenant isolation.
6. Auditability.
7. Extensibility.

### Proposed architecture

```text
                    CLIENT
                      |
                 CDN / WAF
                      |
                 API GATEWAY
                      |
              AUTHENTICATION
                      |
              AUTHORIZATION
                      |
       +--------------+--------------+
       |              |              |
   PROJECT         ISSUE          WORKFLOW
   SERVICE         SERVICE         SERVICE
       |              |              |
       +--------------+--------------+
                      |
                 EVENT LAYER
                      |
                   KAFKA
                      |
       +--------------+--------------+
       |              |              |
   SEARCH         NOTIFICATION     AUDIT
   CONSUMER        CONSUMER        CONSUMER
       |              |              |
   OPENSEARCH      EMAIL/PUSH       DB

                      |
                DATA STORAGE
                      |
                 POSTGRESQL
                      |
                 REDIS CACHE
                      |
                OBJECT STORAGE
```

This is a proposed architecture, not Atlassian's actual implementation.

### Why each technology?

| Component | Proposed technology | Reason |
|---|---|---|
| Frontend | React + TypeScript | Complex interactive interface |
| Backend | Node.js + TypeScript | Efficient I/O-heavy API workloads |
| API | REST | Simple resource-based integration |
| Primary database | PostgreSQL | Transactions and relational data |
| Cache | Redis | Fast reads and reduced database load |
| Search | OpenSearch | Full-text and structured search |
| Event streaming | Kafka | Asynchronous event distribution |
| Attachment storage | S3 | Scalable binary storage |
| Authentication | OIDC | Standardized identity integration |
| Deployment | Kubernetes | Container orchestration |
| Monitoring | OpenTelemetry + metrics backend | Tracing and observability |

### Why Kafka?

An issue update should not synchronously wait for search indexing, email notification, analytics processing, and dashboard refresh.

A better flow:

```text
1. Update issue in PostgreSQL.
2. Persist an event reliably.
3. Publish IssueUpdated event.
4. Search consumer updates OpenSearch.
5. Notification consumer sends notification.
6. Analytics consumer updates metrics.
```

For production reliability, use the transactional outbox pattern:

```text
DATABASE TRANSACTION
       |
       +---- UPDATE ISSUE
       |
       +---- INSERT OUTBOX EVENT
       |
       +---- COMMIT
```

A separate publisher reads the outbox and publishes events to Kafka. Consumers should be idempotent because event delivery can be repeated.

Why not Kafka for every operation?
- Reading an issue: synchronous.
- Updating an issue: synchronous database transaction.
- Updating search index: asynchronous.
- Sending notifications: asynchronous.

Introducing Kafka everywhere creates unnecessary complexity.

Architectural principle: Use synchronous communication for operations requiring an immediate result, and asynchronous communication for independent downstream processing.

## 16. Interview questions – Jira and Confluence

### A. Basic questions

1. What is Jira, and what problems does it solve?
2. What is Confluence?
3. What is the difference between Jira and Confluence?
4. What is a Jira project?
5. What is an Epic?
6. What is the difference between Story, Task and Bug?
7. What is a Subtask?
8. What is a Sprint?
9. What is a Kanban board?
10. What is a Scrum board?
11. What is a Jira workflow?
12. What are Jira components?
13. What are Jira versions and releases?
14. What is JQL?
15. What are Confluence Spaces?
16. What is the difference between a Confluence page and a blog post?
17. What is page version history?
18. How do Jira and Confluence integrate?

### B. Intermediate questions

19. Explain Jira's high-level architecture.
20. Explain Confluence's high-level architecture.
21. Why does Jira use a relational database?
22. Why does Jira need a search index?
23. What is the difference between a database and a search index?
24. How does Jira handle issue status transitions?
25. What are workflow validators and conditions?
26. How does Jira handle role-based permissions?
27. What is the difference between authentication and authorization?
28. How does Confluence handle concurrent editing?
29. What is Synchrony?
30. Why are WebSockets used for collaborative editing?
31. What happens when two users edit the same document?
32. How does Confluence maintain page version history?
33. How does Jira integrate with external applications?
34. What are Jira REST APIs?
35. What are Jira webhooks?
36. What is the difference between Jira Cloud and Jira Data Center?
37. How does Jira handle attachments?
38. What are Jira plugins and Forge?

### C. Advanced architecture questions

39. How would you design a Jira-like issue-tracking system?
40. How would you scale Jira for 100,000 concurrent users?
41. How would you design a multi-tenant project management SaaS?
42. How would you handle database bottlenecks?
43. How would you synchronize search indexes across multiple application nodes?
44. What happens if a database update succeeds but search indexing fails?
45. How would you implement reliable event-driven issue updates?
46. How would you prevent duplicate event processing?
47. How would you implement an audit history system?
48. How would you design a configurable workflow engine?
49. How would you handle concurrent issue updates?
50. How would you design a real-time collaborative editor?
51. How would you handle WebSocket reconnection?
52. How would you prevent unauthorized cross-tenant data access?
53. How would you implement attachment storage at scale?
54. How would you handle application node failures?
55. How would you implement disaster recovery?
56. How would you design a notification system?
57. How would you handle eventual consistency between services?
58. How would you avoid distributed transaction problems?
59. When would you choose a monolith over microservices?

### D. Scenario-based questions

**60. A Jira issue is updated successfully, but search results still show the old status. What could be the reason?**

Expected discussion:
- Eventual consistency.
- Indexing delay.
- Failed indexing event.
- Stale search index.
- Reindexing and recovery.

**61. A Jira application node crashes. How does the application continue working?**

Expected discussion:
- Load balancer.
- Health checks.
- Multiple application nodes.
- Shared database.
- Shared file storage.
- Remaining capacity.

**62. Two developers update the same issue simultaneously. How would you prevent data loss?**

Expected discussion:
- Optimistic locking.
- Version numbers.
- Compare-and-set updates.
- Conflict detection.
- Retry or conflict resolution.

**63. A Confluence page is being edited by 20 users simultaneously. How would you handle it?**

Expected discussion:
- WebSockets.
- Synchronization service.
- Concurrent operations.
- Conflict resolution.
- Connection management.
- Persistence and recovery.

**64. A company has 50,000 employees and wants to use Jira. How would you design its permission model?**

Expected discussion:
- Tenant and project boundaries.
- Groups and roles.
- Permission schemes.
- Resource-level authorization.
- Caching permissions carefully.
- Audit logs.

**65. How would you prevent a user from accessing another organization's Jira issues by manipulating an API request?**

Expected discussion:
- Server-side tenant resolution.
- Tenant-scoped database queries.
- Authorization checks.
- Do not trust tenant IDs supplied by clients.
- Security testing.

## 17. Important interview answers

**Q1. Why does Jira use a relational database instead of MongoDB?**

Jira's domain contains strongly related entities such as projects, issues, users, comments, workflows, and issue history. Relational databases provide ACID transactions, referential integrity, and structured querying, making them a natural fit.

**Q2. Why does Jira use search indexing?**

Searching directly against transactional storage can become expensive for large datasets. A dedicated search index enables efficient full-text search and filtering without putting unnecessary load on the primary database.

**Q3. Why use microservices instead of a monolithic architecture?**

Microservices allow independent deployment, scaling, and service ownership. However, they introduce network failures, distributed consistency challenges, and operational complexity. They are appropriate when scale and organizational boundaries justify that complexity.

**Q4. Why does Confluence use WebSockets?**

Collaborative editing requires bidirectional, low-latency communication. WebSockets maintain persistent connections and allow document changes to be communicated without continuous HTTP polling.

**Q5. What is the difference between Jira Cloud and Jira Data Center?**

Jira Cloud is operated by Atlassian as a managed cloud service. Jira Data Center is deployed and operated by the customer on its own infrastructure, supporting clustered application nodes, a shared database, and shared storage.

**Q6. Why separate search indexing from the primary database?**

The database is optimized for reliable persistence and transactional operations, whereas search engines are optimized for searching and filtering. Separating them improves performance and allows independent scaling.

**Q7. What is eventual consistency?**

Eventual consistency means that different system components may temporarily have different versions of data, but they converge to the same state after pending updates are processed.

**Q8. What happens if an event is processed twice?**

The consumer should be idempotent. It should identify previously processed events and avoid applying the same business operation more than once.

**Q9. Why is a workflow engine better than hardcoded status changes?**

A workflow engine separates business process configuration from application code. Organizations can define their own statuses, transitions, validators, and permissions without requiring application code changes for every process.

**Q10. How would you design a scalable document collaboration system?**

I would use a persistent content store, a real-time synchronization service, WebSockets for communication, a conflict-resolution strategy, version history, and reliable persistence. I would also design for reconnection, concurrent edits, and recovery from network failures.

## 18. Interview preparation priority

### L1 – Must know
- Jira vs Confluence.
- Jira architecture.
- Confluence architecture.
- Relational database vs search index.
- Workflow engine.
- REST APIs and webhooks.
- Authentication and authorization.
- Jira Cloud vs Data Center.

### L2 – Strong engineering knowledge
- Microservices vs monolith.
- Horizontal scaling.
- Load balancing.
- Caching.
- Event-driven architecture.
- WebSockets.
- Eventual consistency.
- Database transactions.

### L3 – Architect-level depth
- Distributed collaborative editing.
- Operational Transformation and CRDTs.
- Transactional outbox.
- Multi-tenant isolation.
- Distributed indexing.
- Disaster recovery.
- Distributed tracing.

## 19. Official technical resources

Use official Atlassian documentation to verify version-dependent details and implementation claims:

1. Atlassian Cloud architecture and operational practices: https://www.atlassian.com/trust/security
2. Jira Data Center architecture: https://confluence.atlassian.com/adminjiraserver
3. Jira Data Center search/indexing documentation: https://confluence.atlassian.com/adminjiraserver
4. Confluence collaborative editing: https://confluence.atlassian.com/doc
5. Jira Cloud platform developer documentation: https://developer.atlassian.com/cloud/jira/platform/
6. Confluence Cloud developer documentation: https://developer.atlassian.com/cloud/confluence/

## 20. Final recommendation

Do not prepare Jira and Confluence as two isolated software products. Prepare them as examples of enterprise SaaS architecture.

Focus on five engineering problems:

1. **Data management:** How to persist and retrieve large numbers of issues and documents.
2. **Distributed architecture:** How to serve multiple organizations reliably.
3. **Search:** How to search large datasets efficiently.
4. **Collaboration:** How multiple users can modify shared information.
5. **Extensibility:** How external applications integrate without tightly coupling to the core platform.

These concepts transfer directly to enterprise SaaS systems, including project management, documentation, authentication, and collaboration platforms.
