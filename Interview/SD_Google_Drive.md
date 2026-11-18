# Google Drive System Architecture – Complete System Design

> **Scope note:** Google does not publicly disclose the complete internal implementation of Google Drive. This document distinguishes publicly documented Google technologies from reasonable architectural inferences and proposed implementation choices. Do not assume every Google Drive component directly uses every Google infrastructure technology discussed here.

## 1. Overview

Google Drive is a distributed cloud-based file storage, synchronization, collaboration, and sharing platform. It is not simply a file upload/download application. It combines several distributed systems:

1. Distributed object/file storage – storing file contents.
2. Metadata management – storing file names, owners, permissions, folders, and attributes.
3. Synchronization – keeping files consistent across devices.
4. Collaboration – allowing multiple users to edit documents simultaneously.
5. Access control – managing file and folder permissions.
6. Search and indexing – finding files quickly.
7. Notifications – informing users about changes.
8. Caching and content delivery – providing low-latency access.

## 2. Requirements

### Functional requirements

| Feature | Description |
|---|---|
| File upload | Upload files of different sizes and formats |
| File download | Download files from cloud storage |
| Folder management | Create, rename, move, and delete folders |
| File management | Rename, copy, move, and delete files |
| File sharing | Share files with specific users |
| Permissions | Viewer, commenter, editor, and owner access |
| Synchronization | Synchronize changes across devices |
| Collaboration | Multiple users edit documents simultaneously |
| Version history | Maintain previous versions |
| Search | Search by name, type, owner, content, etc. |
| Offline access | Access cached files without an internet connection |
| Recovery | Recover deleted files subject to retention policies |

### Non-functional requirements

- Availability: users should be able to access files reliably.
- Durability: uploaded files must not disappear.
- Scalability: support enormous numbers of users and files.
- Consistency: users should see correct file and permission states.
- Low latency: file listing and downloads should be fast.
- Security: prevent unauthorized file access.
- Fault tolerance: continue operating despite server failures.
- Data integrity: prevent corruption during uploads and downloads.
- Disaster recovery: recover from infrastructure-level failures.

### Different data needs different consistency

- Permissions require strong authorization correctness.
- Metadata requires reliable updates.
- Search indexes can tolerate some indexing delay.
- File content must be durably stored.
- Real-time collaboration requires coordinated concurrent updates.

One consistency model is not necessarily optimal for every workload.

## 3. High-Level Architecture

```text
                 CLIENT APPLICATIONS
        +------------+--------------+
        | Web App    | Mobile App   |
        | Desktop    | API Clients  |
        +------------+--------------+
                       |
                       v
              GLOBAL LOAD BALANCER
                       |
                       v
                  API GATEWAY
                       |
       +---------------+----------------+
       |               |                |
       v               v                v
 Authentication   Metadata/File     Upload/Download
 Service          Service           Service
       |               |                |
       |               v                v
       |          Metadata DB      Distributed Storage
       |               |                |
       |               v                |
       |             Cache              |
       |                                |
       +----------------+---------------+
                        |
          +-------------+--------------+
          |             |              |
          v             v              v
      Permission      Sync         Collaboration
       Service       Service         Service
          |             |              |
          +-------------+--------------+
                        |
                        v
                    EVENT STREAM
                        |
          +-------------+--------------+
          |             |              |
          v             v              v
      Search        Notification     Audit Logs
      Index         Service
```

This is a conceptual service decomposition, not Google's published production architecture.

## 4. Client Applications

Google Drive supports web, Android, iOS, desktop synchronization clients, and third-party applications through APIs.

A client should not directly access internal storage infrastructure. It communicates through authenticated APIs and backend services.

Benefits:
- Centralized authentication and authorization.
- Request validation and rate limiting.
- Consistent business logic.
- Storage abstraction.
- Easier API evolution.

Direct-to-storage transfers can be useful for large files, but should use short-lived, authorized upload/download capabilities rather than unrestricted access.

## 5. Load Balancer and API Gateway

The load balancer distributes requests across healthy backend instances. The API gateway handles concerns such as:

- Authentication token validation.
- Routing.
- Rate limiting.
- Request validation.
- API versioning.
- Request tracing.

Possible communication choices:

| Technology/design | Purpose | Advantages | Disadvantages |
|---|---|---|---|
| Global load balancing | Geographic request routing | Low latency, availability | Complex routing |
| HTTP/2 or HTTP/3 | Efficient communication | Multiplexing, lower overhead | Protocol complexity |
| gRPC | Internal service communication | Efficient serialization, streaming | Less browser-friendly |
| REST | Public API communication | Simple, interoperable | More serialization overhead |

These are architectural options, not a verified list of Google's internal Drive implementation.

## 6. Authentication

Authentication answers: **Who is making this request?**

A simplified flow:

```text
User -> Google Login -> Identity Verification
     -> Access Token / Session -> Drive API
     -> Token Validation -> Authorized User Context
```

Authentication does not automatically authorize access to every file. A user must also have an applicable permission for the requested resource.

Centralized identity provides:
- One identity across products.
- Centralized account security.
- Consistent authentication policies.
- Easier session management.

Trade-offs:
- Identity infrastructure becomes critical.
- An outage can affect multiple products.
- Security vulnerabilities can have a large blast radius.

## 7. File Upload Architecture

A naive upload architecture routes the entire file through an application server and saves it. This causes memory pressure, timeouts, poor recovery after network failures, and application-server bottlenecks.

### Resumable upload

For a large file, the client initiates an upload session and transfers the content in chunks.

```text
Original File
    |
    v
Divide Into Chunks
    |
    +--> Chunk 1
    +--> Chunk 2
    +--> Chunk 3
    +--> ...
    +--> Final Chunk
```

Typical flow:

1. Client requests an upload session.
2. Backend authenticates the user and validates the destination.
3. Backend creates an upload session or reservation.
4. Client uploads chunks.
5. If the network fails, the client queries confirmed progress.
6. Client resumes from the confirmed position.
7. System validates integrity and finalizes storage.
8. Metadata is committed and a file-created event is published.

Google Drive's public API supports resumable uploads. The exact internal chunk orchestration and storage implementation are not publicly specified.

### Upload approaches

| Approach | Advantages | Disadvantages |
|---|---|---|
| Single-request upload | Simple | Poor recovery for large files |
| Multipart upload | Parallel transfer possible | Requires coordination |
| Resumable upload | Recovers after interruption | Session management complexity |
| Streaming upload | Lower memory consumption | Requires stream lifecycle management |

Recommended design: resumable uploads with bounded parallelism. Excessive concurrency can overwhelm bandwidth and storage infrastructure.

### File integrity

A client and server can calculate checksums and compare them after transfer.

- SHA-256: strong content integrity verification.
- CRC32C: efficient accidental-corruption detection.

A checksum is not an authorization mechanism.

## 8. Distributed File Storage

A conventional application might save files on one server's local filesystem. This is difficult to scale because disks and machines have limited capacity, machines fail, and storage must grow independently of application servers.

Google has publicly documented **Colossus**, its distributed cluster-level file system and successor to Google File System (GFS).

Publicly documented Colossus concepts include:

| Component | Responsibility |
|---|---|
| Curators | Filesystem control and metadata operations |
| Bigtable | Stores Colossus filesystem metadata |
| D servers | Serve file data from network-attached disks |

Conceptual view:

```text
              Application
                   |
                   v
             Colossus Client
                   |
          +--------+--------+
          |                 |
          v                 v
       Curators          D Servers
          |                 |
          v                 v
       Bigtable         Disk Storage
       Metadata          File Data
```

An important design principle is separating control/metadata operations from file-data transfer. Clients can communicate with D servers for file data rather than routing all bytes through a centralized metadata server.

### Why distributed storage?

Advantages:
- Massive storage scalability.
- Fault tolerance.
- Independent storage scaling.
- Better management of large datasets.

Disadvantages:
- Complex distributed metadata.
- Network communication overhead.
- Distributed consistency challenges.
- High infrastructure and operational cost.

### Replication and erasure coding

Replication keeps multiple copies:

```text
Original Data
  +-- Replica 1
  +-- Replica 2
  +-- Replica 3
```

Advantages: straightforward recovery and fast reads.
Disadvantages: high storage overhead.

Erasure coding divides data into data fragments plus parity fragments. Missing fragments can be reconstructed within the scheme's tolerance.

Advantages: better storage efficiency than full replication.
Disadvantages: more computation, complex recovery, and potentially higher reconstruction latency.

Do not assume one replication or erasure-coding policy applies to every Drive file.

## 9. Metadata Database

The binary file and information about the file are different data.

Example metadata:

```text
File ID: file_123
Name: project.pdf
Size: 500 MB
Owner: user_123
Parent: folder_456
Permission: user_456 = Viewer
Storage Reference: internal object reference
```

Typical metadata fields:

| Field | Purpose |
|---|---|
| file_id | Unique file identifier |
| name | File name |
| mime_type | File format |
| owner_id | Owner |
| parent_id | Parent folder |
| size | File size |
| created_at | Creation timestamp |
| modified_at | Last modification |
| revision_id | Current revision |
| storage_reference | Internal object reference |
| trashed | Whether file is in trash |
| permissions | Access-control information |

This is a conceptual schema, not Google's actual internal database schema.

### Why separate metadata and content?

Metadata is relatively small and requires structured queries. File content can be hundreds of megabytes or gigabytes and requires high-capacity binary storage.

Separating them enables independent scaling and avoids large binary transfers competing with metadata queries.

### Spanner

Google developed **Spanner**, a globally distributed relational database. Its documented capabilities include:
- Horizontal distribution.
- Automatic sharding.
- Synchronous replication.
- Multi-version concurrency control.
- Distributed transactions.
- External consistency.

Spanner is a relevant example of Google's distributed database infrastructure. Public documentation does not establish that every Google Drive metadata record is stored in Spanner.

### Database trade-offs

| Technology | Advantages | Disadvantages |
|---|---|---|
| PostgreSQL | Strong SQL and transactions | Global horizontal distribution needs additional architecture |
| MongoDB | Flexible document model | Relational transactions and consistency need careful design |
| Cassandra | High write scalability | Limited relational querying and transaction model |
| Redis | Very fast reads | Not ideal as durable primary metadata storage |
| Spanner | Global distribution and strong consistency | Complexity and cost |

Select a database based on consistency, transaction, query, and scaling requirements—not simply because it is scalable.

## 10. Folder Management

A logical folder hierarchy does not have to represent the physical storage hierarchy.

Example:

```text
My Drive
  +-- Projects
  |     +-- Backend
  |     |     +-- api.pdf
  |     +-- Frontend
  |           +-- ui.pdf
  +-- Personal
        +-- photo.jpg
```

The metadata system stores relationships such as `parent_id`.

Moving a file can be a metadata update:

```text
Before: file_123 -> folder_A
After:  file_123 -> folder_B
```

The binary content can remain in the same physical storage location.

Benefits:
- Fast file moves.
- Independent physical storage organization.
- Easier sharing and indexing.

Trade-offs:
- Folder listing requires metadata queries.
- Recursive operations need careful handling.
- Permission inheritance can become complex.

## 11. Permission Management

Google Drive supports resource-specific sharing and roles such as viewer, commenter, and editor.

Conceptual ACL:

```json
{
  "fileId": "file_123",
  "permissions": [
    { "userId": "user_A", "role": "viewer" },
    { "userId": "user_B", "role": "commenter" },
    { "userId": "user_C", "role": "editor" }
  ]
}
```

This is illustrative, not an exact Google API response.

A permission check may consider:
- Ownership.
- Direct permissions.
- Inherited folder permissions.
- Shared drive membership.
- Link-based access.
- Organizational policies.
- Download and sharing restrictions.

### RBAC, ACL, ABAC, and ReBAC

- RBAC: permissions based on organizational roles. Simple, but often too coarse for individual file sharing.
- ACL: resource-specific permissions. Fine-grained, but permission lists can become large.
- ABAC: policies based on attributes and context. Flexible, but policy evaluation is complex.
- ReBAC: permissions based on relationships. Useful for sharing and inheritance, but relationship evaluation and consistency need care.

Recommended design: combine resource-level permissions with role definitions and relationship-based inheritance. Use attribute-based policies where contextual rules are required.

### Permission revocation

If a user loses access, stale authorization caches must not continue granting access.

Possible controls:
- Short-lived authorization caches.
- Permission versioning.
- Invalidation events.
- Revalidation before sensitive operations.
- Avoiding long-lived public download URLs.

A file may remain physically cached on a device, but the server must not grant new access after revocation.

## 12. Synchronization Engine

A synchronization system should transfer changes rather than repeatedly downloading the entire file listing.

### Change log

```text
Change 1001: file_123 CREATE
Change 1002: file_123 RENAME
Change 1003: file_123 UPDATE
```

Each client stores its last processed change cursor.

Example:
- Desktop's last processed change: 1002.
- Server's latest change: 1003.
- Desktop requests changes after 1002 and receives change 1003.

Google Drive exposes change tracking through its Changes API and supports change notifications.

### Polling vs push notifications

Polling:
- Simple and easy to recover.
- Can create unnecessary requests and delayed updates.

Push notifications:
- Faster notification and fewer unnecessary polls.
- Requires connection management and recovery from missed notifications.

Recommended pattern: use notifications to tell clients that changes are available, then retrieve authoritative changes using a durable cursor. Notifications are not the source of truth.

### Offline synchronization

When an offline client reconnects:
1. It sends its previous change cursor.
2. Server returns available changes.
3. Client reconciles local state.
4. Client downloads missing content when needed.
5. Client updates local metadata.
6. Client advances its cursor.

If the cursor is no longer valid, a full or partial resynchronization may be necessary.

## 13. Real-Time Collaboration

Google Drive integrates with collaborative products such as Docs, Sheets, and Slides.

Two users editing the same document can cause lost updates if both download version 1 and independently upload complete replacements.

Two important approaches:

### Operational Transformation (OT)

Concurrent operations are transformed against one another to preserve intended editing results.

Advantages:
- Suitable for collaborative editing.
- Supports operation-based synchronization.
- Can provide responsive editing.

Disadvantages:
- Complex transformation rules.
- Difficult for complex document structures.
- Requires careful operation ordering.

### Conflict-Free Replicated Data Types (CRDTs)

CRDTs are data structures designed to converge when replicas exchange updates under defined assumptions.

Advantages:
- Strong convergence properties.
- Can support offline editing.
- Some designs do not require a centralized transformation coordinator.

Disadvantages:
- Metadata overhead.
- Complex data structures.
- Not every data model maps naturally to a CRDT.

Google's historical collaborative editing research is associated with OT. Do not assume every current Google Docs editing path uses a particular OT implementation or that all collaboration features use the same algorithm.

File synchronization and real-time collaborative editing are different problems.

## 14. Search Architecture

Searching every file directly in object storage would be inefficient. Search systems maintain indexes.

Conceptual indexing pipeline:

```text
File Created / Updated
        |
        v
Metadata Service
        |
        v
Change Event
        |
        v
Indexing Service
        +-- Extract metadata
        +-- Extract supported text
        +-- Update search index
        |
        v
Search Engine
```

An inverted index maps terms to matching files:

```text
React:
  File A
  File B

Node.js:
  File A

Database:
  File B

Python:
  File C
```

Possible technologies:
- Elasticsearch: full-text search and distributed indexing; operational overhead.
- OpenSearch: search and analytics; cluster management.
- PostgreSQL full-text search: simpler, but may be less suitable for enormous search workloads.
- Custom inverted index: full control, but expensive engineering effort.

These are possible choices, not claims about Google's internal Drive search engine.

**Security requirement:** Search must not reveal files to unauthorized users. Use authorization-aware filtering or a secure post-retrieval authorization check.

## 15. Caching Architecture

Caching reduces repeated metadata queries and content retrieval.

Cache types:

| Cache | Stores | Purpose |
|---|---|---|
| Browser cache | Recently accessed content | Reduce network requests |
| Client-side cache | Local files and metadata | Offline access |
| Application cache | Frequently requested metadata | Reduce database load |
| Distributed cache | Shared metadata/results | Reuse data across servers |
| CDN | Eligible cached content | Reduce geographic latency |

Redis is a possible distributed application cache.

Advantages:
- Fast in-memory access.
- TTL support.
- Useful data structures.

Disadvantages:
- Memory is expensive.
- Cache invalidation is difficult.
- It should not replace durable storage.
- Consistency needs careful design.

Cache invalidation approaches:
1. TTL expiration.
2. Event-based invalidation.
3. Versioned cache keys.
4. Read-through cache.
5. Cache revalidation.

Permission-sensitive cache entries must never bypass current authorization.

## 16. Versioning and Recovery

A file can have multiple revisions:

```text
report.pdf
  +-- Revision 1
  +-- Revision 2
  +-- Revision 3
  +-- Revision 4 (current)
```

Google Drive exposes revision resources through its API. Its documentation describes retention and automatic cleanup rules for binary file revisions.

Two generic storage strategies:

**Full copy per revision**
- Simple retrieval and recovery.
- High storage consumption.

**Delta storage**
- Stores differences between revisions.
- Can reduce storage.
- Reconstruction and compaction are more complex.

These are generic strategies; the precise internal revision-storage algorithm is not established by the public API documentation.

Version history is not the same as backup. Version history supports logical revision recovery; backups and disaster recovery protect against broader infrastructure failures.

## 17. Event-Driven Architecture

A file upload may trigger:
- Metadata update.
- Search indexing.
- Thumbnail generation.
- Notifications.
- Audit records.
- Synchronization processing.

Waiting synchronously for every operation makes the upload request slow and fragile.

Conceptual flow:

```text
Upload Service
      |
      v
File Upload Complete
      |
      v
Event Stream
      +--> Search Worker
      +--> Thumbnail Worker
      +--> Notification Worker
      +--> Audit Worker
```

Possible technologies:
- Apache Kafka.
- Google Cloud Pub/Sub.
- RabbitMQ.
- Internal messaging infrastructure.

Google Drive publicly supports event notifications through Google Cloud Pub/Sub. This does not prove that its complete internal event bus uses Pub/Sub.

### Transactional outbox

A failure can occur if metadata commits but event publishing fails.

The transactional outbox pattern stores metadata and an outbox event in the same database transaction. A separate publisher sends pending events to the broker.

Consumers should be idempotent because messages may be delivered more than once.

Advantages of asynchronous processing:
- Independent consumer scaling.
- Lower API latency.
- Failure isolation.
- Retry capabilities.

Disadvantages:
- Eventual consistency.
- Duplicate events.
- Ordering challenges.
- Operational complexity.

## 18. Handling Massive Scale

### Geographic distribution

Global routing can direct requests to suitable infrastructure based on availability, network conditions, and data placement constraints.

Do not assume every user's data is replicated everywhere. Data placement must consider durability, consistency, security, and residency requirements.

### Horizontal scaling

Instead of endlessly increasing one server's CPU and RAM, add more instances. Services can scale independently according to demand.

### Sharding

Possible shard keys:

| Shard key | Advantages | Disadvantages |
|---|---|---|
| User ID | Localizes user queries | Large users can create hotspots |
| File ID | Hashing can distribute data | Folder queries may span shards |
| Tenant ID | Organizational isolation | Large tenants can become hotspots |
| Hash key | Better distribution | Range queries become harder |

Different data domains may need different partitioning strategies.

## 19. Reliability and Failure Handling

| Failure | Expected response |
|---|---|
| API server crashes | Load balancer routes to healthy instances |
| Storage machine fails | Recover using redundancy |
| Database node fails | Replication and failover |
| Network disconnects during upload | Resume upload |
| Client goes offline | Synchronize later |
| Event consumer crashes | Retry processing |
| Search index unavailable | Keep core file operations independent |
| Cache unavailable | Fall back to authoritative storage |
| Permission service unavailable | Fail closed for protected access |
| Region outage | Fail over according to placement and recovery design |

### Graceful degradation

If search is unavailable, users should ideally still be able to download a known file. Isolate non-critical features from core file operations so one subsystem failure does not take down the entire product.

## 20. Security Architecture

Security should be implemented in layers.

### Authentication
- Google Account identity.
- Secure session management.
- Token validation.
- Multi-factor authentication where applicable.

### Authorization
- Resource-level access control.
- Folder inheritance.
- Shared drive permissions.
- Organization policies.
- Download restrictions where applicable.

### Encryption
- At rest: protects stored data.
- In transit: protects network communication, commonly using TLS.

### Audit logging

Record important operations:
- User uploaded a file.
- User shared a file.
- Another user downloaded a file.
- Permission was removed.
- File was deleted.

Audit logs support investigation, compliance, and security monitoring.

## 21. Observability

Important metrics:

| Metric | Why it matters |
|---|---|
| Upload latency | Upload performance |
| Download latency | Retrieval performance |
| Upload failure rate | Storage/network problems |
| API error rate | Backend failures |
| Metadata query latency | Database bottlenecks |
| Cache hit ratio | Caching efficiency |
| Queue lag | Event-processing delays |
| Replication health | Data redundancy |
| Search indexing delay | Search freshness |
| Permission-check latency | Authorization performance |

A possible monitoring stack:
- Metrics: Prometheus.
- Dashboards: Grafana.
- Logs: Elasticsearch/OpenSearch-based logging.
- Distributed tracing: OpenTelemetry.

These are proposed choices, not claims about Google's exact internal monitoring stack.

## 22. Publicly Documented Google Technologies vs Proposed Choices

### Publicly documented Google infrastructure

| Technology | Purpose | Why it fits | Trade-offs |
|---|---|---|---|
| Colossus | Distributed file storage | Massive scale and fault tolerance | Distributed storage complexity |
| Bigtable | Colossus metadata storage | High-scale metadata access | Not a traditional relational database |
| Spanner | Distributed relational database | Transactions and global consistency | Complexity and cost |
| Borg | Cluster/workload management | Scheduling and failure recovery | Internal platform complexity |
| Google Cloud Pub/Sub | Public event integration | Asynchronous event delivery | Delivery and ordering considerations |

These technologies are relevant Google infrastructure, but their presence in the broader Google ecosystem does not prove that every Drive subsystem uses them.

### Possible application-level choices

| Technology | Purpose | Why use it? | Alternative |
|---|---|---|---|
| Go / Java | Backend services | Concurrency and mature ecosystems | C++, Rust, Node.js |
| gRPC | Internal communication | Efficient service contracts | REST |
| PostgreSQL | Metadata | ACID transactions and relational queries | MySQL, Spanner |
| Redis | Caching | Low-latency reads | Memcached |
| Kafka | Event streaming | High-throughput processing | Pub/Sub, RabbitMQ |
| OpenSearch | Search | Distributed full-text indexing | Elasticsearch |
| CDN | Content delivery | Geographic distribution | Direct origin delivery |
| Kubernetes | Orchestration | Scheduling and recovery | Managed orchestration |
| Prometheus | Metrics | Monitoring and alerting | Other metrics platforms |

### Why not use one database for everything?

File content, metadata, search, caching, and events have different workload characteristics. Polyglot persistence can be appropriate, but every additional system introduces operational overhead, failure modes, and consistency challenges.

Do not introduce every technology at the beginning.

## 23. What I Would Build Today

Consider a hypothetical platform with:
- 10 million registered users.
- 1 million daily active users.
- 100 TB of new uploads per day.
- Files from 1 KB to 20 GB.
- Multiple devices per user.
- File sharing and collaboration.

Do not start by recreating Google's infrastructure. Start with a simpler architecture that can evolve.

### Proposed stack

| Layer | Proposed technology | Reason |
|---|---|---|
| Frontend | React + TypeScript | Web client |
| Backend | Node.js + TypeScript | Application APIs |
| Gateway/load balancing | Managed gateway/load balancer | Routing and traffic management |
| Metadata | PostgreSQL | Transactions and relational queries |
| File storage | Amazon S3 | Durable object storage |
| Cache | Redis | Low-latency metadata cache |
| Search | OpenSearch | Full-text search when justified |
| Events | Kafka or managed queue | Asynchronous processing |
| Packaging | Docker | Reproducible deployment |
| Orchestration | Kubernetes or managed compute | Scheduling and scaling |
| CDN | CloudFront | Geographic content delivery |
| Keys | AWS KMS | Key management |
| Observability | OpenTelemetry, Prometheus, Grafana | Tracing and monitoring |

These are proposed choices for a hypothetical system, not Google's internal stack.

### Proposed service architecture

```text
                 React Application
                        |
                        v
                   API Gateway
                        |
          +-------------+--------------+
          |             |              |
          v             v              v
      Auth Module   File Module   Permission Module
                        |
             +----------+----------+
             |          |          |
             v          v          v
          Upload     Metadata   Download
          Service    Service    Service
             |          |          |
             v          v          v
            S3       PostgreSQL   S3/CDN
                        |
                        v
                      Outbox
                        |
                        v
                      Kafka
                        |
             +----------+----------+
             |          |          |
             v          v          v
           Search   Notification  Preview
           Worker     Worker      Worker
             |
             v
          OpenSearch
```

Initially, use well-defined modules in a modular monolith. Extract independently scalable services when justified by workload, ownership, or deployment requirements.

### Simplified database schema

**users**

| Column | Type |
|---|---|
| id | UUID |
| email | VARCHAR |
| name | VARCHAR |
| created_at | TIMESTAMP |

**files**

| Column | Type |
|---|---|
| id | UUID |
| owner_id | UUID |
| parent_id | UUID |
| name | VARCHAR |
| mime_type | VARCHAR |
| size | BIGINT |
| storage_key | TEXT |
| current_revision_id | UUID |
| status | VARCHAR |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

**permissions**

| Column | Type |
|---|---|
| id | UUID |
| resource_id | UUID |
| principal_id | UUID |
| role | VARCHAR |
| permission_type | VARCHAR |

**revisions**

| Column | Type |
|---|---|
| id | UUID |
| file_id | UUID |
| storage_key | TEXT |
| size | BIGINT |
| checksum | VARCHAR |
| created_at | TIMESTAMP |

**changes**

| Column | Type |
|---|---|
| id | BIGINT |
| user_id | UUID |
| file_id | UUID |
| operation | VARCHAR |
| created_at | TIMESTAMP |

Database decisions:
- Index `files.owner_id`.
- Index `files.parent_id`.
- Index `permissions.resource_id`.
- Index `permissions.principal_id`.
- Use keyset pagination for large file listings.
- Use transactions for metadata and permission updates.
- Use an outbox for reliable event publishing.
- Keep binary content out of PostgreSQL.
- Avoid storing every revision as a full copy unless requirements justify it.
- Design durable change cursors and explicit handling for deleted files and permission changes.

## 24. Key Architectural Trade-offs

| Decision | Option A | Option B | Recommendation |
|---|---|---|---|
| File storage | Database blobs | Object storage | Object storage |
| Metadata | SQL | NoSQL | SQL initially |
| Upload | Single request | Resumable chunks | Resumable |
| Synchronization | Full polling | Change log + notification | Change log + notification |
| Processing | Synchronous | Asynchronous | Hybrid |
| Search | Database queries | Search engine | Dedicated search when justified |
| Cache | No cache | Distributed cache | Introduce based on measured demand |
| Permissions | RBAC only | ACL + roles | ACL + roles |
| Versioning | Full copies | Delta/deduplication | Start with immutable revisions |
| Architecture | Monolith | Microservices | Modular monolith, then selective extraction |
| Deployment | Single instance | Distributed deployment | Managed, horizontally scalable deployment |

### What I would not do

1. Do not store 20 GB files in PostgreSQL.
2. Do not route every file byte through a Node.js API server.
3. Do not use Redis as the primary metadata database.
4. Do not synchronously update every search index during upload.
5. Do not trust notifications as the source of truth for synchronization.
6. Do not rely on RBAC alone for file-level sharing.
7. Do not create 20 microservices before having actual scaling requirements.
8. Do not use a distributed database just because Google uses one.
9. Do not let cached permissions grant access after revocation.
10. Do not treat version history as a complete backup strategy.

## 25. End-to-End Workflows

### Scenario A: Upload a 500 MB PDF

```text
1. User selects PDF
       |
       v
2. Client requests upload session
       |
       v
3. API Gateway validates request
       |
       v
4. Authentication verifies identity
       |
       v
5. Permission Service validates destination
       |
       v
6. Upload Service creates session
       |
       v
7. Client uploads chunks
       |
       v
8. Distributed Storage receives data
       |
       v
9. Storage validates integrity
       |
       v
10. Metadata Service commits file metadata
       |
       v
11. File-created event is published
       |
       +--> Search indexing
       +--> Thumbnail generation
       +--> Notification service
       +--> Synchronization service
       |
       v
12. File becomes accessible
```

A production implementation must also handle incomplete uploads, metadata commit failures, duplicate requests, and orphaned storage objects.

### Scenario B: Download a file

```text
1. User requests file
       |
       v
2. API Gateway
       |
       v
3. Authentication
       |
       v
4. Metadata lookup
       |
       v
5. Permission validation
       |
       v
6. Resolve storage reference
       |
       v
7. Check cache/CDN eligibility
       |
       v
8. Retrieve file content
       |
       v
9. Stream file to client
```

Authorization must happen before granting access to the file content. Streaming and direct authorized storage delivery are more scalable than loading the entire file into application-server memory.

### Scenario C: Share a file

```text
1. Owner selects Share
       |
       v
2. Client sends sharing request
       |
       v
3. Authentication
       |
       v
4. Verify owner/admin authority
       |
       v
5. Update ACL
       |
       v
6. Commit permission changes
       |
       v
7. Publish permission-change event
       |
       +--> Invalidate permission caches
       +--> Update relevant search visibility
       +--> Notify recipient
       +--> Update synchronization state
```

Permission changes are security-sensitive transactions.

### Scenario D: Two users edit a document

```text
User A ----+
           |
           v
   Collaboration Service
           ^
           |
User B ----+
           |
           v
 Concurrent Operations
           |
           v
 Conflict Coordination
           |
           v
 Consistent Document State
           |
           v
 Revision / Change History
           |
           v
 Other Connected Clients
```

This is different from uploading a binary file. Collaborative editing coordinates concurrent operations within a shared document.

## 26. Interview Questions

1. **Why does Google Drive separate metadata from file content?**  
   Metadata and binary content have different access patterns, sizes, consistency requirements, and scaling characteristics. Separating them allows independent optimization.

2. **How would you upload a 20 GB file reliably?**  
   Use resumable multipart/chunked uploads, upload sessions, bounded concurrency, integrity checks, and durable progress tracking.

3. **What happens if an upload succeeds but metadata creation fails?**  
   Use an upload state machine, idempotent finalization, reconciliation jobs, and orphan-object cleanup.

4. **How does Google Drive synchronize multiple devices?**  
   Use change tracking and durable cursors. Notifications can alert clients to changes, while clients retrieve authoritative changes and reconcile local state.

5. **Why is Redis not the primary database?**  
   Redis is optimized for low-latency in-memory access. A durable transactional database is more appropriate for authoritative metadata and relationships.

6. **How do you prevent unauthorized file downloads?**  
   Authenticate the caller, evaluate resource-level permissions, enforce organizational policies, and authorize the actual content delivery path.

7. **How do you handle concurrent document editing?**  
   Use a collaboration protocol that coordinates concurrent operations, such as OT or an appropriate CRDT design.

8. **Why use Kafka or Pub/Sub?**  
   They decouple the upload transaction from downstream processing and allow independently scalable consumers with retry and recovery mechanisms.

9. **How would you handle a storage node failure?**  
   Use redundant storage, health monitoring, repair/reconstruction, retry logic, and failure-domain-aware placement.

10. **Why not use a single database for everything?**  
    File content, metadata, caching, search, and event processing have different workload characteristics and consistency requirements.

## 27. Further Reading

1. Colossus – Google's distributed filesystem: https://cloud.google.com/blog/products/storage-data-transfer/a-peek-behind-colossus-googles-file-system
2. Spanner – globally distributed database research: https://research.google/pubs/spanner-googles-globally-distributed-database/
3. Borg – large-scale cluster management: https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/
4. Google Drive API – Changes and revisions: https://developers.google.com/workspace/drive/api/guides/manage-changes
5. Google Drive API – Events: https://developers.google.com/workspace/drive/api/guides/events-overview
6. Google Drive API – Permissions: https://developers.google.com/workspace/drive/api/guides/manage-sharing

## 28. Final Takeaways

The six core architectural principles:

1. **Separate storage from metadata.** Binary data and structured information should scale independently.
2. **Use asynchronous processing.** Uploading a file should not wait for indexing, notifications, and previews.
3. **Design for failures.** Network failures, server crashes, and interrupted uploads are normal conditions.
4. **Treat permissions as first-class architecture.** File access must be authorized at the resource level.
5. **Use change tracking.** Synchronization should transfer changes, not repeatedly transfer the entire file listing.
6. **Optimize each workload independently.** Storage, search, caching, collaboration, and metadata have different requirements.

For system-design preparation, focus on Colossus-style distributed storage, Spanner-style distributed databases, resumable uploads, ACL-based authorization, change-log synchronization, and event-driven architecture. These concepts also apply to Dropbox, OneDrive, and enterprise cloud-storage platforms.
