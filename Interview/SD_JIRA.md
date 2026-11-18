# Atlassian Jira and Confluence – System Architecture, Internal Working, Technology Stack and Design Decisions

> Architecture deep dive | System design | Distributed systems | Backend engineering

## Important scope and accuracy note

Jira and Confluence are separate Atlassian products that integrate as part of the Atlassian ecosystem.

- **Jira** manages work items, projects, workflows, assignments, releases and delivery tracking.
- **Confluence** manages documentation, knowledge bases, pages, collaboration and technical knowledge.
- Both integrate with Atlassian identity, administration, search, notifications and other platform capabilities.

Atlassian's exact internal implementation is proprietary and evolves. This document distinguishes publicly documented technologies from conceptual architecture patterns and illustrative implementation choices. Diagrams and schemas are explanatory, not exact production blueprints.

---

# 1. High-level system architecture

## 1.1 How Jira and Confluence fit together

Example workflow in a software company:

1. A product manager writes a requirement in Confluence.
2. The engineering team creates Jira work items from the requirement.
3. Developers update Jira status as work progresses.
4. Developers document technical decisions in Confluence.
5. Jira issues link to the relevant Confluence pages.
6. Managers use Jira dashboards and reports to monitor delivery.

Jira and Confluence are separate products with separate domain models and data ownership. They integrate through APIs, platform capabilities and product integrations rather than sharing one giant database.

## 1.2 Conceptual architecture

```text
                  USERS
                    |
          Web Browser / Mobile App
                    |
                    v
             ATLASSIAN EDGE
          (Routing / Security / WAF)
                    |
                    v
         IDENTITY & ACCESS MANAGEMENT
          (Authentication / Session)
                    |
                    v
           TENANT CONTEXT / ROUTING
        (Organization / Tenant / Region)
                    |
          +---------+---------+
          |                   |
          v                   v
      JIRA CLOUD          CONFLUENCE CLOUD
          |                   |
    +-----+------+      +-----+------+
    |            |      |            |
    v            v      v            v
 Work Item   Workflow  Content     Collaboration
 Services    Services  Services    Capabilities
    |            |      |            |
    +------+-----+      +------+-----+
           |                   |
           v                   v
      Data Storage        Data Storage
           |                   |
           +---------+---------+
                     |
                     v
             SHARED PLATFORM
       +-------------+-------------+
       |             |             |
       v             v             v
     Search       Media         Events
       |             |             |
       v             v             v
    Indexing     Attachments   Notifications
```

This is a logical view, not Atlassian's exact deployment topology.

# 2. Infrastructure architecture

## 2.1 Cloud infrastructure – AWS

Atlassian publicly documents AWS infrastructure, containerized services, Kubernetes and its internal Micros platform.

Why cloud infrastructure fits:

- Horizontal and vertical scalability.
- High availability.
- Geographic distribution.
- Disaster recovery.
- Data residency options.
- Managed infrastructure capabilities.

| Technology | Purpose | Why it fits |
|---|---|---|
| AWS | Cloud infrastructure | Global infrastructure and managed services |
| Kubernetes | Container orchestration | Deploy and manage distributed services |
| Micros | Atlassian internal PaaS | Standardized infrastructure and deployment |
| Containers | Application packaging | Consistent runtime environments |
| Availability Zones | Fault isolation | Reduce impact of data-center failures |

A single EC2 instance would create a single point of failure and a scaling bottleneck. Multiple service instances can handle demand and failures more effectively.

Do not assume every Atlassian service runs directly on Kubernetes; Atlassian also uses its internal platform.

## 2.2 Multi-tenant architecture

A multi-tenant SaaS platform allows multiple customer organizations to share infrastructure while logically isolating their data and configurations.

```text
              SHARED CLOUD PLATFORM
                       |
          +------------+------------+
          |            |            |
          v            v            v
       Tenant A     Tenant B     Tenant C
          |            |            |
          v            v            v
       Data A       Data B       Data C
```

Atlassian documents a Tenant Context Service (TCS). Tenant context can contain tenant identity and metadata needed to route and process a request.

Simplified example:

```javascript
const requestContext = {
  userId: "user-101",
  tenantId: "company-A",
  product: "jira"
};

async function getIssues(projectId) {
  return issueRepository.find({
    tenantId: requestContext.tenantId,
    projectId
  });
}
```

This is illustrative, not Atlassian source code.

Production requirements:

- Never trust a tenant ID supplied directly by the client.
- Resolve tenant membership from authenticated identity.
- Propagate trusted tenant context across service boundaries.
- Enforce tenant filters at data-access boundaries.
- Test for cross-tenant access vulnerabilities.

Advantages:
- Lower infrastructure cost.
- Better resource utilization.
- Centralized maintenance.
- Efficient provisioning.

Disadvantages:
- Noisy-neighbor risk.
- More complex tenant isolation.
- Shared infrastructure can cause correlated failures.
- Database and shard routing complexity.

Atlassian also offers Isolated Cloud for customers that require dedicated infrastructure.

## 2.3 Sharding

Sharding distributes customer data across multiple database partitions or clusters.

```text
               TENANT ROUTER
                     |
          +----------+----------+
          |          |          |
          v          v          v
       SHARD 1    SHARD 2    SHARD 3
          |          |          |
       Tenant A   Tenant D   Tenant G
       Tenant B   Tenant E   Tenant H
       Tenant C   Tenant F   Tenant I
```

A tenant catalog or routing mechanism determines where data resides.

Request flow:

1. The request reaches the platform.
2. The authenticated tenant is resolved.
3. Tenant context provides routing information.
4. The request is sent to the appropriate regional infrastructure and shard.
5. The service processes the operation.

| Approach | Advantages | Disadvantages |
|---|---|---|
| Single database | Simple initially | Scaling and failure bottleneck |
| Vertical scaling | Easy to implement | Hardware limits and cost |
| Horizontal sharding | Scales workloads | Routing and migration complexity |
| Dedicated database per tenant | Stronger physical isolation | Higher operational cost |

Sharding is useful when one database cannot economically or reliably handle the workload. It adds complexity to cross-shard queries, migrations, rebalancing and operations.

---

# 3. Jira architecture

## 3.1 What Jira manages

Jira is a work-item management and workflow platform.

Its responsibilities include:

1. Creating and managing work items.
2. Managing projects.
3. Assigning work to users.
4. Managing workflows.
5. Tracking status transitions.
6. Managing permissions.
7. Maintaining work-item relationships.
8. Supporting search and reporting.

Example:

```text
BANKING PROJECT
   |
   +--- BANKING-101: Login API development
   |
   +--- BANKING-102: Implement JWT authentication
   |
   +--- BANKING-103: Fix payment timeout bug
```

## 3.2 Jira logical components

| Component | Responsibility |
|---|---|
| Project Service | Project creation and configuration |
| Work Item Service | Create, update and retrieve issues |
| Workflow Service | Manage statuses and transitions |
| User and Group Service | Users, groups and memberships |
| Permission Service | Authorization |
| Comment Service | Work-item discussions |
| Attachment Service | File management |
| Search Service | JQL and issue retrieval |
| Notification Service | Emails and in-app notifications |
| Reporting Service | Dashboards and analytics |

These are logical responsibilities. They should not all be interpreted as separate deployed microservices.

## 3.3 Jira work-item data model

A simplified relational schema:

```sql
CREATE TABLE projects (
    id BIGINT PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL,
    project_key VARCHAR(50) NOT NULL,
    name VARCHAR(255)
);

CREATE TABLE work_items (
    id BIGINT PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL,
    project_id BIGINT NOT NULL,
    issue_key VARCHAR(100) NOT NULL,
    summary VARCHAR(500),
    description TEXT,
    status_id BIGINT,
    assignee_id BIGINT,
    reporter_id BIGINT,
    priority_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE work_item_comments (
    id BIGINT PRIMARY KEY,
    work_item_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP
);

CREATE TABLE work_item_history (
    id BIGINT PRIMARY KEY,
    work_item_id BIGINT NOT NULL,
    changed_by BIGINT,
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP
);
```

This is illustrative, not Jira's actual production schema.

Why relational storage is a natural fit:

- Projects contain many work items.
- Work items reference users.
- Work items have comments and history.
- Work items have labels and relationships.
- Transactions and referential integrity matter.

Atlassian's historical Jira implementation used a relational database and OfBiz Entity Engine. Jira Cloud has evolved beyond the original tightly coupled persistence model.

## 3.4 Jira workflow engine

Example lifecycle:

```text
TO DO -> IN PROGRESS -> IN REVIEW -> DONE
```

A transition must evaluate:

1. Is the transition allowed from the current status?
2. Does the user have permission?
3. Are required fields populated?
4. Are conditions satisfied?
5. Do validators pass?
6. What post-transition actions should execute?

Illustrative implementation:

```javascript
async function transitionIssue(issue, transition, user) {
  const allowed = await workflow.canTransition(
    issue.status,
    transition
  );

  if (!allowed) {
    throw new Error("Invalid transition");
  }

  await permission.check(user, "TRANSITION_ISSUE");
  await validators.execute(issue, transition);

  await database.transaction(async (tx) => {
    await tx.workItems.update({
      id: issue.id,
      status: transition.to
    });

    await tx.history.create({
      issueId: issue.id,
      oldStatus: issue.status,
      newStatus: transition.to,
      changedBy: user.id
    });
  });

  await eventPublisher.publish("ISSUE_TRANSITIONED", {
    issueId: issue.id
  });
}
```

This is an architectural example, not Jira source code.

Why a workflow engine instead of simple status updates?

Different organizations have different business processes. Banking may require security approval; healthcare may require compliance verification; software teams may require code review. Configurable workflows avoid hardcoding every process.

Advantages:
- Flexible business processes.
- Reusable workflow definitions.
- Configurable validations.
- Auditable transitions.

Disadvantages:
- Complex configuration.
- Difficult debugging with many conditions.
- Additional processing overhead.
- Workflow changes can affect existing projects.

## 3.5 Jira search and JQL

Example JQL:

```sql
project = BANKING
AND status = "In Progress"
AND assignee = currentUser()
ORDER BY priority DESC
```

A naive implementation would execute every search directly against the transactional database. At scale, a specialized search index is more appropriate.

Conceptual indexing flow:

```text
       CREATE / UPDATE ISSUE
                |
                v
        Transactional Database
                |
                v
          Change Event
                |
                v
         Event Processing
                |
                v
          Search Index
                |
                v
          JQL Search API
                |
                v
           Search Results
```

This resembles CQRS:

- Write operations update the transactional source of truth.
- Search operations use a specialized index.
- Index updates can happen asynchronously.

| Relational database | Search engine |
|---|---|
| Strong transactional consistency | Optimized for retrieval |
| Joins and relational queries | Full-text search |
| Transactional writes | Fast filtering and ranking |
| Structured indexing | Inverted indexes |
| Source of truth | Derived search representation |

Trade-off: eventual consistency. An issue may be updated before its search index entry is refreshed.

Atlassian has publicly described Elasticsearch-based Confluence search and streaming-based indexing. Jira's newer architecture also emphasizes decoupled data replication and CDC. Do not assume every Jira search implementation is identical to Confluence search.

## 3.6 Jira caching

Jira is a read-heavy system. Atlassian has discussed an approximately 10:1 read-to-write ratio in its Jira architecture material.

Frequently accessed data can include:
- Project metadata.
- User profiles.
- Workflow configuration.
- Issue metadata.
- Permissions.
- Frequently accessed work items.

Conceptual layers:

| Layer | Purpose |
|---|---|
| Browser cache | Static assets and reusable client data |
| CDN / Edge cache | Static content near users |
| Application cache | Frequently accessed application data |
| Distributed cache | Shared cache across instances |
| Database buffer cache | Frequently accessed database pages |

Do not assume every service uses the same cache product or configuration.

Cache invalidation is difficult. If one user changes an issue while another user has stale cached data, the system needs mechanisms such as invalidation events, versioned keys, TTLs or refresh.

Permission-sensitive cache entries must account for authorization changes.

## 3.7 Jira notifications and asynchronous processing

A work-item update may trigger notifications, activity feeds, automation rules and dashboard updates. The primary HTTP request should not need to wait for every secondary operation.

```text
       ISSUE ASSIGNED
              |
              v
        Database Commit
              |
              v
        Durable Event
              |
              v
         Message Queue
              |
      +-------+-------+
      |       |       |
      v       v       v
    Email  Activity  Automation
    Worker   Worker    Worker
```

Benefits:
- Faster API response.
- Independent scaling.
- Failure isolation.
- Retry support.
- Better throughput.

A transactional outbox or equivalent durable publication mechanism helps prevent the database update succeeding while the associated event is lost.

---

# 4. Confluence architecture

## 4.1 What Confluence manages

Confluence is a knowledge management and collaboration platform.

Example content hierarchy:

```text
ENGINEERING SPACE
    |
    +--- Architecture
    |       +--- System Design
    |       +--- Database Design
    |       +--- API Documentation
    |
    +--- Product Requirements
    |       +--- Authentication Requirements
    |       +--- Payment Requirements
    |
    +--- Meeting Notes
    |
    +--- Release Documentation
```

Core entities:

| Entity | Responsibility |
|---|---|
| Organization | Customer account |
| Space | Logical content workspace |
| Page | Documentation document |
| Blog post | Published update |
| Attachment | Uploaded file |
| Comment | Discussion |
| Label | Content classification |
| Page version | Content history |
| Permission | Access control |

## 4.2 Confluence logical components

```text
              CONFLUENCE FRONTEND
                       |
                       v
                   API LAYER
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
   Content Service  Editor Service  Permission Service
        |              |              |
        v              v              v
   Page Storage   Collaboration     Access Control
                       Engine
        |              |
        +--------------+
                       |
              +--------+--------+
              |        |        |
              v        v        v
           Search    Media    Notifications
```

These are logical capabilities, not a claim that each is one independently deployed Atlassian service.

## 4.3 Confluence page storage

A page contains more than plain text. It can contain headings, paragraphs, tables, images, code blocks, embedded objects, relationships and version information.

Simplified data model:

```text
SPACES
  |
  +--- PAGES
          |
          +--- PAGE_VERSIONS
          |
          +--- PAGE_PERMISSIONS
          |
          +--- COMMENTS
          |
          +--- ATTACHMENTS
```

Illustrative schema:

```sql
CREATE TABLE spaces (
    id BIGINT PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL,
    space_key VARCHAR(100),
    name VARCHAR(255)
);

CREATE TABLE pages (
    id BIGINT PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL,
    space_id BIGINT NOT NULL,
    parent_page_id BIGINT,
    title VARCHAR(500),
    current_version INT,
    created_by BIGINT,
    created_at TIMESTAMP
);

CREATE TABLE page_versions (
    id BIGINT PRIMARY KEY,
    page_id BIGINT NOT NULL,
    version_number INT,
    content JSON,
    updated_by BIGINT,
    updated_at TIMESTAMP
);

CREATE TABLE page_comments (
    id BIGINT PRIMARY KEY,
    page_id BIGINT NOT NULL,
    author_id BIGINT,
    content TEXT,
    created_at TIMESTAMP
);
```

This is illustrative, not the actual Confluence schema.

Relational storage supports relationships between spaces, pages, parent pages, versions, users, permissions and comments.

Atlassian has publicly documented PostgreSQL-based storage in its earlier Confluence Cloud Vertigo architecture. Current internal storage is more distributed and should not be reduced to one PostgreSQL database.

## 4.4 Collaborative editing

Suppose three users edit the same page simultaneously. The editor must prevent one user's changes from silently overwriting another user's changes.

A naive last-write-wins strategy can lose edits:

- User A adds "Authentication".
- User B adds "Authorization".
- Both submit full document snapshots.
- The later save overwrites the earlier one.

Confluence Cloud supports real-time collaborative editing and shared drafts.

Conceptual flow:

```text
           USER A EDITOR
                 |
                 v
           Change Operation
                 |
                 v
        Collaboration Engine
                 |
          +------+------+
          |             |
          v             v
      USER B         USER C
       EDITOR         EDITOR
          |             |
          +------+------+
                 |
                 v
          Shared Document
                 |
                 v
           Persistent Save
```

Two common collaborative editing approaches:

**Operational Transformation (OT)**

OT transforms concurrent editing operations so they can be applied consistently.

**Conflict-free Replicated Data Types (CRDTs)**

CRDTs represent data so independently applied changes can converge under defined conditions.

Do not claim Confluence uses one specific algorithm across all editor versions without verifying the relevant implementation. OT and CRDT are general collaborative-editing techniques, not interchangeable labels for Atlassian's implementation.

Production concerns:
- Preserve unsynchronized local edits.
- Detect network disconnection.
- Reconnect and synchronize outstanding changes.
- Resolve concurrent operations.
- Confirm durable persistence.
- Avoid treating visible local text as proof of a successful save.

Advantages:
- Multiple users can edit simultaneously.
- Reduced editing conflicts.
- Real-time collaboration.

Disadvantages:
- Complex synchronization.
- Network interruption handling.
- More sophisticated conflict resolution.
- Additional coordination and persistence complexity.

## 4.5 Attachments and object storage

Large PDFs, images, videos and spreadsheets are usually better suited to object storage than to a relational database.

```text
          USER UPLOADS FILE
                  |
                  v
            MEDIA SERVICE
                  |
                  v
            OBJECT STORAGE
                  |
                  v
                  S3

          METADATA DATABASE
                  |
                  v
          FILE ID / TENANT ID
```

The database can store metadata:

```json
{
  "fileId": "file-101",
  "tenantId": "company-A",
  "fileName": "architecture.pdf",
  "storageKey": "company-A/file-101",
  "size": 10485760
}
```

This is an illustrative example. Atlassian documents a shared Media Platform; historical Cloud security material described S3-backed attachment storage. Do not treat historical details as a complete description of today's implementation.

Why object storage:
- Optimized for large binary objects.
- Durable and cost-effective.
- Scales independently from relational data.
- Avoids database bloat.

Trade-offs:
- Metadata must be managed separately.
- Access control must be enforced.
- Upload/download workflows need secure authorization.
- Object lifecycle and retention need management.

## 4.6 Confluence search

For hundreds of thousands of pages, searching every document directly in the primary database is inefficient.

Atlassian has publicly described Confluence search using AWS-managed Elasticsearch and Kinesis-based streaming.

Indexing flow:

```text
       CREATE CONFLUENCE PAGE
                  |
                  v
          SAVE PAGE TO DB
                  |
                  v
          INDEXING EVENT
                  |
                  v
          KINESIS STREAM
                  |
                  v
          INDEXER SERVICE
                  |
                  v
        ELASTICSEARCH INDEX
```

Search flow:

```text
         USER SEARCH QUERY
                  |
                  v
             SEARCH API
                  |
                  v
           SEARCH ENGINE
                  |
                  v
         FILTER BY PERMISSIONS
                  |
                  v
          RETURN RESULTS
```

The search index is not the source of truth; it is a derived representation.

Security requirement: search results must respect the user's permissions. Indexed content must not become visible to unauthorized users.

Elasticsearch advantages:
- Full-text search.
- Inverted indexes.
- Relevance scoring.
- Distributed search.
- Filtering and aggregations.
- Horizontal scalability.

Trade-offs:
- Eventual consistency.
- Index maintenance.
- Reindexing complexity.
- Permission synchronization challenges.
- Additional infrastructure and cost.

---

# 5. How Jira and Confluence communicate

Example: a product manager writes a payment gateway requirement in Confluence. Developers create Jira work items linked to that requirement.

```text
                USER
                 |
        +--------+--------+
        |                 |
        v                 v
      JIRA            CONFLUENCE
        |                 |
        v                 v
   Jira APIs          Confluence APIs
        |                 |
        +--------+--------+
                 |
                 v
       ATLASSIAN PLATFORM
                 |
        +--------+--------+
        |                 |
        v                 v
   Identity Service   Integration Layer
        |                 |
        +--------+--------+
                 |
                 v
           LINKED CONTENT
```

Example page:

```text
Payment Gateway Architecture

Requirements:
- Implement payment initiation.
- Support payment callbacks.
- Implement transaction verification.

Related Jira Issues:
- PAY-101
- PAY-102
- PAY-103
```

A simplified integration flow:

1. A user inserts a Jira issue URL into Confluence.
2. Confluence recognizes the URL.
3. The integration resolves the Jira resource.
4. Authorized APIs retrieve relevant metadata.
5. Confluence renders the issue as a card or embedded content.
6. Access is checked against the user's permissions.

Jira owns Jira work-item data. Confluence owns Confluence content. The products should not directly query each other's internal databases.

Why APIs instead of shared databases?

- Independent schema evolution.
- Independent deployment.
- Clear data ownership.
- Centralized validation and authorization.
- Reduced coupling.
- Better failure boundaries.

---

# 6. Technology stack and why it fits

This section summarizes publicly documented technologies and their architectural roles. It is not a complete inventory of Atlassian's internal production code.

## 6.1 Infrastructure and backend technologies

| Technology | Purpose | Architectural reason | Trade-off |
|---|---|---|---|
| AWS | Cloud hosting | Global infrastructure and managed services | Vendor dependency |
| Kubernetes | Container orchestration | Service deployment and scaling | Operational complexity |
| Micros | Internal PaaS | Standardized service provisioning | Platform dependency |
| PostgreSQL | Relational storage | Transactions and relational data | Scaling requires planning |
| Amazon S3 | Object storage | Durable binary storage | Separate metadata management |
| Amazon SQS | Message queues | Asynchronous workloads | Eventual processing |
| Amazon Kinesis | Event streaming | High-throughput event pipelines | Operational and cost complexity |
| Elasticsearch | Search | Full-text retrieval and indexing | Eventual consistency |
| Memcached | Caching | Fast in-memory access | Cache invalidation |

Verification notes:
- AWS, Micros, Kubernetes, PostgreSQL-based Confluence shard storage, SQS, EC2 and Memcached appear in Atlassian architecture material.
- Kinesis and AWS-managed Elasticsearch are documented in Confluence search architecture.
- S3 appears in historical Cloud attachment-storage documentation.
- These technologies are not necessarily used identically in every current service.

## 6.2 Architectural patterns

| Pattern | Purpose | Advantage | Disadvantage |
|---|---|---|---|
| Microservices | Separate capabilities | Independent deployment | Distributed complexity |
| Multi-tenancy | Share infrastructure | Cost efficiency | Isolation complexity |
| Sharding | Distribute tenant workloads | Horizontal scalability | Routing complexity |
| CQRS | Separate reads and writes | Read optimization | Multiple data representations |
| Event-driven architecture | Async processing | Loose coupling | Eventual consistency |
| Caching | Reduce database load | Lower latency | Invalidation complexity |
| API-based integration | Product communication | Loose coupling | Network dependency |
| Object storage | Store attachments | Cost-effective binary storage | Separate metadata management |
| Search indexing | Fast retrieval | Efficient full-text search | Index synchronization |

## 6.3 Why not MongoDB everywhere?

MongoDB is useful for document-oriented workloads. Jira and Confluence also have many structured relationships:

- Organizations.
- Projects.
- Users.
- Work items.
- Comments.
- Permissions.
- Content hierarchies.
- Version history.

Relational databases provide mature transaction management and relational querying. MongoDB could technically support these models, but using it everywhere would not automatically improve scalability or performance.

The correct database decision is workload-driven, not popularity-driven.

## 6.4 Why not Redis as the primary database?

Redis is useful for caching, rate limiting, counters and ephemeral state. It is not the right default source of truth for an enterprise work-management domain requiring durable records, relational queries and complex transactions.

## 6.5 Why not Kafka for everything?

Kafka is useful for high-throughput event streaming, replayable event logs and distributed event processing. Not every asynchronous operation needs Kafka:

- A simple background job may use a queue.
- A durable high-volume event stream may use a streaming platform.
- A direct request may use HTTP.

Atlassian's documented Confluence search architecture uses Kinesis. The broader lesson is to choose infrastructure based on workload and platform constraints, not fashion.

---

# 7. Security architecture

## 7.1 Authentication versus authorization

- **Authentication:** Who are you?
- **Authorization:** What are you allowed to access?

Conceptual flow:

```text
User logs in
     |
     v
Identity Verification
     |
     v
Authenticated Session
     |
     v
Tenant Identification
     |
     v
Permission Verification
     |
     v
Resource Access
```

A user may have one Atlassian account but still require product access and resource-specific permissions.

## 7.2 Permission architecture

Authorization may consider:
- Organization membership.
- Product access.
- Group membership.
- Project permissions.
- Space permissions.
- Page restrictions.
- Resource-specific permissions.

## 7.3 Service-to-service security

Services should not blindly trust each other.

Atlassian documents service authentication and authorization approaches including ASAP, signed JWT-based mechanisms, service allowlists and least-privilege access.

Additional security mechanisms:

| Mechanism | Purpose |
|---|---|
| TLS | Encrypt network traffic |
| Encryption at rest | Protect stored information |
| JWT | Carry signed identity or authorization claims |
| RBAC | Role-based access control |
| Least privilege | Restrict service permissions |
| Tenant isolation | Prevent cross-customer access |
| Audit logs | Track sensitive operations |
| Rate limiting | Prevent abuse and resource exhaustion |

---

# 8. Reliability and fault tolerance

A distributed system cannot assume every service is always available.

Suppose an issue update succeeds, but the notification service is unavailable. The issue update should normally remain committed; notification delivery can retry asynchronously.

```text
             UPDATE ISSUE
                  |
                  v
            JIRA SERVICE
                  |
                  v
          DATABASE COMMIT
                  |
                  v
           DURABLE EVENT
                  |
                  v
             EVENT QUEUE
                  |
           +------+------+
           |             |
           v             v
       NOTIFICATION   ACTIVITY FEED
          WORKER         WORKER
           |             |
           v             v
          FAIL          SUCCESS
           |
           v
       RETRY / DLQ
```

Important patterns:

| Pattern | What it solves | Example |
|---|---|---|
| Circuit breaker | Prevents cascading failures | Notification service unavailable |
| Retry with backoff | Temporary failures | Database connection interruption |
| Idempotency | Duplicate requests | Repeated issue transition |
| Dead-letter queue | Persistent message failures | Invalid notification event |
| Timeout | Unresponsive services | Search API |
| Bulkhead | Resource isolation | Separate worker pools |
| Outbox pattern | Lost event publication | Issue update plus event |
| Multi-AZ deployment | Infrastructure failure | Availability Zone failure |

Atlassian's Jira engineering material discusses bounded retries, circuit breakers, timeouts and idempotent operations.

## 8.1 Database availability

Atlassian has documented multi-AZ Amazon RDS deployments for Jira and Confluence Cloud, including synchronous standby replicas. Its published failover discussion gives a typical range of around 60–120 seconds. This is not a guarantee that every application operation recovers within that interval.

---

# 9. Why Atlassian evolved its architecture

Jira did not start as the modern distributed cloud platform it is today.

Its early architecture was more tightly coupled and used OfBiz Entity Engine for persistence.

As Cloud requirements grew, challenges included:
1. Single-tenant database assumptions.
2. Tight coupling between business logic and persistence.
3. Long-lived in-memory cache assumptions.
4. Plugin execution complexity.
5. Scaling large customer workloads.
6. Replicating data to specialized services.

Conceptual evolution:

```text
Stage 1: Traditional application
         Core logic + plugins + relational persistence
                         |
                         v
Stage 2: Cloud migration
         AWS infrastructure + tenant isolation
                         |
                         v
Stage 3: Cloud-native evolution
         Sharding + specialized data services + caching
                         |
                         v
Stage 4: Data decoupling
         CDC + replication + search + analytics
```

Why not rewrite everything from scratch?

A rewrite risks losing years of business logic, customer data compatibility, plugin functionality and backward compatibility. It also introduces migration and downtime risks.

Incremental modernization allows the organization to isolate bottlenecks and improve architecture without destabilizing the entire product.

**Architectural lesson:** Modernization does not necessarily mean replacing everything. It means changing the highest-impact components while preserving business continuity.

---

# 10. Technology selection: alternatives and trade-offs

| Requirement | Selected approach | Alternative | Why the alternative may not fit |
|---|---|---|---|
| Cloud hosting | AWS | Self-hosted data centers | Higher infrastructure management burden |
| Service orchestration | Kubernetes / Micros | Manually managed VMs | Less automated scaling and deployment |
| Structured data | Relational databases | MongoDB everywhere | Relational and transactional requirements |
| Search | Elasticsearch | SQL LIKE queries | Poor fit for large-scale full-text search |
| Attachments | Object storage | Store everything in SQL | Database bloat and storage costs |
| Background processing | Queues / event streams | Synchronous HTTP | Higher latency and tighter coupling |
| Caching | In-memory / distributed cache | Database for every read | Increased database load |
| Tenant separation | Tenant context and logical isolation | Dedicated infrastructure for everyone | Higher infrastructure cost |
| Scaling | Horizontal sharding | One large database | Hardware and failure bottlenecks |
| Integration | APIs and platform services | Shared database access | Tight coupling and security issues |

These are architectural trade-offs, not claims that Atlassian rejected every alternative. Dedicated infrastructure can be appropriate for some enterprise customers.

---

# 11. Jira vs Confluence architecture comparison

| Feature | Jira | Confluence |
|---|---|---|
| Primary purpose | Work management | Knowledge management |
| Main entity | Work item | Page |
| Data structure | Structured entities | Hierarchical content |
| Main operations | Create, update, transition | Create, edit, publish |
| Search | JQL and issue search | Full-text content search |
| Workflow | Configurable state transitions | Draft and publishing lifecycle |
| Collaboration | Comments, activity, assignments | Real-time collaborative editing |
| Versioning | Issue history | Page versions |
| Attachments | Issue attachments | Page attachments |
| Integration | Confluence, Bitbucket, etc. | Jira and other Atlassian apps |
| Main challenge | Workflow and query scalability | Content storage and collaboration |

---

# 12. How to design a simplified Jira + Confluence system

Assume:
- 100,000 registered users.
- 10,000 concurrent users at peak.
- Multiple organizations.
- Projects, work items and documentation.
- Jira-like work management.
- Confluence-like documentation.

These are hypothetical requirements, not Atlassian production metrics.

## 12.1 Proposed architecture

```text
                  REACT FRONTEND
                         |
                         v
                    API GATEWAY
                         |
                         v
                IDENTITY SERVICE
                         |
                         v
                 TENANT SERVICE
                         |
             +-----------+-----------+
             |                       |
             v                       v
       JIRA SERVICES           CONFLUENCE SERVICES
             |                       |
      +------+------+          +-----+------+
      |      |      |          |     |      |
      v      v      v          v     v      v
   Issue  Workflow Comment   Page  Editor  Permission
   API      API     API      API    API      API
      |      |      |          |     |      |
      +------+------+          +-----+------+
             |                       |
             v                       v
         PostgreSQL              PostgreSQL
             |                       |
             +-----------+-----------+
                         |
                  EVENT STREAM
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
        Search        Notification    Analytics
        Indexer          Worker        Worker
          |              |              |
          v              v              v
     OpenSearch       Email/Push     Data Lake

                 SHARED SERVICES
                         |
               +---------+---------+
               |                   |
               v                   v
             Redis                 S3
```

This is a proposed architecture. In production, Jira-like and Confluence-like domains should own their data independently rather than share one database.

## 12.2 Proposed technology stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + TypeScript | Component-based application |
| Frontend state | Redux Toolkit | Complex shared application state |
| Backend | Node.js + TypeScript | Efficient I/O-bound API services |
| API | REST + GraphQL where justified | Resource APIs and flexible aggregation |
| Database | PostgreSQL | Relational data and transactions |
| Cache | Redis | Frequently accessed data |
| Queue | AWS SQS | Background jobs |
| Event streaming | Kafka or Kinesis | High-volume event pipelines |
| Search | OpenSearch | Full-text search |
| Attachments | AWS S3 | Object storage |
| Authentication | OIDC | Centralized identity |
| Authorization | RBAC + resource-level policies | Fine-grained access |
| Deployment | Kubernetes or AWS ECS | Container orchestration |
| Observability | OpenTelemetry | Distributed tracing |
| CI/CD | GitHub Actions | Automated deployment |

### Why Node.js?

Node.js is a good fit for API-heavy applications because it handles concurrent I/O efficiently. CPU-intensive tasks such as document processing, large exports and complex analytics should move to worker processes or dedicated compute services.

### Why PostgreSQL?

Core business data has strong relational characteristics. PostgreSQL provides transactions, constraints, indexes, JSONB for flexible metadata, relational querying and mature backup and replication options.

### Why Redis?

Use it for frequently accessed project metadata, rate limiting, distributed counters and carefully managed caching. Do not use it as the primary source of truth.

### Why SQS?

Notifications, exports and background operations should not block primary APIs. SQS provides managed queues, retries and dead-letter queue support.

### Why OpenSearch?

Users need to search large numbers of work items and documentation pages. A specialized search engine is more appropriate than running every full-text query against PostgreSQL.

### Why not build everything as microservices immediately?

Start with modular domain boundaries. Split services when independent scaling, deployment, ownership or reliability requirements justify the additional complexity. For an initial product, a modular monolith can be the better choice.

---

# 13. Interview preparation

## 13.1 Important concepts

| Concept | What you should be able to explain |
|---|---|
| Multi-tenancy | How organizations share infrastructure securely |
| Sharding | How customer data is distributed |
| Tenant Context | How tenant identity propagates across services |
| Microservices | How product capabilities are independently managed |
| CQRS | Why read and write workloads may use different models |
| CDC | How database changes propagate to other services |
| Event-driven architecture | How asynchronous processing works |
| Eventual consistency | Why search results can temporarily be outdated |
| Distributed caching | How frequently accessed data is served |
| Collaborative editing | How concurrent document changes are synchronized |
| Object storage | Why attachments are stored separately |
| Search indexing | How full-text search scales |
| API Gateway | How requests enter the platform |
| RBAC | How enterprise permissions are enforced |
| Circuit breakers | How cascading failures are prevented |
| Observability | How failures are traced across services |

## 13.2 Interview questions

### A. System architecture

1. Explain the high-level architecture of Jira.
2. Explain the high-level architecture of Confluence.
3. Why does Atlassian use microservices?
4. Why is multi-tenancy important for SaaS platforms?
5. How does Atlassian isolate customer data?
6. What is the Tenant Context Service?
7. How does sharding improve scalability?
8. What happens if one shard becomes unavailable?

### B. Database and performance

9. Why use relational databases for Jira?
10. Why should attachments be stored in object storage?
11. What is CQRS?
12. What is Change Data Capture?
13. Why does Jira need a separate search architecture?
14. How does Elasticsearch indexing work?
15. What is eventual consistency?
16. How would you prevent cache invalidation issues?

### C. Distributed systems

17. How do microservices communicate?
18. When should you use synchronous versus asynchronous communication?
19. What happens when a notification service fails?
20. Explain the transactional outbox pattern.
21. What is idempotency?
22. How do circuit breakers work?
23. How do you prevent duplicate event processing?
24. How do you handle distributed transactions?

### D. Confluence-specific

25. How would you design real-time collaborative editing?
26. What is Operational Transformation?
27. What are CRDTs?
28. How do you resolve concurrent document updates?
29. How would you design document versioning?
30. How would you implement full-text document search?
31. How would you secure private documents in search results?

### E. Architectural decisions

32. Why PostgreSQL instead of MongoDB?
33. Why Redis instead of PostgreSQL for caching?
34. Why object storage instead of database BLOBs?
35. Why not use Kafka for every background operation?
36. When would you choose a modular monolith over microservices?
37. How would you migrate a legacy monolith to microservices without downtime?

---

# 14. Official technical resources

Read these resources to understand actual Atlassian engineering decisions rather than relying only on generic architecture diagrams.

1. **Atlassian Cloud architecture** – AWS, multi-tenancy, tenant isolation, Micros, security and deployment.
   - https://www.atlassian.com/engineering/cloud-architecture

2. **Jira performance architecture** – Legacy architecture, OfBiz, sharding, caching and read optimization.
   - https://www.atlassian.com/engineering/how-we-unlocked-performance-at-scale-with-jira-platform

3. **Confluence Cloud architecture** – Project Vertigo, PostgreSQL, SQS, Memcached and horizontal scaling.
   - https://www.atlassian.com/engineering/scaling-rearchitecting-and-decomposing-confluence-cloud

4. **Confluence search architecture** – Kinesis, Elasticsearch, asynchronous indexing and search.
   - https://www.atlassian.com/engineering/revamping-confluence-cloud-search

5. **Confluence collaborative editing** – Shared drafts and real-time editing.
   - https://support.atlassian.com/confluence-cloud/docs/collaborative-editing/

6. **Jira Cloud developer documentation** – APIs, extensions and platform capabilities.
   - https://developer.atlassian.com/cloud/jira/platform/

Note: URLs and documentation locations can change. Search the official Atlassian Engineering or Support sites if a link has moved.

---

# 15. Architectural assessment

The most important engineering decisions in Atlassian's architecture are not simply the technologies it selected. They are decisions about data ownership, isolation, scalability and consistency.

Five core principles:

1. **Multi-tenancy:** Share infrastructure without sharing customer data.
2. **Domain separation:** Jira owns work management; Confluence owns knowledge management.
3. **Data decoupling:** Use specialized representations for search, analytics and other read-heavy workloads.
4. **Asynchronous processing:** Separate critical transactions from secondary operations.
5. **Incremental modernization:** Evolve legacy systems without unnecessarily rewriting mature business functionality.

This explanation focuses on **Atlassian Cloud**. Jira and Confluence Data Center have different deployment and operational architectures, including customer-managed infrastructure. Do not mix the two when discussing architecture in interviews.

## Recommended study priority

Study these topics deeply:

- Multi-tenancy and tenant isolation.
- Jira workflow engine.
- CQRS, CDC and search indexing.
- Confluence collaborative editing.
- Object storage and attachment handling.
- Jira–Confluence integration.
- Security and permission enforcement.
- Reliability patterns and failure handling.

These topics provide the strongest foundation for explaining Atlassian's architecture and defending technology choices in a system design interview.
