# Instagram System Architecture: How Instagram Works at Global Scale

## 1. Introduction

Instagram is not simply a social media application built using React Native, Python, and a database. It is a globally distributed system that handles several independent but interconnected workloads:

1. Billions of content interactions.
2. Real-time user activity and presence.
3. Photo and video uploads, processing, storage, and delivery.
4. Personalized recommendation and ranking.
5. Social graphs, followers, following, and relationships.
6. Messaging, notifications, comments, and likes.
7. Identity verification and account security.
8. Monetization, advertising, and creator analytics.

The engineering challenge is deciding which data should be stored, where it should be stored, how it should be distributed, and how quickly the system should respond.

Note: This document distinguishes publicly documented Meta technologies from architectural inference. Instagram's complete internal architecture is not publicly available.

## 2. High-Level Architecture

Instagram can be understood through the following conceptual layers:

```
Client Applications
    |
    |-- iOS
    |-- Android
    |-- Web
    |
    v
Edge Infrastructure
    |
    |-- DNS
    |-- CDN
    |-- TLS
    |-- DDoS Protection
    |-- Load Balancing
    |
    v
API and Application Layer
    |
    |-- Authentication Service
    |-- Feed Service
    |-- Reels Service
    |-- Profile Service
    |-- Social Graph Service
    |-- Messaging Service
    |-- Notification Service
    |
    v
Data and Intelligence Layer
    |
    |-- Distributed Databases
    |-- Redis / Distributed Caching
    |-- Object Storage
    |-- Search Indexes
    |-- Event Streaming
    |-- ML Recommendation
    |-- Analytics
    |
    v
Infrastructure and Operations
    |
    |-- Compute
    |-- Storage
    |-- Networking
    |-- Observability
    |-- Disaster Recovery
```

This is a conceptual architecture, not Meta's confidential internal deployment diagram.

## 3. How Instagram Handles Users Across Different Locations

Imagine Instagram has billions of monthly active users distributed across:

- India
- United States
- Europe
- Southeast Asia
- Middle East
- Africa

Users are not equally active throughout the day. Each region has different peak activity periods.

### 3.1 How Instagram Estimates User Location

Instagram can use several signals:

1. IP address and network routing information.
2. Device location, if the user grants location permission.
3. User-provided location information.
4. Language and regional preferences.
5. Location tags on posts.
6. Historical interactions with location-related content.

GPS permission is not required to estimate approximate geographic location because IP-based geolocation can provide regional information.

### 3.2 How Requests Are Distributed

Conceptually:

```
Users Around the World
          |
          v
Global DNS and Edge Routing
          |
          v
Regional Infrastructure
          |
    +-----+-----+
    |     |     |
   India  USA   Europe
    |     |     |
    v     v     v
 Application Servers
    |     |     |
    v     v     v
 Regional Caches
          |
          v
Distributed Data Infrastructure
```

This does not mean every user has a separate regional database.

### 3.3 What Happens When a User Travels?

Suppose a user registers in India and travels to Germany.

- Their identity remains associated with their account.
- Their requests are routed through available infrastructure.
- Frequently accessed content may be served from nearby caches.
- Account data is retrieved from the relevant backend.
- Replication and cache invalidation help maintain consistency.

Maintaining a separate complete database for every country would introduce:

- Data duplication.
- Synchronization complexity.
- Conflicting writes.
- Higher infrastructure costs.
- Difficult account migration.
- Data residency and regulatory challenges.

## 4. How Instagram Handles Millions of Active Users

### 4.1 Horizontal Scaling

Instead of using one enormous server, traffic is distributed across multiple application servers.

```
Instagram
    |
    +--- Server 1
    +--- Server 2
    +--- Server 3
    +--- Server 4
    +--- Server N
```

Horizontal scaling adds more machines to increase capacity.

Vertical scaling increases CPU, RAM, or storage on an existing machine.

| Vertical Scaling | Horizontal Scaling |
|---|---|
| Bigger machines | More machines |
| Limited maximum capacity | Can scale across many machines |
| Larger failure impact | Failures can be isolated |
| Simpler initially | More distributed-system complexity |

Horizontal scaling is essential for Instagram's workload.

### 4.2 Caching

Suppose 10 million people view the same celebrity's profile.

Without caching:

```
10 million requests
        |
        v
    Database
        |
        v
10 million database reads
```

With caching:

```
10 million requests
        |
        v
 Distributed Cache
        |
        +---- Cache HIT: Return data
        |
        +---- Cache MISS: Fetch from storage
```

Frequently requested data can include:

- Profile information.
- Follower counts.
- Post metadata.
- Video metadata.
- Social relationships.
- Frequently accessed feed data.

Meta has publicly documented Memcache and TAO as foundational technologies for read-heavy social graph workloads.

### 4.3 The Celebrity Problem: Hot Partitions

Consider two accounts:

- Normal user with 500 followers.
- Celebrity with 100 million followers.

When the celebrity publishes a post, millions of users may request that post simultaneously.

This creates a hot-key problem.

Solutions include:

1. Replicate popular data across cache nodes.
2. Distribute read traffic across replicas.
3. Apply request coalescing.
4. Cache popular content near users.
5. Use adaptive load balancing.
6. Move or split hot shards.

Adding more database servers does not automatically solve a scalability problem.

## 5. Instagram Social Graph

Instagram is fundamentally a graph-oriented application.

Example:

- User A follows User B.
- User A likes Post 101.
- User B comments on Post 102.
- User C mentions User A.

These relationships form a graph.

### 5.1 Example Data Model

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(255)
);

CREATE TABLE follows (
    follower_id BIGINT,
    following_id BIGINT,
    created_at TIMESTAMP,
    PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE likes (
    user_id BIGINT,
    post_id BIGINT,
    created_at TIMESTAMP
);

CREATE TABLE comments (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    post_id BIGINT,
    content TEXT,
    created_at TIMESTAMP
);
```

### 5.2 Why TAO?

Meta developed TAO (The Associations and Objects), a distributed social graph service.

It uses:

- Objects to represent entities.
- Associations to represent relationships.
- Caching to accelerate reads.
- MySQL for persistent storage in the documented architecture.

TAO is not simply a graph database like Neo4j. It is a specialized distributed graph service designed around Meta's access patterns.

### 5.3 Why Not Use Only PostgreSQL?

PostgreSQL can support a social application.

However, at Instagram's scale, a conventional relational deployment would need substantial additional engineering for:

- Distributed partitioning.
- Relationship lookups.
- Cache management.
- Hot-key management.
- Read replication.
- Cross-region consistency.

The issue is not that PostgreSQL is incapable. A specialized graph-serving system can optimize the dominant access patterns.

## 6. Instagram Feed Ranking

Suppose you follow 500 accounts.

All 500 accounts publish content throughout the day.

Instagram cannot simply display everything chronologically if it wants to optimize relevance and engagement.

Instead, it builds a personalized feed.

### 6.1 Feed Generation Pipeline

```
Candidate Generation
        |
        v
Eligibility Filtering
        |
        v
Feature Extraction
        |
        v
Machine Learning Prediction
        |
        v
Ranking
        |
        v
Diversity and Policy Controls
        |
        v
Feed Delivery
```

### 6.2 Ranking Signals

| Signal | Example |
|---|---|
| Watch Time | How long you watch a Reel |
| Likes | Whether you like similar posts |
| Saves | Whether you save content |
| Shares | Whether you send it to someone |
| Comments | Whether you comment |
| Relationship | How frequently you interact with a creator |
| Content Interest | Whether you watch similar topics |
| Recency | How recently content was published |
| Negative Feedback | Whether you hide or report content |

The system predicts different outcomes rather than relying on one universal engagement score.

### 6.3 Why Machine Learning Instead of Simple Sorting?

Chronological ordering prioritizes recent posts.

Personalized ranking estimates which posts are more relevant to each user.

Trade-offs:

- Chronological feeds are simpler and more predictable.
- Personalized ranking can improve relevance but requires complex models, data processing, and inference infrastructure.

## 7. Why Does Instagram Show Videos After Selecting Not Interested?

Selecting Not Interested does not necessarily mean:

Never show me this topic, creator, or type of video again.

It communicates a negative preference about a recommendation.

### 7.1 Recommendation Feedback Is Probabilistic

Example:

```
Topic: Fitness
Watch Time: 95%
Like: No
Save: No
Not Interested: Yes
```

The recommendation model may reduce the probability of showing similar content.

However, fitness is a broad category.

A user might dislike weight-loss content but still enjoy:

- Bodybuilding.
- Nutrition.
- Running.
- Workout tutorials.

The model needs to distinguish these different interests.

### 7.2 Multiple Recommendation Stages

```
Candidate Generation
        |
        v
Ranking
        |
        v
Policy Filtering
        |
        v
Video Delivery
```

A video can be retrieved during candidate generation even if it later receives a lower ranking score.

### 7.3 Feedback Propagation Delay

After selecting Not Interested, the feedback may need to be:

1. Accepted by the backend.
2. Persisted.
3. Processed by downstream systems.
4. Incorporated into recommendation features.
5. Reflected in subsequent ranking requests.

Cached recommendations and precomputed candidate lists can cause temporary mismatches.

### 7.4 Multiple Recommendation Models

Different recommendation surfaces can have different retrieval and ranking systems:

- Reels.
- Explore.
- Feed recommendations.
- Search recommendations.

Feedback affecting one recommendation surface does not necessarily immediately remove similar content everywhere.

## 8. How Instagram Manages the Blue Verification Badge

There are two important verification models.

### 8.1 Legacy Verification

Historically, Instagram verified accounts based on criteria such as:

- Authenticity.
- Uniqueness.
- Completeness.
- Notability.

### 8.2 Meta Verified

Meta introduced a subscription-based verification offering.

The documented process includes:

1. Account eligibility checks.
2. Government-issued identity document submission.
3. Matching submitted identity with profile information.
4. Verification review.
5. Account impersonation monitoring.

Meta also continues to honor previously verified badges under its legacy criteria.

### 8.3 Conceptual Database Design

```sql
CREATE TABLE account_verification (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    verification_type VARCHAR(30),
    status VARCHAR(30),
    verified_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

Possible verification types:

- LEGACY
- META_VERIFIED

Possible statuses:

- PENDING
- APPROVED
- REJECTED
- EXPIRED
- REVOKED

### 8.4 Verification Flow

```
User Submits Verification Request
             |
             v
Identity and Eligibility Checks
             |
             v
Verification Decision
             |
       +-----+-----+
       |           |
    APPROVED    REJECTED
       |           |
       v           v
Update Status   Notify User
       |
       v
Profile API Returns Verification Status
```

A Boolean field such as isVerified is insufficient for a complete verification lifecycle.

A dedicated verification entity supports:

- Verification type.
- Application history.
- Subscription status.
- Expiration.
- Revocation.
- Review history.
- Identity checks.

The badge is a presentation of verification status, not the actual account security mechanism.

## 9. How Instagram Stores and Delivers Videos

Suppose a user uploads a 500 MB video.

Instagram cannot simply send that exact file to every viewer.

It needs a media-processing and delivery pipeline.

### 9.1 Video Upload Pipeline

```
Mobile Application
        |
        v
Upload Infrastructure
        |
        v
Upload Validation
        |
        v
Object Storage
        |
        v
Processing Queue
        |
        v
Video Transcoding
        |
        +---- 360p
        +---- 480p
        +---- 720p
        +---- 1080p
        |
        v
Thumbnail Generation
        |
        v
Metadata Persistence
        |
        v
CDN Distribution
```

### 9.2 Why Multiple Resolutions?

Different users have different devices and network conditions.

| Rendition | Example Resolution | Usage |
|---|---|---|
| Low | 360p | Poor network |
| Medium | 480p | Basic mobile playback |
| HD | 720p | Standard mobile playback |
| Full HD | 1080p | High-quality playback |
| Ultra HD | 4K | Supported high-resolution playback |

These are illustrative renditions, not Instagram's exact encoding profiles.

### 9.3 Adaptive Bitrate Streaming

The video player monitors network conditions and switches between available renditions.

Example:

```
Network Speed: 10 Mbps
        |
        v
Play 1080p

Network Speed: 2 Mbps
        |
        v
Switch to 720p

Network Speed: 500 Kbps
        |
        v
Switch to 360p
```

The objective is to minimize buffering while maintaining acceptable visual quality.

### 9.4 Why Use a CDN?

Suppose a creator uploads a video in Mumbai and a person in London watches it.

A CDN caches frequently requested video segments near viewers.

Benefits:

- Lower latency.
- Reduced origin-server bandwidth.
- Better playback performance.
- Better handling of viral videos.
- Reduced repeated storage reads.

### 9.5 How Instagram Handles Viral Videos

Suppose a video uploaded by a creator with 100 followers suddenly gets recommended to 20 million people.

Solutions include:

1. CDN caching.
2. Popular-content replication.
3. Request coalescing.
4. Distributed storage.
5. Traffic shaping.
6. Adaptive bitrate delivery.
7. Cache prewarming where useful.

The original asset is processed into the required renditions, and delivery infrastructure serves the resulting content repeatedly.

## 10. Why Instagram Videos Sometimes Glitch

Video playback depends on several independent components.

```
Instagram App
     |
     v
API Service
     |
     v
Video Metadata Service
     |
     v
CDN
     |
     v
Video Storage
     |
     v
Video Decoder
     |
     v
Screen
```

### 10.1 Network Problems

Possible causes:

- High latency.
- Packet loss.
- Low bandwidth.
- Unstable connectivity.
- DNS resolution problems.

Result: buffering or freezing.

### 10.2 CDN Cache Problems

The CDN might:

- Return an error.
- Take too long to respond.
- Fail to retrieve a segment from the origin.
- Serve an incomplete or stale object.

Result: video playback failure.

### 10.3 Video Encoding Problems

A corrupted rendition can cause:

- Black screens.
- Audio without video.
- Decoding errors.

### 10.4 Client-Side Decoding Problems

Android and iOS devices have different hardware decoders and operating-system implementations.

Possible causes:

- Codec incompatibility.
- Hardware decoder bugs.
- Memory pressure.
- Application bugs.
- Corrupted segment boundaries.

### 10.5 Backend Timeout

Suppose the feed API responds in 100 ms, but the video metadata service takes 5 seconds.

The client may time out before receiving the required playback information.

### 10.6 Production Solutions

| Failure | Architectural Solution |
|---|---|
| Network instability | Adaptive bitrate |
| CDN failure | Alternate CDN/origin paths |
| Corrupted video | Checksums and validation |
| Slow metadata service | Caching and timeouts |
| Overloaded servers | Load shedding |
| Bad video rendition | Reprocessing and fallback |
| Device decoding issue | Compatible encoding profiles |
| Partial uploads | Resumable upload and validation |

Video delivery is a separate performance-critical workload. It should not depend on the availability of every other Instagram subsystem.

## 11. Why Does Instagram Sometimes Go Completely Down?

A platform can have millions of servers and still experience an outage.

More servers do not automatically mean greater availability.

### 11.1 Common Outage Categories

| Failure Category | What Happens |
|---|---|
| DNS Failure | Users cannot resolve the service correctly |
| Network Failure | Requests cannot reach infrastructure |
| Database Failure | Critical data cannot be retrieved |
| Cache Failure | Database traffic increases dramatically |
| Authentication Failure | Users cannot log in |
| Bad Deployment | New code breaks existing functionality |
| Configuration Failure | Incorrect routing or service settings |
| Dependency Failure | An upstream service becomes unavailable |
| Capacity Exhaustion | Infrastructure cannot handle traffic |

### 11.2 Dependency Failure

Suppose Instagram deploys an incorrect authentication configuration.

Authentication servers start rejecting legitimate requests.

Even if video storage, databases, CDN, and recommendation models are working, users may be unable to use Instagram.

### 11.3 Cascading Failure

Example:

1. Cache servers become unavailable.
2. Requests that normally hit caches reach databases.
3. Database traffic increases sharply.
4. Database latency increases.
5. Application requests time out.
6. Application servers retry requests.
7. Retry traffic increases the load further.
8. More services become unavailable.

### 11.4 Production Protection Mechanisms

- Circuit breakers.
- Rate limiting.
- Load shedding.
- Retry budgets.
- Bulkheads.
- Health checks.
- Automated failover.
- Regional redundancy.
- Rollback mechanisms.
- Disaster recovery.
- Graceful degradation.

If the recommendation service fails, a fallback feed strategy could return previously generated or chronologically ordered eligible posts.

This is called graceful degradation.

## 12. Technologies Used by Instagram and Why

Instagram's original backend was built using Django and Python. Meta has since developed and adopted many specialized infrastructure systems.

| Technology/System | Responsibility | Why It Fits |
|---|---|---|
| Python / Django | Original application backend | Rapid development |
| C++ | Performance-critical infrastructure | Fine-grained control and high performance |
| Hack / HHVM | Meta application runtime | Efficient execution of PHP-derived application code |
| React | Web interfaces | Component-based UI |
| React Native | Mobile development infrastructure | Shared application development |
| TAO | Social graph | Optimized object and relationship access |
| MySQL | Persistent relational storage | Mature transactional storage |
| Memcache | Distributed caching | Fast access to frequently requested data |
| Haystack | Historical photo storage infrastructure | Reduces filesystem metadata overhead |
| Tectonic | Modern storage infrastructure | Distributed, durable storage |
| CDN | Media delivery | Reduces latency and origin traffic |
| GraphQL | API data access in documented Meta systems | Flexible data materialization |
| Machine Learning Infrastructure | Recommendations | Personalized ranking and prediction |

These are technologies and systems documented in Meta engineering work. They should not be interpreted as a complete inventory of Instagram's current production stack.

### 12.1 Why Not Use Node.js for Everything?

A reasonable alternative architecture could use:

- Node.js.
- Express.
- PostgreSQL.
- Redis.
- Kafka.
- S3.
- React.
- Kubernetes.

This is a valid starting architecture.

However, each component must be evaluated against its specific workload.

| Requirement | Node.js + PostgreSQL | Specialized Infrastructure |
|---|---|---|
| Social Graph | Relational queries and caching | TAO |
| Media Storage | Object storage | Specialized object storage |
| Caching | Redis | Distributed caching infrastructure |
| Feed Ranking | Application-based ranking | Dedicated ML ranking infrastructure |
| Video Processing | FFmpeg workers | Large-scale media processing |
| Video Delivery | CDN | Distributed CDN and media-serving infrastructure |

Node.js is not inherently incapable of handling high scale.

The difference is the engineering investment required to operate and optimize the complete system.

### 12.2 What If Instagram Used MongoDB Instead of TAO?

MongoDB can represent:

- Users.
- Posts.
- Followers.
- Relationships.

But retrieving millions of relationships, processing interactions, and distributing reads requires careful partitioning, caching, and query optimization.

MongoDB could implement these requirements, but additional distributed graph-serving infrastructure might still be needed.

TAO was specifically developed around Meta's social graph workload.

### 12.3 Why Not Use Kafka for Everything?

Kafka is excellent for event streaming.

Example:

```
User Watches Reel
       |
       v
Watch Event
       |
       v
Event Streaming
       |
       +---- Analytics
       |
       +---- Recommendation Features
       |
       +---- Creator Metrics
       |
       +---- Experiment Evaluation
```

Kafka is not a replacement for:

- Relational databases.
- Object storage.
- Graph-serving systems.
- CDNs.
- Low-latency caches.

Technology should be selected according to access patterns, consistency requirements, latency requirements, and failure models.

## 13. What Happens When You Open Instagram?

Let's trace a real user journey.

You open Instagram at 8 PM.

```
1. Application Starts
          |
          v
2. Client Loads Local State
          |
          v
3. Request Reaches Edge Infrastructure
          |
          v
4. Authentication
          |
          v
5. Feed Request
          |
          v
6. Candidate Retrieval
          |
          v
7. Machine Learning Ranking
          |
          v
8. Privacy and Eligibility Checks
          |
          v
9. Metadata Retrieval
          |
          v
10. Feed Response
          |
          v
11. Media Delivery Through CDN
          |
          v
12. Interaction Tracking
```

Not all operations are synchronous.

| Operation | Processing Model |
|---|---|
| Authentication | Synchronous |
| Feed Retrieval | Synchronous request with internal parallelism |
| Video Playback | Independent media requests |
| Like Persistence | Backend write |
| Recommendation Analytics | Often asynchronous |
| Video Transcoding | Asynchronous |
| Creator Analytics | Often asynchronous |
| Model Training | Offline or scheduled pipelines |

This separation is essential for controlling latency.

## 14. Investigation of the September 2026 Instagram Outage

A reported incident occurred on September 20–21, 2026.

According to Reuters:

- The disruption began around 8:55 PM Eastern Time on September 20.
- Instagram received more than 5,000 outage reports.
- Facebook received more than 17,000 outage reports.
- Reports declined sharply around 10 PM Eastern Time.
- Both services had largely recovered.
- Meta had not immediately provided Reuters with an explanation for the cause.

This corresponds to approximately 65 minutes between the reported start and recovery period, not a confirmed 65-minute outage for every user.

Source:
Reuters — Meta's Facebook, Instagram recover after brief outage.

The exact root cause cannot be established without an official Meta incident report.

### 14.1 How to Investigate an Outage as a Production Architect

| Investigation | What to Examine |
|---|---|
| Availability | Which endpoints failed? |
| Geographic Impact | Was it global or regional? |
| Authentication | Were login requests failing? |
| API Gateway | Were requests returning 5xx errors? |
| Database | Were queries timing out? |
| Cache | Did cache hit rates collapse? |
| Networking | Were there packet losses or routing problems? |
| Deployment | Did a recent release introduce errors? |
| Dependencies | Did an upstream service fail? |
| Recovery | Was traffic rerouted or a rollback performed? |

Additional metrics:

- Distributed tracing.
- Error-rate dashboards.
- CPU and memory utilization.
- Request latency percentiles.
- Queue backlog.
- Database connection pools.
- Retry rates.
- Regional health checks.

Without internal metrics, identifying an exact root cause would be speculation.

## 15. Architecture Decisions and Engineering Lessons

| Problem | Architectural Lesson |
|---|---|
| Millions of active users | Horizontal scaling |
| Celebrity traffic spikes | Hot-key management |
| Millions of social relationships | Graph-oriented data access |
| Personalized feeds | Candidate retrieval and ranking |
| Massive video delivery | Object storage and CDN |
| Slow video playback | Adaptive bitrate streaming |
| Repeated recommendations | Feedback loops and ranking |
| Regional infrastructure | Distributed systems |
| Cache failures | Graceful degradation |
| Global outages | Fault isolation and disaster recovery |
| Verification | Identity lifecycle and trust systems |

## 16. If You Were Building Instagram Today

For a new Instagram-like product, start with a modular architecture and evolve it as actual traffic requires.

### 16.1 Recommended Starting Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Web | Next.js + React | Web application |
| Mobile | React Native | Mobile application |
| Backend | Node.js + TypeScript | API and business logic |
| Database | PostgreSQL | Users, relationships, metadata |
| Cache | Redis | Caching and sessions |
| Media Storage | S3-compatible storage | Original media and renditions |
| CDN | CloudFront or equivalent | Media distribution |
| Event Streaming | Kafka | Events and analytics |
| ML | Python | Recommendation models |
| Processing | FFmpeg workers | Video transcoding |
| Deployment | Docker | Application packaging |
| Orchestration | Managed compute / Kubernetes | Deployment and scaling |

### 16.2 When Should You Replace These Technologies?

| Starting Technology | Consider Alternatives When |
|---|---|
| PostgreSQL | Distributed workload exceeds what partitioning and replicas can handle |
| Redis | Cache topology, memory cost, or workload requires another strategy |
| Kafka | Event throughput, latency, or operational requirements justify alternatives |
| Node.js | A particular workload requires specialized runtime characteristics |
| S3 | Storage performance, cost, or compliance requirements demand another solution |
| Standard Ranking Service | Recommendation complexity justifies dedicated infrastructure |

Do not introduce 30 microservices, Kubernetes, Kafka, and a graph database on day one.

Start with clear module boundaries, measurable workloads, and a migration strategy.

## 17. Primary Engineering References

1. TAO: The Power of the Graph
   - Social graph.
   - Sharding.
   - Caching.
   - Consistency.
   - Hot spots.

2. Haystack: Efficient Storage of Billions of Photos
   - Object storage.
   - Indexing.
   - Metadata overhead.
   - Reads and writes.

3. Inside Facebook's Video Delivery System
   - Video feed.
   - Ranking.
   - Metadata.
   - Serving infrastructure.

4. AI Behind Unconnected Content Recommendations
   - Recommendation candidates.
   - Content understanding.
   - Personalization.

5. Meta's Tectonic Storage Infrastructure
   - Modern storage architecture.
   - Durability.
   - Erasure coding.
   - Storage tiers.

## 18. Final Architectural Takeaways

The most important engineering lessons are:

1. Horizontal scaling is necessary for large concurrent workloads.
2. Caching reduces repeated database reads.
3. Graph-oriented infrastructure optimizes social relationships.
4. Machine learning improves personalized content ranking.
5. Negative feedback must be incorporated into recommendation systems.
6. Media processing should be asynchronous.
7. Object storage and CDNs make large-scale video delivery practical.
8. Adaptive bitrate streaming improves playback under changing network conditions.
9. Fault isolation prevents one failing service from bringing down the entire application.
10. Graceful degradation keeps essential functionality available during partial failures.
11. Technology selection must be driven by workload characteristics rather than popularity.
12. Start with a maintainable architecture and introduce specialized infrastructure when measurable requirements justify it.

**Recommended learning order:** TAO → Haystack → Feed Ranking → Video Delivery → Distributed Caching → Fault Tolerance.

These topics provide a strong foundation for understanding Instagram's architecture and designing similarly scalable production systems.
