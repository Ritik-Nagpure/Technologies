# Redis Introduction

## 1. What is Redis?
Redis (Remote Dictionary Server) is an open-source, in-memory data store used as a database, cache, and message broker.

### Key Characteristics
- In-memory storage for ultra-fast performance
- Supports multiple data structures
- Lightweight and simple to use
- Open-source with wide community support

### Common Use Cases
- Caching frequently accessed data
- Session storage in web applications
- Real-time analytics
- Message queues and pub/sub systems

---

## 2. Redis Architecture & Working
### Client-Server Model
- Redis runs as a server process
- Applications connect as clients via TCP

### Cache Operations
- **Cache hit**: Data found in Redis
- **Cache miss**: Data not found, retrieved from DB

### Integration
- Works alongside traditional databases
- Acts as a high-speed layer between app and DB

---

## 3. Redis Data Structures
Redis is often called a "data structure server" because it supports multiple types:

- **Strings**: Basic key-value storage
- **Hashes**: Key-value pairs within a key
- **Lists**: Ordered collections
- **Sets**: Unordered unique values
- **Sorted Sets**: Ordered by score

Each structure is optimized for specific use cases.

---

## 4. Persistence & Durability
### RDB (Snapshotting)
- Saves dataset snapshots at intervals
- Lightweight, fast startup

### AOF (Append-Only File)
- Logs every write operation
- More durable, slower than RDB

### Trade-offs
- RDB: Faster, less durable
- AOF: Safer, more resource-intensive

---

## 5. Replication & High Availability
### Master-Slave Replication
- Master handles writes
- Slaves replicate data for reads

### Sentinel
- Monitors Redis instances
- Provides automatic failover

### Cluster Mode
- Horizontal scaling
- Data sharding across nodes

---

## 6. Performance & Scalability
### In-Memory Operations
- All data stored in RAM
- Sub-millisecond response times

### Sharding
- Distributes data across multiple nodes
- Improves scalability

### Throughput
- Handles millions of requests per second

---

## 7. Common Use Cases
- **Caching**: Reduce DB load
- **Session Management**: Store user sessions
- **Leaderboards**: Gaming apps with sorted sets
- **Message Queues**: Pub/Sub for real-time messaging

---

## 8. Getting Started with Redis
### Installation
- Available via package managers (apt, brew, yum)
- Docker images for quick setup

### Basic Commands
- `SET key value`
- `GET key`
- `DEL key`

### Language Support
- Works with Python, Node.js, Java, Go, and more
