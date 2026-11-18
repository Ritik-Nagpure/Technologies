# Custom Load Balancer System Architecture

## 1. Overview

A custom load balancer distributes incoming client traffic across
multiple backend servers or service instances. Its primary goals are
high availability, scalability, fault tolerance, lower latency, and
efficient resource utilization.

A load balancer is more than a request redirector. A production-grade
implementation considers backend health, capacity, active connections,
latency, routing policies, connection limits, and failure handling.

This document describes a reference architecture for building a custom
load balancer. It is not a claim that a particular company uses this
exact internal design.

## 2. The Problem a Load Balancer Solves

With a single backend server, increasing traffic can cause: - Server
overload and increased response latency. - A single point of failure. -
Poor resource utilization. - Limited horizontal scalability.

A load balancer sits between clients and a pool of backend servers:

``` text
Clients
   |
   v
Custom Load Balancer
   |
   +------ Backend A
   +------ Backend B
   +------ Backend C
```

It selects an eligible backend for each connection or request and
forwards traffic to it.

## 3. High-Level Architecture

Core components:

1.  Client layer: browsers, mobile applications, and API consumers.
2.  DNS/network entry: directs clients to the load-balancer
    infrastructure.
3.  Load-balancer gateway: accepts TCP or HTTP connections.
4.  Connection manager: manages client and upstream connections.
5.  Request parser: parses protocol information where applicable.
6.  Router: maps a request to a backend pool.
7.  Balancing algorithm: chooses a backend from that pool.
8.  Health monitor: determines whether a backend is eligible.
9.  Service registry: tracks backend instances.
10. Configuration manager: stores and distributes routing configuration.
11. Metrics and logging: expose system behavior.
12. Backend servers: process application requests.

### Data plane and control plane

**Data plane:** Handles live traffic. It accepts connections, parses
requests, selects backends, forwards traffic, and returns responses.

**Control plane:** Manages backend registration, health information,
routing rules, configuration, and policies.

Separating these responsibilities means configuration changes do not
need to block request processing. The data plane should continue serving
traffic using its last-known-good configuration if the control plane is
temporarily unavailable.

## 4. Request Lifecycle

Consider a request to `https://api.example.com/users/profile`.

### Step 1: DNS resolution

The client resolves the domain. DNS or a network-level entry service
directs it to the load-balancer infrastructure. High availability may
use multiple addresses, Anycast, or a network load balancer.

### Step 2: Connection establishment and TLS

The client establishes a TCP connection. For HTTPS, there are two common
options:

-   **TLS termination:** The load balancer decrypts the client
    connection and may forward HTTP or HTTPS to the backend. This
    enables HTTP-aware routing and policy enforcement.
-   **TLS passthrough:** The load balancer forwards encrypted traffic
    without inspecting HTTP content. The backend terminates TLS.

TLS termination is useful for Layer 7 routing. Passthrough is useful
when encryption must remain end-to-end or the backend owns certificate
termination.

### Step 3: Request parsing

For HTTP traffic, the load balancer may inspect the method, host, path,
headers, protocol version, and body metadata. It should enforce limits
on header size, body size, and parsing time.

Example:

``` http
GET /users/profile HTTP/1.1
Host: api.example.com
Authorization: Bearer <token>
```

### Step 4: Routing

The router selects a backend pool based on configured rules:

``` text
/api/users/*      -> User Service Pool
/api/payments/*   -> Payment Service Pool
/api/orders/*     -> Order Service Pool
/api/products/*   -> Product Service Pool
```

This is Layer 7 content-based routing. A Layer 4 load balancer instead
routes using network-level information such as IP addresses and ports.

### Step 5: Backend selection

The balancing algorithm chooses an eligible backend from the selected
pool. Eligibility normally requires that the backend is healthy,
enabled, within configured connection limits, and compatible with the
route.

### Step 6: Forwarding

The load balancer forwards the request over an upstream connection.
Connection reuse and pooling can reduce connection setup overhead.

### Step 7: Response handling

The load balancer receives the response, applies required policies,
updates metrics, and returns the response to the client. It must handle
upstream timeouts, connection resets, and malformed responses safely.

## 5. Load-Balancing Algorithms

There is no universally best algorithm. Selection depends on request
duration, backend capacity, connection behavior, and workload
distribution.

### A. Round Robin

Selects backends sequentially:

``` text
Request 1 -> A
Request 2 -> B
Request 3 -> C
Request 4 -> A
```

Pros: - Simple and inexpensive. - Predictable distribution. - Works well
for similar backends and uniform workloads.

Cons: - Does not account for current load. - Long-running requests can
create imbalance. - Does not account for different server capacities.

Use when backend capacity and workload are relatively homogeneous.

### B. Weighted Round Robin

Assigns each backend a weight based on capacity.

Example: A:B:C = 4:2:1 means A receives approximately four shares of
traffic, B two, and C one.

Pros: - Accounts for known capacity differences. - Easy to configure and
understand.

Cons: - Weights require tuning. - Static weights do not automatically
reflect changing utilization.

Use when backend capacities differ but remain reasonably stable.

### C. Least Connections

Chooses the backend with the fewest active connections.

Pros: - Useful when connection duration varies. - Often suitable for
long-lived TCP or WebSocket connections.

Cons: - A connection is not a direct measure of CPU or memory usage. -
Distributed load balancers may not have globally accurate connection
counts. - One expensive request can consume more resources than many
lightweight requests.

Use when active connection count is a useful approximation of load.

### D. Least Response Time

Uses measured response latency to prefer faster backends.

Pros: - Can adapt to backend performance changes. - Helps avoid
consistently slow instances.

Cons: - Measurements can be noisy or stale. - Sending more traffic to
the fastest backend can overload it. - Poorly designed feedback loops
can cause oscillation.

Use latency as one input, ideally combined with load and capacity
signals.

### E. IP Hash and Consistent Hashing

Maps a client identifier or request key to a backend. Consistent hashing
reduces the number of keys remapped when pool membership changes.

Pros: - Supports affinity and cache locality. - Can reduce session
movement when instances are added or removed.

Cons: - Distribution can be uneven. - Hot clients or keys can overload
one backend. - Client IP is often a poor identity because of NAT and
proxies.

Use when affinity or cache locality is required. Prefer
application-level session storage where practical rather than relying on
sticky sessions by default.

### F. Power of Two Choices

Randomly selects two candidates and chooses the less-loaded one.

Pros: - Avoids scanning every backend. - Scales well for large pools. -
Often produces good load distribution.

Cons: - Probabilistic. - Depends on reasonably fresh load information.

Use for large backend pools where a lightweight adaptive selection
strategy is useful.

### Algorithm comparison

  -----------------------------------------------------------------------
  Algorithm               Main input              Typical fit
  ----------------------- ----------------------- -----------------------
  Round Robin             Sequence                Uniform workloads

  Weighted Round Robin    Configured weight       Different fixed
                                                  capacities

  Least Connections       Active connections      Variable connection
                                                  duration

  Least Response Time     Observed latency        Variable backend
                                                  latency

  Consistent Hashing      Client/key hash         Affinity and cache
                                                  locality

  Power of Two Choices    Two sampled loads       Large dynamic pools
  -----------------------------------------------------------------------

**Practical recommendation:** Start with Round Robin or Weighted Round
Robin. Add Least Connections or latency-aware selection only when
workload measurements justify the added complexity.

## 6. Health Monitoring

The load balancer must stop sending normal traffic to failed or unready
backends.

### Active health checks

The monitor periodically sends a request such as:

``` http
GET /health
```

The backend returns a status. Configure: - Check interval. - Timeout. -
Healthy threshold. - Unhealthy threshold. - Expected response. -
Recovery policy.

Avoid marking a backend unhealthy after one transient failure.
Thresholds reduce flapping.

### Passive health checks

The load balancer observes actual traffic for timeouts, connection
failures, and selected error conditions. It can temporarily eject a
backend after a configured failure threshold.

  -----------------------------------------------------------------------
  Active checks                       Passive checks
  ----------------------------------- -----------------------------------
  Separate probe requests             Observe real traffic

  Can detect idle backend failures    Reflect actual request behavior

  Add probe traffic                   May not detect an idle backend

  Can check readiness endpoints       Depend on traffic volume and
                                      failure policy
  -----------------------------------------------------------------------

Use both where supported and appropriate.

### Backend state machine

A useful state model is:

``` text
HEALTHY
   | failure threshold reached
   v
UNHEALTHY
   | recovery checks succeed
   v
RECOVERING
   | gradual traffic restoration
   v
HEALTHY
```

A recovering backend may need slow start because caches, connection
pools, and application state may not be warm immediately after restart.

Distinguish **liveness** (the process is alive) from **readiness** (the
process is ready to serve traffic).

## 7. Service Discovery

Backend instances can appear and disappear as applications scale or
deploy. The load balancer needs a reliable way to discover them.

Possible mechanisms: - Kubernetes API and EndpointSlices/Services. -
Consul. - etcd. - Cloud service discovery. - DNS-based discovery.

Example registry record:

``` json
{
  "service": "user-service",
  "instances": [
    {"id": "user-1", "host": "10.0.1.10", "port": 3000},
    {"id": "user-2", "host": "10.0.1.11", "port": 3000}
  ]
}
```

The control plane watches changes and publishes a new validated backend
configuration.

**Recommendation:** On Kubernetes, start with native Kubernetes service
discovery. For independent infrastructure, evaluate Consul or etcd
rather than building a registry without a strong reason.

## 8. Recommended Technology Stack

This is a proposed stack for a custom implementation, not a description
of any particular vendor's internal stack.

  -----------------------------------------------------------------------
  Component               Suggested technology    Why
  ----------------------- ----------------------- -----------------------
  Data plane              Go                      Concurrency model,
                                                  networking libraries,
                                                  deployment simplicity

  Alternative data plane  Rust                    Memory safety and
                                                  low-level performance
                                                  control

  Control plane           Go                      Shared language and
                                                  networking ecosystem

  Network layer           TCP sockets and runtime Connection-level
                          network polling         control

  HTTP handling           Go `net/http` or a      Mature protocol support
                          carefully selected      
                          optimized proxy/parser  

  Configuration store     PostgreSQL              Transactions,
                                                  integrity, durable
                                                  configuration

  Configuration           gRPC + Protobuf         Typed messages and
  distribution                                    streaming

  Local routing state     In-memory structures    Avoid a remote lookup
                                                  on every request

  Service discovery       Kubernetes API or       Dynamic backend
                          Consul                  membership

  Metrics                 Prometheus              Time-series metrics and
                                                  alerting

  Dashboards              Grafana                 Operational
                                                  visualization

  Logs                    Structured JSON and     Centralized
                          Loki                    troubleshooting

  Deployment              Docker and Kubernetes   Packaging and
                                                  orchestration
  -----------------------------------------------------------------------

### Why Go?

Go is a strong default for a custom network proxy because: - Goroutines
make concurrent connection handling approachable. - The runtime provides
efficient network polling. - The standard library has mature networking
support. - Compiled binaries simplify deployment. - The ecosystem
integrates well with gRPC, Prometheus, and Kubernetes.

Trade-offs: - Garbage collection can introduce latency variability. -
Allocation patterns need profiling and optimization. - It offers less
low-level control than Rust or C. - A production proxy still requires
careful protocol, memory, and connection management.

### Why not Node.js?

Node.js can implement a reverse proxy and may be entirely appropriate
for a small service or moderate traffic. It is not inherently incapable
of this task.

Go is the recommended default here because of its infrastructure
ecosystem, concurrency model, compiled deployment model, and suitability
for a dedicated network data plane. In Node.js, blocking the event loop
is especially damaging, so CPU-heavy work and synchronous operations
must be avoided.

### Why not Rust?

Rust offers memory safety without garbage collection and fine-grained
performance control. It is attractive when predictable latency and
memory efficiency justify the investment.

Its trade-offs are a steeper learning curve and potentially slower
implementation for teams without Rust experience.

Decision: - Choose Go for a maintainable implementation and a smaller
team. - Choose Rust when low-level control and predictable resource
behavior justify additional engineering effort.

### Why PostgreSQL?

Configuration data is naturally relational: backend groups, instances,
routes, weights, versions, and audit records. PostgreSQL provides
transactions, constraints, durability, and strong querying.

Redis can be useful for ephemeral shared state, counters, or caching,
but should not automatically become the only durable configuration
store. Avoid a Redis lookup in the request-routing path; keep the active
routing table in local memory.

### Why gRPC and Protobuf?

The control plane can distribute typed configuration updates to multiple
load balancer nodes using gRPC streams. Protobuf provides compact,
schema-based messages.

The data plane should validate each update and atomically replace its
active routing snapshot. If an update is invalid or the control plane is
unavailable, it should retain the last-known-good configuration.

REST can be simpler for low-frequency administrative APIs. gRPC is
particularly useful for service-to-service streaming and typed control
messages.

## 9. Scaling to Large Traffic Volumes

A single load balancer is itself a bottleneck and a failure risk. Deploy
multiple instances:

``` text
          Network Entry Layer
             /    |    \
            v     v     v
          LB-1   LB-2   LB-3
             \    |    /
              Backend Pool
```

Each instance should maintain: - A local routing table. - Local health
information. - Local connection counters. - Local metrics. - A
configuration version.

The control plane distributes updates, but data-plane nodes make routing
decisions locally. Do not query a central database or Redis for every
request.

### Load-balancer high availability

Possible mechanisms: - A cloud network load balancer in front of the
custom instances. - Anycast with health-aware route advertisement. -
Active-passive failover with a virtual IP and VRRP. - DNS failover,
accounting for caching and propagation delays.

For most custom implementations, use a mature network-level entry layer
in front of the custom application load balancer. You do not need to
build BGP or global traffic management merely to build a custom L7
proxy.

## 10. Failure Handling and Reliability

### Backend failure

When a backend times out or refuses connections: 1. Record the failure.
2. Update passive health state if policy thresholds are met. 3. Exclude
the backend when it becomes unhealthy. 4. Retry only when the request
and failure type make retry safe.

### All backends unavailable

Return a controlled `503 Service Unavailable` response. Do not send
traffic to known-dead instances.

### Slow backend

Use: - Connection and response timeouts. - Maximum connection limits. -
Bounded queues. - Circuit breakers or backend ejection policies. - Load
shedding and admission control.

### Traffic spike

Use: - Rate limiting. - Connection limits. - Queue limits. - Backend
autoscaling. - Load shedding. - Admission control.

The objective is not to accept every request; it is to prevent overload
from cascading through the system.

### Retry safety

Retries can duplicate side effects. A payment request may have succeeded
even if its response was lost. Use idempotency keys for payment and
other state-changing operations.

Also use: - Maximum retry attempts. - Retry budgets. - Exponential
backoff with jitter. - Request deadlines. - Retries only for eligible
failures.

### Graceful draining

Before removing or deploying a backend: 1. Mark it as draining. 2. Stop
assigning new requests. 3. Allow in-flight requests and connections to
finish within a deadline. 4. Close remaining connections according to
policy. 5. Remove the instance from discovery.

## 11. Security

A production load balancer is a security boundary.

  Requirement              Approach
  ------------------------ ----------------------------------------
  Encrypted traffic        TLS 1.2/1.3
  Certificate management   Automated rotation
  Abuse prevention         Rate limiting and quotas
  DDoS protection          Network-level protection and filtering
  Admin access             Authentication, authorization, RBAC
  Internal communication   TLS or mTLS
  Client IP handling       Trust only known proxy hops
  Request limits           Header/body size and timeout limits
  Secrets                  Dedicated secrets manager
  Auditability             Configuration change audit logs

Never blindly trust `X-Forwarded-For` or similar headers supplied by
arbitrary clients. Establish the client address from the connection and
trust forwarded metadata only from explicitly trusted upstream proxies.

## 12. Observability

Monitor at least:

  Metric                   Purpose
  ------------------------ ------------------------------
  Requests per second      Incoming traffic
  Active connections       Connection distribution
  Backend CPU and memory   Resource pressure
  P50 latency              Typical latency
  P95 latency              Tail performance
  P99 latency              High-end latency
  HTTP 5xx rate            Proxy/backend failures
  Connection failures      Network and backend problems
  Health-check failures    Backend availability
  Retry count              Backend instability
  Queue depth              Congestion

A typical observability pipeline:

``` text
Load Balancer Nodes
   |         |          |
   v         v          v
Prometheus  Loki   OpenTelemetry
   |         |          |
   +---------+----------+
             |
             v
           Grafana
```

Avoid synchronous per-request database logging. Use structured logs,
asynchronous shipping, and sampling where appropriate. Avoid
high-cardinality metric labels such as raw user IDs or request IDs.

## 13. Technology Alternatives and Trade-offs

  -----------------------------------------------------------------------
  Requirement       Recommended       Alternatives      Trade-off
  ----------------- ----------------- ----------------- -----------------
  Core              Go                Node.js, Java,    Go balances
  implementation                      Rust, C           performance and
                                                        development speed

  Networking        TCP               HTTP-only         Sockets provide
                    sockets/runtime   framework         more protocol
                                                        control

  Control           gRPC              REST, Kafka       gRPC is useful
  communication                                         for typed
                                                        streaming updates

  Configuration     PostgreSQL        MongoDB, Redis    PostgreSQL fits
  storage                                               relational,
                                                        transactional
                                                        config

  Local routing     In-memory         Remote Redis      In-memory avoids
  state                               lookup            per-request
                                                        network latency

  Discovery         Kubernetes        Static config     Dynamic
                    API/Consul                          membership needs
                                                        a discovery
                                                        mechanism

  Metrics           Prometheus        Database polling  Prometheus is
                                                        designed for
                                                        metrics

  Dashboards        Grafana           Custom UI         Mature
                                                        visualization and
                                                        alerting

  Deployment        Kubernetes        Manual VMs        Orchestration and
                                                        scaling
  -----------------------------------------------------------------------

### Why not Kafka for configuration updates?

Kafka is excellent for durable event streams and asynchronous event
processing. For simple configuration distribution, gRPC streaming or a
purpose-built configuration synchronization mechanism is often simpler.

Kafka becomes more attractive when configuration events need durable
history, replay, or multiple independent consumers.

### Why not MongoDB?

MongoDB can store configuration documents, but backend groups,
instances, routes, weights, versions, and audit records have relational
relationships. PostgreSQL offers constraints and transactional updates
that fit this model well. MongoDB is still viable if the broader
platform is document-oriented.

### Why not split everything into microservices?

Do not automatically create ten independently deployed services. Start
with: - One data-plane application. - One control-plane application. -
One configuration database. - An observability stack.

Keep health monitoring, discovery, policy management, and administration
as internal modules initially. Preserve the data-plane/control-plane
boundary without creating unnecessary deployment complexity.

## 14. Advantages and Disadvantages of a Custom Load Balancer

### Advantages

1.  Control over routing algorithms.
2.  Custom business-specific routing policies.
3.  Integration with internal service discovery.
4.  Custom traffic prioritization.
5.  Visibility into routing decisions.
6.  Potential reduction in licensing costs.
7.  Domain-specific optimizations.

### Disadvantages

1.  Significant development effort.
2.  Complex networking and protocol handling.
3.  High availability becomes your responsibility.
4.  Security vulnerabilities can affect the whole application.
5.  Performance optimization is difficult.
6.  TLS, HTTP/2, HTTP/3, WebSockets, and connection management require
    expertise.
7.  Continuous maintenance and operations.
8.  Difficult to match the maturity of established products.

### Should you build one?

  -----------------------------------------------------------------------
  Scenario                            Recommendation
  ----------------------------------- -----------------------------------
  Learning networking/distributed     Build one
  systems                             

  Portfolio or educational project    Build one

  Custom internal routing             Evaluate building one
  requirements                        

  Standard production HTTP traffic    Prefer NGINX or HAProxy

  Large production infrastructure     Evaluate Envoy, HAProxy, NGINX, or
                                      managed services

  Mission-critical public traffic     Do not replace mature
                                      infrastructure without a compelling
                                      reason
  -----------------------------------------------------------------------

A custom implementation is not automatically better. Requirements must
justify its engineering and operational cost.

## 15. Recommended Reference Architecture

``` text
CLIENTS
   |
   v
DNS / NETWORK ENTRY
   |
   v
NETWORK LOAD BALANCER / ANYCAST
   |
   +----------------+----------------+
   |                |                |
   v                v                v
CUSTOM LB-1      CUSTOM LB-2      CUSTOM LB-3
(Go Data Plane)  (Go Data Plane)  (Go Data Plane)
   |                |                |
   +----------------+----------------+
                    |
                    v
              BACKEND POOLS
        User / Payment / Order / Product

CONTROL PLANE (Go)
   |
   +-- Admin API
   +-- Service Discovery
   +-- Health Monitor
   +-- Routing Policy Manager
   +-- Configuration Publisher
   |
   +-- PostgreSQL
   +-- Kubernetes API / Consul
   |
   +-- gRPC configuration streams to LB nodes

OBSERVABILITY
   +-- Prometheus
   +-- Grafana
   +-- Loki
   +-- OpenTelemetry
```

### Suggested control-plane API

  Method   Endpoint                       Responsibility
  -------- ------------------------------ ---------------------
  POST     `/admin/backends`              Register backend
  GET      `/admin/backends`              List backends
  PATCH    `/admin/backends/:id`          Update backend
  DELETE   `/admin/backends/:id`          Remove backend
  POST     `/admin/routes`                Create routing rule
  GET      `/admin/routes`                List routing rules
  PUT      `/admin/algorithms/:groupId`   Change algorithm
  GET      `/admin/health`                View health
  GET      `/admin/metrics`               View metrics

These management APIs must be authenticated and authorized and should
not be publicly exposed.

## 16. Implementation Roadmap

  Phase   Deliverable
  ------- ----------------------------------------------------------------
  1       TCP listener and connection handling
  2       HTTP reverse proxy
  3       Round Robin and Weighted Round Robin
  4       Least Connections
  5       Active and passive health checks
  6       Dynamic backend registration
  7       Control plane and configuration management
  8       Multiple load-balancer instances
  9       Metrics, logs, and tracing
  10      Security, failover, graceful draining, and performance testing

## 17. Important Interview and Architecture Takeaways

1.  **Why a load balancer?** Scalability, availability, and traffic
    distribution.
2.  **Why separate data and control planes?** Keep request processing
    independent from configuration management.
3.  **Why multiple algorithms?** Workloads differ in request duration,
    capacity, and connection behavior.
4.  **Why health checks?** Avoid routing traffic to unavailable or
    unready backends.
5.  **Why service discovery?** Automatically detect new and removed
    instances.
6.  **Why multiple load balancers?** Avoid making the load balancer a
    single point of failure.
7.  **Why local routing state?** Avoid centralized network calls for
    every request.
8.  **Why observability?** Detect imbalance, failures, and performance
    degradation.
9.  **Why controlled retries?** Prevent duplicate side effects and
    cascading failures.
10. **Why consider existing products?** Mature implementations reduce
    operational and security risk.

**Core architectural principle:** The data plane makes fast, local
routing decisions. The control plane manages backend membership, health,
configuration, and policy. They should be loosely coupled so temporary
control-plane failure does not immediately stop healthy traffic from
flowing.

## 18. Official References

-   NGINX HTTP Load Balancing:
    https://nginx.org/en/docs/http/load_balancing.html
-   NGINX Health Checks:
    https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/
-   NGINX TCP/UDP Load Balancing:
    https://nginx.org/en/docs/stream/ngx_stream_core_module.html
-   HAProxy Configuration Manual: https://docs.haproxy.org/
-   gRPC Documentation: https://grpc.io/docs/
-   Go Documentation: https://go.dev/doc/
-   Prometheus Documentation: https://prometheus.io/docs/
-   Kubernetes Services and Networking:
    https://kubernetes.io/docs/concepts/services-networking/

## Final Recommendation

Build a basic Layer 7 load balancer in Go, then progressively add health
checks, dynamic service discovery, distributed configuration, high
availability, observability, and failure handling. This provides
practical experience with networking, concurrency, distributed systems,
fault tolerance, and performance engineering.
