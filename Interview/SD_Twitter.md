# Node
# Twitter (X) System Architecture and Design

## 1. Introduction

Twitter/X is a large-scale distributed social platform. Its major
engineering challenges include:

-   High-volume post publishing.
-   Fast personalized home timelines.
-   Large follower/following graphs.
-   Celebrity accounts with millions of followers.
-   Search, trending topics and recommendations.
-   Image and video storage and delivery.
-   Notifications and engagement processing.
-   Availability, reliability, security and cost control.

The central architectural challenge is generating a personalized
timeline quickly when users follow hundreds or thousands of accounts.

The architecture described here combines publicly documented historical
Twitter technologies with a proposed design for a new Twitter-like
platform. It is not a claim about X's exact current internal deployment.

## 2. Requirements

### Functional requirements

1.  User registration, login and profile management.
2.  Follow and unfollow users.
3.  Create, edit and delete posts.
4.  Home timeline and user timeline.
5.  Like, reply and repost.
6.  Search users, posts and hashtags.
7.  Trending topics.
8.  Notifications and private messaging.
9.  Media uploads.
10. Recommendations and content moderation.

### Non-functional requirements

-   High availability.
-   Low latency.
-   Horizontal scalability.
-   Durability.
-   Fault tolerance.
-   Appropriate consistency guarantees.
-   Security and privacy.
-   Cost efficiency.
-   Observability.

### Illustrative scale assumptions

For architecture exercises, assume:

-   100 million registered users.
-   20 million daily active users.
-   2 million peak concurrent users.
-   10,000 post creations per second at peak.
-   200,000 timeline requests per second at peak.
-   50,000 engagement requests per second at peak.

These are hypothetical design inputs, not actual X traffic statistics.

## 3. High-Level Architecture

``` text
                  WEB / MOBILE CLIENTS
                           |
                           v
                    CDN / EDGE NETWORK
                           |
                           v
                     LOAD BALANCER
                           |
                           v
                       API GATEWAY
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
      USER SERVICE     POST SERVICE    TIMELINE SERVICE
          |                |                |
          v                v                v
      USER DB           POST DB        TIMELINE CACHE
                           |
                           v
                       EVENT LOG
                           |
                           v
                   STREAM PROCESSING
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
           FANOUT        SEARCH      NOTIFICATION
           SERVICE      INDEXER       SERVICE
             |             |             |
             v             v             v
        SOCIAL GRAPH   SEARCH INDEX   PUSH SERVICE

                    MEDIA SERVICE
                         |
                         v
                   OBJECT STORAGE
                         |
                         v
                        CDN
```

This is a conceptual architecture. Services are separated because they
have different workloads:

-   Timeline: read-heavy.
-   Post publishing: write-heavy.
-   Social graph: relationship lookups.
-   Search: indexing and retrieval.
-   Media: large binary objects.
-   Notifications: asynchronous delivery.

Do not create a separate microservice for every module on day one. Start
with a modular monolith and extract services when independent scaling,
deployment or ownership justifies it.

## 4. Timeline Generation: The Most Important Design Decision

There are two fundamental approaches.

### 4.1 Fan-out on Read (Pull Model)

When a user opens the timeline:

1.  Fetch accounts the user follows.
2.  Fetch recent posts from those accounts.
3.  Merge the posts.
4.  Sort them by timestamp or ranking score.
5.  Return the timeline.

Example:

``` text
User follows A, B and C.

Fetch A's posts: A1, A2, A3
Fetch B's posts: B1, B2, B3
Fetch C's posts: C1, C2, C3

Merge -> Sort -> Return
```

Advantages: - Simple publishing flow. - No follower timeline writes
during publishing. - Less write amplification. - Suitable for small
systems.

Disadvantages: - Many reads per timeline request. - Higher read
latency. - Expensive for users following many accounts. - Database load
grows with concurrent readers.

### 4.2 Fan-out on Write (Push Model)

When an author publishes a post:

1.  Persist the post.
2.  Publish a post-created event.
3.  Retrieve the author's followers.
4.  Insert the post ID into followers' timeline stores.
5.  Serve prepared timelines when users open the application.

Advantages: - Fast timeline reads. - Less work during timeline
requests. - Good for read-heavy systems.

Disadvantages: - One post can cause millions of writes. - High write
amplification. - More storage and processing. - Queue backlogs can
develop.

### 4.3 Hybrid Fan-out

A large social network can combine both approaches.

-   Normal accounts: fan-out on write.
-   Very high-follower accounts: fan-out on read.

Example:

``` text
Normal author with 500 followers:
    Write post to 500 follower timelines.

Celebrity with 50 million followers:
    Store the original post.
    Do not update 50 million timelines.
    Fetch celebrity posts when followers read their timelines.
```

The timeline service merges prepared timeline entries with posts from
high-follower accounts.

The follower threshold is a configurable engineering decision, not a
universal fixed number.

Hybrid fan-out balances read latency against write amplification.

## 5. Post Creation and Event Processing

Example request:

``` http
POST /api/v1/posts
Authorization: Bearer <access_token>
Content-Type: application/json
```

``` json
{
  "text": "Learning distributed system architecture!",
  "mediaIds": []
}
```

Flow:

1.  API Gateway validates authentication, rate limits and request
    format.
2.  Post Service validates content and permissions.
3.  Post Service generates an ID.
4.  The post is persisted.
5.  A post-created event is published.
6.  Fanout, search indexing and notification consumers process the event
    asynchronously.

Example event:

``` json
{
  "eventId": "evt_10001",
  "eventType": "POST_CREATED",
  "postId": "post_10001",
  "authorId": "user_101",
  "createdAt": "2026-11-18T10:30:00Z"
}
```

### Why asynchronous processing?

A post should not wait for millions of follower timeline updates before
the API returns success. Persist the post, record the event and process
downstream work asynchronously.

### Transactional Outbox Pattern

A naive implementation can lose an event:

``` text
1. Save post in database.
2. Application crashes.
3. Event is never published.
```

Use the Transactional Outbox Pattern:

``` text
SINGLE DATABASE TRANSACTION
    |
    +-- Save Post
    |
    +-- Save Outbox Event
    |
    v
   COMMIT
    |
    v
Outbox Worker
    |
    v
Event Broker
    |
    v
Consumers
```

The post and outbox event are committed atomically. The worker publishes
pending events. Consumers must be idempotent because messages may be
delivered more than once.

## 6. Technology Stack and Why It Was Used

Twitter's technology evolved over time. The following technologies are
historically or publicly documented and should not be interpreted as a
definitive list of X's current production components.

  -----------------------------------------------------------------------
  Layer                   Documented or           Responsibility
                          historical technology   
  ----------------------- ----------------------- -----------------------
  Original application    Ruby on Rails           Initial monolithic
                                                  application

  Backend services        Scala / JVM             Distributed backend
                                                  services

  Service communication   Finagle                 Asynchronous RPC

  API and RPC             HTTP, Thrift            Client and internal
                                                  communication

  Distributed storage     Manhattan               Distributed key-value
                                                  storage

  Relational storage      MySQL                   Persistent relational
                                                  data

  Social graph            FlockDB, Gizzard, MySQL Followers and following

  Caching                 Redis, Memcached        Frequently accessed
                                                  data

  ID generation           Snowflake               Distributed unique
                                                  identifiers

  Search                  Earlybird               Real-time tweet search

  Messaging/logs          DistributedLog and      Asynchronous processing
                          other systems           

  Analytics               Hadoop, HDFS, Vertica   Large-scale analytics

  Media storage           Blobstore               Large binary objects

  Coordination            ZooKeeper               Distributed
                                                  coordination
  -----------------------------------------------------------------------

### 6.1 Scala versus Ruby, Node.js, Java and Go

Twitter originally used Ruby on Rails and later adopted Scala
extensively for backend services.

Scala offered: - Static typing. - JVM ecosystem. - Functional
programming capabilities. - Access to Java libraries. - Mature
concurrency and asynchronous tooling.

Alternatives:

  -----------------------------------------------------------------------
  Technology              Advantages              Trade-offs
  ----------------------- ----------------------- -----------------------
  Scala                   JVM ecosystem, static   Learning curve and
                          typing, functional      complexity
                          features                

  Java                    Mature tooling and      More verbose
                          ecosystem               

  Node.js                 Productive, efficient   CPU-heavy work needs
                          I/O, TypeScript support separate strategies

  Go                      Simplicity and          Smaller ecosystem for
                          efficient concurrency   some specialized
                                                  workloads

  Ruby                    Rapid application       Some high-throughput
                          development             workloads need
                                                  substantial
                                                  optimization
  -----------------------------------------------------------------------

There is no universal rule that Scala is better than Node.js. The choice
depends on workload, ecosystem, team skills and operations.

### 6.2 Finagle

Finagle is a distributed RPC framework historically developed at
Twitter.

It provides capabilities such as: - Asynchronous RPC. - Connection
pooling. - Load balancing. - Timeouts. - Retries. - Failure handling. -
Instrumentation integrations.

Alternatives: - REST/HTTP: simple and universal, but may have more
payload overhead. - gRPC: efficient RPC with HTTP/2 and Protobuf, but
requires schema and tooling management. - Thrift: cross-language RPC,
with additional schema/tooling requirements.

For a new platform, use REST for public APIs and consider gRPC for
selected internal service communication.

### 6.3 Manhattan

Manhattan is Twitter's distributed database.

Its design addressed requirements such as: - High throughput. - Low
latency. - Availability. - Horizontal scaling. - Multi-tenancy. -
Replication and failure handling.

Why not use PostgreSQL for everything?

PostgreSQL is excellent for relational and transactional data. It can
scale significantly with replicas, partitioning and sharding. However,
one relational database is not necessarily the ideal system for every
high-volume workload.

Alternatives:

  -----------------------------------------------------------------------
  Database                Good fit                Trade-off
  ----------------------- ----------------------- -----------------------
  PostgreSQL              Transactions and        Distributed scaling
                          relational data         requires additional
                                                  design

  MySQL                   Relational              Sharding and global
                          transactional data      operations add
                                                  complexity

  MongoDB                 Flexible document data  Relational constraints
                                                  and complex
                                                  transactions require
                                                  care

  Cassandra               High-volume distributed Query-driven modeling
                          workloads               and consistency
                                                  trade-offs

  Redis                   Low-latency in-memory   Memory cost and
                          access                  persistence
                                                  considerations

  Manhattan               Twitter-specific        Custom system and
                          distributed workloads   significant operational
                                                  cost
  -----------------------------------------------------------------------

Twitter's engineering team experimented with Cassandra and later moved
major storage workloads toward Manhattan. The lesson is that a
distributed database is not automatically the best database for every
distributed workload.

### 6.4 Redis

Redis is an in-memory data store useful for: - Prepared timelines. - Hot
post data. - User objects. - Counters. - Rate limiting. - Short-lived
data.

Example timeline:

``` text
timeline:user:101

[
  post_1005,
  post_1004,
  post_1003,
  post_1002,
  post_1001
]
```

A timeline can store post IDs rather than complete post objects. This
avoids duplicating the same post content across millions of timelines.

Advantages: - Low-latency reads. - Useful data structures. - Atomic
operations. - Reduced database load.

Disadvantages: - Memory can be expensive. - Cache eviction must be
handled. - Cache consistency requires design. - Lost cache data may need
reconstruction.

Memcached is simpler for basic key-value caching. Redis is more suitable
when richer data structures and atomic operations are useful.

Redis should not be the only source of truth for published posts.

### 6.5 Snowflake IDs

Twitter introduced Snowflake for distributed unique ID generation.

A historically documented 64-bit layout:

``` text
| 1 bit | 41 bits | 10 bits | 12 bits |
| Sign  | Time    | Machine | Sequence|
```

The 12-bit sequence allows:

2\^12 = 4096 IDs per millisecond per worker.

Advantages: - Distributed ID generation. - No central database call for
every ID. - Approximately time-ordered IDs. - Compact 64-bit
representation.

Disadvantages: - Worker ID coordination. - Clock synchronization. -
Clock rollback handling. - Finite timestamp range.

Alternatives include UUIDv4 and UUIDv7. UUIDv7 is time-ordered and can
be a good modern option.

### 6.6 FlockDB and Social Graph

FlockDB was a historical distributed graph storage system built on
Gizzard and MySQL.

A follow relationship is a directed edge:

``` text
Ritik -> User A
Ritik -> User B
Ritik -> User C
User D -> User A
```

A relational design can initially handle this:

``` sql
CREATE TABLE follows (
    follower_id BIGINT NOT NULL,
    followee_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (follower_id, followee_id)
);

CREATE INDEX idx_followee_follower
ON follows (followee_id, follower_id);
```

The primary key supports finding accounts a user follows. The secondary
index supports finding an account's followers.

Neo4j is not automatically necessary. A relational adjacency-list model
is sufficient for many follow-graph workloads. A graph database becomes
more attractive when complex multi-hop traversals are a core
requirement.

### 6.7 Search and Earlybird

Twitter developed Earlybird, a real-time search system built on Lucene
technology.

Search engines use an inverted index.

Example:

``` text
"Node.js" -> [post_101, post_105, post_109]
"React" -> [post_102, post_105]
"Distributed" -> [post_101, post_110]
```

A search engine looks up terms in the index instead of scanning every
post row.

Alternatives: - PostgreSQL Full Text Search: simple and integrated. -
OpenSearch: distributed search and flexible querying. - Elasticsearch:
distributed search ecosystem. - Solr: mature Lucene-based search. -
Custom Lucene implementation: maximum control but high engineering cost.

For a new platform, start with PostgreSQL search if requirements are
simple. Introduce OpenSearch when advanced search and scale justify it.

## 7. Media Architecture

Do not store large image and video binaries directly in relational
database rows.

Recommended flow:

``` text
Client
  |
  v
Media Service
  |
  v
Generate Presigned Upload URL
  |
  v
Object Storage (S3)
  |
  v
Upload Event
  |
  v
Media Processor
  |
  +-- Generate thumbnails
  |
  +-- Transcode video
  |
  v
Media Metadata Database
  |
  v
CDN
  |
  v
Users
```

Object storage options: - Amazon S3. - Google Cloud Storage. - Azure
Blob Storage.

A CDN delivers content from geographically closer edge locations,
reducing latency and origin traffic.

For video, use asynchronous transcoding and adaptive bitrate streaming
such as HLS.

## 8. Trending Topics

Trending should not simply count total hashtag mentions.

A topic with 10,000 mentions in 10 minutes may be more relevant than one
with 10,000 mentions over 24 hours.

A simplified score:

``` text
TrendScore =
(CurrentMentions - ExpectedMentions)
/
(ExpectedMentions + epsilon)
```

This is illustrative, not Twitter's actual formula.

Signals can include: - Mention velocity. - Historical baseline. - Unique
users. - Geographic distribution. - Spam and bot activity. - Topic
relevance.

Architecture:

``` text
Post Events
    |
    v
Event Broker
    |
    v
Stream Processor
    |
    v
Aggregate Hashtags
    |
    v
Time-Window Counters
    |
    v
Trend Scoring
    |
    v
Trending Cache
```

Possible technologies: - Kafka for event distribution. - Flink for
stateful stream processing. - Redis for counters and caching. -
PostgreSQL for persistent metadata.

Precompute trend aggregates rather than repeatedly scanning all posts
for every request.

## 9. Recommendation System

The Following feed and For You feed have different requirements.

A recommendation pipeline generally has three stages.

### Candidate generation

Collect potential posts from: - Followed accounts. - Popular posts. -
Similar-interest accounts. - Similar users' interactions. - Related
topics.

### Feature extraction

User features: - Interests. - Following relationships. - Previous
interactions. - Language. - Location preferences.

Post features: - Author. - Topic. - Age. - Engagement. - Media type.

Relationship features: - Previous interactions with author. - User
interest in topic. - Existing relationship.

### Ranking

A model predicts the likelihood of useful interactions.

Example:

``` text
Post A -> Relevance score: 0.94
Post B -> Relevance score: 0.81
Post C -> Relevance score: 0.25
```

Ranking can consider relevance, freshness, engagement likelihood,
diversity, negative feedback and safety.

### Handling "Not interested"

A robust system should: 1. Record the negative feedback event. 2.
Associate it with the post, author or topic. 3. Update user preference
features. 4. Apply exclusion or downranking rules. 5. Use the signal in
future model training. 6. Monitor repeated exposure to similar content.

Users may still see similar posts if the model classifies content
differently, feedback propagation is delayed, other candidate sources
introduce it, or other ranking signals outweigh the negative signal.

## 10. Horizontal Scaling and Caching

### Load balancing

``` text
             LOAD BALANCER
                   |
          +--------+--------+
          |        |        |
          v        v        v
       Server 1 Server 2 Server 3
```

Load balancing distributes traffic and removes unhealthy instances.

Options include NGINX, HAProxy and managed cloud load balancers.

### Database sharding

A simple conceptual strategy:

``` text
Shard = Hash(post_id) mod N
```

For production, consistent hashing or a partition map can reduce data
movement when shard counts change.

Advantages: - Horizontal storage scaling. - Distributed read/write load.

Disadvantages: - Cross-shard queries. - More complex transactions. -
Resharding. - Hot partitions.

### Multi-level caching

``` text
Client
  |
  v
CDN Cache
  |
  v
Application Cache
  |
  v
Redis
  |
  v
Database
```

CDN caches media and static assets. Redis caches timelines and hot
objects. Database buffer caches reduce physical disk reads.

Caching does not replace durable storage.

### Backpressure

If incoming events exceed processing capacity, queue lag grows.

For example:

``` text
Incoming events: 100,000/sec
Processing capacity: 50,000/sec
Backlog growth: 50,000/sec
```

Use consumer autoscaling, rate limiting, backpressure, retries,
dead-letter queues and priority handling. A queue buffers work; it does
not create processing capacity by itself.

## 11. Consistency Requirements

Not all operations require the same consistency model.

  Operation              Requirement
  ---------------------- ----------------------------------------
  Account registration   Strong
  Username uniqueness    Strong
  Password changes       Strong
  Post creation          Durable commit before success
  Follow relationship    Strong authoritative state
  Timeline delivery      Eventual consistency can be acceptable
  Like creation          Strong per user/post uniqueness
  Like count             Eventual consistency can be acceptable
  Search indexing        Eventual consistency
  Trending               Eventual consistency

For example: - A user should not like the same post twice. - A new post
may appear in followers' feeds a few seconds later. - A like counter may
temporarily lag.

Do not impose expensive strong consistency on every distributed read if
the product semantics do not require it.

## 12. Reliability and Failure Handling

  -----------------------------------------------------------------------
  Failure                             Expected behavior
  ----------------------------------- -----------------------------------
  Post Service unavailable            Controlled error and safe retry

  Redis unavailable                   Database-backed fallback where
                                      feasible

  Kafka unavailable                   Keep outbox events and retry
                                      publishing

  Search unavailable                  Publishing continues; indexing
                                      catches up

  Media processor unavailable         Keep media pending and retry

  Fanout worker crashes               Replay unprocessed events

  Duplicate events                    Idempotent consumers

  Database primary fails              Promote healthy replica according
                                      to recovery policy

  CDN unavailable                     Safe origin fallback where
                                      configured
  -----------------------------------------------------------------------

Use: - Exponential backoff. - Jitter. - Retry limits. - Circuit
breakers. - Dead-letter queues. - Idempotency keys.

Never retry indefinitely.

## 13. Security

Authentication: - Short-lived access tokens. - Secure refresh-token
rotation. - Argon2id or bcrypt password hashing. - Session revocation.

Authorization: - Object-level permission checks. - Private account
visibility. - Block and mute enforcement. - Post ownership validation.

API security: - Rate limiting. - Input validation. - SQL injection
prevention. - XSS protection. - CSRF protection when cookie-based
authentication is used. - Restricted CORS.

Media security: - Short-lived presigned URLs. - File type and size
validation. - Malware scanning where appropriate. - Access control for
private media.

Operational security: - Secrets management. - Encryption in transit and
at rest. - Audit logging. - Least-privilege permissions.

JWT authentication does not replace authorization. Every resource access
still needs permission checks.

## 14. Observability

Use metrics, distributed tracing and structured logs.

OpenTelemetry can provide instrumentation. Prometheus and Grafana can
provide metrics and dashboards.

Important metrics:

  Metric                      Purpose
  --------------------------- --------------------------
  API p50/p95/p99 latency     Request performance
  Error rate                  Reliability
  Request throughput          Traffic volume
  Database query latency      Database health
  Redis hit ratio             Cache effectiveness
  Kafka consumer lag          Processing backlog
  Fanout completion time      Timeline delivery health
  Search indexing delay       Search freshness
  Timeline cache miss rate    Feed performance
  Media processing duration   Upload pipeline health

Kafka consumer lag is particularly important. The Post Service can be
healthy while fanout is falling behind.

## 15. Our Proposed Technology Stack

For a new Twitter-like platform:

  -----------------------------------------------------------------------
  Layer                   Recommended technology  Reason
  ----------------------- ----------------------- -----------------------
  Frontend                React, Next.js,         Productive web
                          TypeScript              application stack

  Backend                 Node.js, TypeScript,    Efficient I/O and
                          Fastify                 TypeScript ecosystem

  ORM                     Drizzle ORM             Typed SQL-oriented data
                                                  access

  Primary database        PostgreSQL              Transactions and
                                                  relational integrity

  Cache                   Redis                   Timelines, hot objects
                                                  and rate limiting

  Background jobs         Redis-backed queue      Simple asynchronous
                          initially               processing

  Event streaming         Kafka when justified    Durable high-throughput
                                                  event processing

  Search                  OpenSearch when needed  Advanced distributed
                                                  search

  Media                   S3-compatible storage   Large binary objects

  Delivery                CDN                     Global content delivery

  Containers              Docker                  Reproducible deployment

  Orchestration           Kubernetes when needed  Container orchestration
                                                  at scale

  Observability           OpenTelemetry,          Metrics and tracing
                          Prometheus, Grafana     
  -----------------------------------------------------------------------

## 16. Service Decomposition

Logical modules:

  Module           Responsibility
  ---------------- ----------------------------------
  Auth             Authentication and sessions
  User             Profiles and settings
  Social Graph     Followers and following
  Post             Create, update and delete posts
  Engagement       Likes, replies and reposts
  Timeline         Feed generation and retrieval
  Notification     In-app and push notifications
  Media            Upload and processing
  Search           Full-text retrieval
  Recommendation   Candidate generation and ranking
  Moderation       Spam and content safety

Start with a modular monolith. Extract high-load modules when there is a
measurable reason.

## 17. Database Design

### Users

``` sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Follows

``` sql
CREATE TABLE follows (
    follower_id BIGINT NOT NULL,
    followee_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, followee_id),
    CHECK (follower_id <> followee_id)
);

CREATE INDEX idx_follows_followee
ON follows (followee_id, follower_id);
```

### Posts

``` sql
CREATE TABLE posts (
    id BIGINT PRIMARY KEY,
    author_id BIGINT NOT NULL,
    content TEXT,
    reply_to_id BIGINT,
    visibility VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_posts_author_created
ON posts (author_id, created_at DESC);
```

### Likes

``` sql
CREATE TABLE likes (
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

CREATE INDEX idx_likes_post
ON likes (post_id, user_id);
```

### Reposts

``` sql
CREATE TABLE reposts (
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);
```

### Media metadata

``` sql
CREATE TABLE media (
    id BIGINT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    object_key TEXT NOT NULL,
    media_type VARCHAR(30) NOT NULL,
    processing_status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Do not calculate like counts and follower counts by running COUNT(\*) on
every request. Maintain derived counters asynchronously and reconcile
them periodically. The underlying relationship and engagement records
remain the source of truth.

## 18. API Design

### Authentication

  Method   Endpoint
  -------- -------------------------
  POST     `/api/v1/auth/register`
  POST     `/api/v1/auth/login`
  POST     `/api/v1/auth/refresh`
  POST     `/api/v1/auth/logout`

### Users

  Method   Endpoint
  -------- -------------------------------
  GET      `/api/v1/users/:id`
  PATCH    `/api/v1/users/me`
  GET      `/api/v1/users/:id/followers`
  GET      `/api/v1/users/:id/following`
  POST     `/api/v1/users/:id/follow`
  DELETE   `/api/v1/users/:id/follow`

### Posts

  Method   Endpoint
  -------- ---------------------------
  POST     `/api/v1/posts`
  GET      `/api/v1/posts/:id`
  PATCH    `/api/v1/posts/:id`
  DELETE   `/api/v1/posts/:id`
  GET      `/api/v1/users/:id/posts`

### Engagement

  Method   Endpoint
  -------- -----------------------------
  PUT      `/api/v1/posts/:id/like`
  DELETE   `/api/v1/posts/:id/like`
  POST     `/api/v1/posts/:id/repost`
  DELETE   `/api/v1/posts/:id/repost`
  POST     `/api/v1/posts/:id/replies`

Using PUT for likes makes the operation idempotent when implemented with
a unique constraint.

### Timeline

  Method   Endpoint
  -------- ------------------------------
  GET      `/api/v1/timeline/home`
  GET      `/api/v1/timeline/following`
  GET      `/api/v1/timeline/user/:id`
  GET      `/api/v1/timeline/explore`

Use cursor-based pagination rather than offset pagination. Stable
cursors reduce duplicates and missing records when new posts arrive
during scrolling.

## 19. Timeline Implementation

### Timeline storage

Use Redis sorted sets initially.

``` text
Key: timeline:user:101

Score: post timestamp
Member: post_id
```

Keep a bounded window of recent post IDs based on product requirements
and memory budget.

### Timeline write flow

``` text
Post Created
    |
    v
Post Database
    |
    v
Outbox Event
    |
    v
Event Broker
    |
    v
Fanout Worker
    |
    v
Retrieve Followers
    |
    v
Choose Fanout Strategy
    |
    +---------------------+
    |                     |
    v                     v
Normal Author       High-Follower Author
    |                     |
    v                     v
Update follower      Store original post;
timelines            fetch during reads
```

### Timeline read flow

``` text
User opens feed
      |
      v
Timeline API
      |
      v
Get cached post IDs
      |
      v
Fetch posts in batches
      |
      v
Fetch author data
      |
      v
Fetch high-follower candidates
      |
      v
Apply visibility and safety filters
      |
      v
Merge and sort/rank
      |
      v
Return response
```

The cache must not be the authorization source. Current privacy, block,
deletion and moderation rules must be enforced when assembling the
response.

### Cache reconstruction

If Redis loses timeline data:

1.  Identify affected users.
2.  Fetch their followed accounts.
3.  Retrieve recent posts.
4.  Rebuild bounded timelines.
5.  Resume normal fanout.

Throttle reconstruction to avoid overwhelming the database.

## 20. Scaling Roadmap

### Stage 1: MVP --- 1K to 10K users

-   Next.js and Node.js modular monolith.
-   PostgreSQL.
-   Redis caching.
-   Object storage.
-   Fan-out on read.
-   Docker deployment.

Goal: Validate the product and data model.

### Stage 2: Growth --- 10K to 500K users

-   Separate background workers.
-   Redis-backed job queues.
-   Fan-out on write for normal users.
-   PostgreSQL read replicas.
-   CDN.
-   Dedicated search if needed.

Goal: Reduce database load and improve timeline performance.

### Stage 3: Large platform --- 500K to 10M users

-   Extract high-load modules.
-   Introduce Kafka.
-   Hybrid fan-out.
-   Database partitioning.
-   Distributed caching.
-   OpenSearch cluster.

Goal: Independently scale workloads.

### Stage 4: Massive platform --- 10M to 100M+ users

-   Database sharding.
-   Multi-region architecture.
-   Distributed event processing.
-   Advanced recommendation infrastructure.
-   Custom storage optimization where justified.
-   Regional traffic routing.
-   Automated capacity management.

These ranges are illustrative, not fixed thresholds. Actual transitions
depend on traffic, data size, latency, reliability and operational
capacity.

## 21. Important Trade-offs

  -----------------------------------------------------------------------
  Decision                Benefit                 Cost
  ----------------------- ----------------------- -----------------------
  Microservices           Independent scaling and Operational complexity
                          deployment              

  PostgreSQL              Transactions and        Distributed scaling
                          integrity               needs additional design

  Redis                   Fast timeline retrieval Memory cost and
                                                  consistency management

  Kafka                   Durable event           Operational complexity
                          processing              

  Hybrid fan-out          Balances read and write More complex timeline
                          costs                   composition

  Object storage          Efficient binary        Separate metadata and
                          storage                 processing

  CDN                     Low-latency global      Cache invalidation and
                          delivery                cost

  OpenSearch              Advanced search         Infrastructure overhead

  Cursor pagination       Stable feed traversal   More complex
                                                  implementation

  Distributed IDs         No central ID           Worker coordination and
                          allocation              clock handling
  -----------------------------------------------------------------------

## 22. Technologies to Avoid Initially

  -----------------------------------------------------------------------
  Technology                          Reason not to introduce it
                                      immediately
  ----------------------------------- -----------------------------------
  Kubernetes                          Adds orchestration complexity
                                      before it is needed

  Cassandra                           No initial need for its distributed
                                      data model

  Neo4j                               Indexed relational tables can
                                      handle basic follow relationships

  OpenSearch                          PostgreSQL search may be sufficient
                                      initially

  Custom distributed database         Extremely expensive to build and
                                      maintain

  ML recommendation engine            Needs interaction data and model
                                      infrastructure

  Multiple regional databases         Unnecessary until global latency
                                      and availability justify them

  Too many microservices              Excessive operational overhead
  -----------------------------------------------------------------------

The goal is not to use the most technologies. The goal is to use the
minimum technology set that solves the actual workload problems.

## 23. Most Difficult Engineering Problems

1.  Timeline generation and read/write amplification.
2.  Celebrity fanout and hot accounts.
3.  Social graph storage and asymmetric relationships.
4.  Event processing, retries, duplicates and ordering.
5.  Feed ranking and personalization.
6.  Database scaling and hot partitions.
7.  Media delivery, bandwidth and transcoding.
8.  Moderation and abuse detection.
9.  Global availability and replication.
10. Infrastructure cost optimization.

Prioritize timeline performance, data correctness, event reliability and
database design before advanced recommendations.

## 24. Final Recommended Architecture

For the first production version:

``` text
Next.js Web / Mobile Client
          |
          v
Load Balancer + API Layer
          |
          v
Node.js + TypeScript Modular Backend
          |
    +-----+------+----------------+
    |            |                |
    v            v                v
PostgreSQL     Redis         Background Workers
    |                             |
    v                             v
Outbox Table                Fanout / Notifications
    |
    v
Event Processing (queue initially; Kafka when justified)

Media Module
    |
    v
S3-Compatible Object Storage
    |
    v
CDN
```

Reasoning:

1.  PostgreSQL provides transactional correctness.
2.  Redis provides fast timeline and object retrieval.
3.  Background workers isolate expensive asynchronous operations.
4.  Object storage handles large media.
5.  CDN reduces global delivery latency.
6.  Modular architecture keeps development manageable.
7.  Services can be extracted without rewriting the entire application.

## 25. Key Lessons for a Software Architect

### 1. Read-heavy systems require different architecture from write-heavy systems.

Do not optimize every operation using the same database access pattern.

### 2. Precomputation trades write cost for read performance.

Fan-out on write is a clear example.

### 3. Distributed systems require explicit failure handling.

Retries, idempotency, backpressure, dead-letter queues and observability
are essential.

### 4. Data storage should follow access patterns.

Relational databases, key-value stores, search indexes and object
storage solve different problems.

### 5. Architecture must evolve with measured requirements.

Do not copy X's infrastructure. Understand the problems behind its
decisions and solve the problems relevant to your actual scale.

## 26. Recommended Technical References

Use original engineering material where possible:

1.  Twitter Engineering --- The Infrastructure Behind Twitter: Scale.
2.  Twitter Engineering --- Manhattan distributed database.
3.  Twitter Engineering --- Starting to Re-architect Twitter.
4.  FlockDB --- Historical social graph repository.
5.  Twitter Snowflake --- Distributed unique ID design.
6.  Twitter DistributedLog --- Replicated log architecture.

## 27. Implementation Milestones

Build a simplified Twitter-like platform in this order:

1.  Authentication and social graph.
2.  Post creation and engagement.
3.  Home timeline using fan-out on read.
4.  Redis-based timeline caching.
5.  Event-driven fan-out on write.
6.  Hybrid fan-out for high-follower accounts.
7.  Search and notifications.
8.  Media uploads and CDN.
9.  Monitoring, load testing and failure simulation.
10. Recommendation and ranking engine.

This project provides practical experience with database design,
distributed systems, caching, event-driven architecture, scalability and
production engineering.

## Deployments

1.

2.

3.

## SCaling

- Que : 
    ```
    jchbdkjcb djkbd
    dvojdvnkdjvbdsbvd
    vdvodsjvhosdhv
    dvlsdnvlkjn
    ```

-
-
