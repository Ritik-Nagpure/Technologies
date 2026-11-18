# Amazon E-Commerce Architecture: How It Works at Scale

> **Scope note:** Amazon's complete internal production architecture is proprietary. This document distinguishes publicly documented technologies and research from representative architecture patterns. Examples and numerical values are illustrative, not claims about Amazon's live systems.

## 1. Overview

Amazon is a global commerce and logistics platform. It coordinates customers, sellers, product listings, pricing, inventory, payments, warehouses, transportation, delivery partners, and analytics.

Its engineering challenges fall into two broad areas:

1. **Commerce:** Handle browsing, searching, cart operations, checkout, payments, and order management at very high scale.
2. **Logistics:** Determine whether an item can physically reach a customer's address by a particular date, then coordinate the fulfilment and delivery process.

A simplified architecture:

```text
Customers
   |
Web / Mobile Applications
   |
DNS / CDN / Edge Routing
   |
API Gateway / Backend-for-Frontend
   |
   +---- Customer Service
   +---- Product Catalogue Service
   +---- Search Service
   +---- Pricing Service
   +---- Cart Service
   +---- Recommendation Service
   |
Order Management
   |
   +---- Inventory Service
   +---- Payment Service
   +---- Fraud / Risk Service
   |
Fulfilment
   |
   +---- Warehouse Management
   +---- Allocation / Promise Engine
   +---- Shipment Management
   |
Logistics Network
   |
Sort Centres / Transport / Delivery Stations
   |
Delivery Partner
   |
Customer
```

This is a conceptual view, not an exact internal Amazon service map.

## 2. Why use independently scalable services?

A commerce platform contains capabilities with very different workloads. Product browsing may receive huge read traffic, while checkout requires careful transaction handling. Recommendations can be optional, but payment and inventory correctness are critical.

Typical service responsibilities:

| Service | Responsibility |
|---|---|
| Customer | Accounts, addresses, preferences |
| Catalogue | Product descriptions, SKUs, attributes, images |
| Search | Full-text search, filtering, ranking |
| Pricing | Prices, promotions, eligible offers |
| Cart | Shopping cart state |
| Inventory | Stock, reservations, sellable quantity |
| Order | Order lifecycle and state |
| Payment | Authorisation, capture, refunds, reconciliation |
| Recommendation | Personalised product suggestions |
| Fulfilment | Warehouse selection, picking, packing |
| Shipping / Delivery | Shipment routing, tracking, delivery estimates |
| Notification | Email, SMS, push notifications |

### Microservices versus monolith

| Microservices | Monolith |
|---|---|
| Independent deployment | One deployment unit |
| Independent scaling | Usually scales as a whole |
| Technology flexibility | Often one shared stack |
| Potential fault isolation | A failure can affect more modules |
| Network and operational complexity | Simpler local calls and operations |

Microservices are not automatically better. They introduce network failures, distributed transactions, service discovery, observability, and operational overhead. A modular monolith is often a better starting point for a smaller product.

## 3. How very high request volumes are handled

### 3.1 Edge delivery, routing, and load balancing

A typical request path is:

1. DNS resolves the service domain.
2. A CDN serves cacheable static assets such as images, JavaScript, and CSS.
3. Requests reach edge routing and load-balancing infrastructure.
4. Traffic is distributed across healthy application instances.
5. The relevant service handles the request.

```text
                 Incoming Requests
                         |
                 Edge / Load Balancer
                         |
              +----------+----------+
              |          |          |
           Instance A Instance B Instance C
              |          |          |
              +----------+----------+
                         |
                    Service Layer
```

The values in diagrams are illustrative. Load balancing distributes traffic; it does not make an application infinitely scalable by itself.

### 3.2 Horizontal scaling

- **Vertical scaling:** Increase CPU, RAM, or storage on one machine.
- **Horizontal scaling:** Add more machines or instances.

Horizontal scaling supports growth across many machines and availability zones, but requires distributed coordination, stateless application design where possible, and careful management of shared state.

### 3.3 Caching

Frequently accessed data can be cached to reduce repeated database reads.

Examples include product metadata, category information, and static assets. Cache invalidation is difficult: prices and inventory can change, so a cache must have an appropriate TTL, invalidation strategy, or freshness check.

Do not treat cached inventory as the final authority during checkout. Revalidate and reserve stock using the authoritative inventory mechanism.

### 3.4 Partitioning and replication

A large dataset can be partitioned across multiple nodes. A routing mechanism maps a key, such as customer ID or order ID, to the correct partition.

Replication stores copies of data on multiple nodes to improve availability and durability. Replicas may temporarily disagree because updates propagate over time.

Different data needs different consistency guarantees:

- Product descriptions and search indexes can often tolerate propagation delay.
- Financial records need strong correctness and auditability.
- Inventory reservations need concurrency control to avoid overselling.

Amazon's 2007 Dynamo paper describes techniques including consistent hashing, replication, versioning, and decentralised failure handling. Dynamo and DynamoDB are related historically but are not the same system.

## 4. Why use different data stores?

No single database is ideal for every workload.

| Storage type | Suitable workload | Reason |
|---|---|---|
| Relational database | Orders, payment records, transactional entities | ACID transactions and relational constraints |
| Key-value database | Cart/session/preferences and key-based access | Predictable low-latency key reads and writes |
| Document database | Flexible product attributes | Variable document structures |
| Search index | Product discovery | Full-text search, filters, ranking |
| Cache | Frequently accessed data | Low-latency reads |
| Object storage | Images, videos, documents | Durable storage for large objects |
| Data warehouse / lake | Analytics and reporting | Large-scale analytical processing |

The choice depends on access patterns, consistency, transaction boundaries, data volume, and operational cost—not popularity.

## 5. What happens when a customer searches for a product?

Example request:

```http
GET /search?q=iphone
```

A simplified flow:

1. Search service receives the query.
2. Search infrastructure looks up an index rather than scanning the entire product database.
3. The index returns matching product identifiers and ranking signals.
4. Catalogue service retrieves product details.
5. Pricing service supplies applicable price and promotion information.
6. Inventory and fulfilment systems provide availability and delivery eligibility.
7. The application assembles the response.

A search index is optimised for text matching, filtering, sorting, and relevance. It is commonly updated asynchronously from catalogue changes, so it may briefly lag behind the source of truth.

Elasticsearch and OpenSearch are examples of technologies that can implement this pattern; this is not a claim that either is Amazon's complete internal search implementation.

## 6. How delivery dates are calculated

A delivery estimate is not simply:

```text
Current date + 3 days
```

It is a promise based on the product, inventory, origin, destination, processing capacity, transport network, and order time.

A conceptual model is:

```text
Delivery Promise =
  f(product, inventory, seller, origin, destination,
    handling time, warehouse capacity, carrier capacity,
    route availability, order cutoff, calendar, risk)
```

### 6.1 Inputs to the promise engine

| Input | What it means |
|---|---|
| Inventory availability | Is there sellable stock? |
| Inventory location | Which fulfilment centre or seller has it? |
| Seller handling time | How long until the seller dispatches? |
| Warehouse processing | Pick, pack, label, and dispatch duration |
| Customer location | Destination postcode / service area |
| Transport schedule | Available trucks, flights, and connections |
| Delivery station | Capacity and serviceability near the destination |
| Carrier capacity | Whether the network can accept the shipment |
| Calendar | Weekends, holidays, operating hours |
| Disruptions | Weather, route closures, capacity constraints |

Amazon's seller documentation describes delivery time in terms that include handling time and transit time, with relevant calendar and buffer considerations.

### 6.2 Warehouse selection

Suppose a customer in Pune wants a laptop. An illustrative inventory view might be:

| Location | Sellable stock |
|---|---:|
| Mumbai fulfilment centre | 11 |
| Pune fulfilment centre | 4 |
| Bengaluru fulfilment centre | 1 |

The closest warehouse is not necessarily selected. The system can consider:

- Sellable and unreserved inventory.
- Warehouse processing capacity.
- Carrier schedules.
- Destination serviceability.
- Delivery station capacity.
- Delivery commitment and cost.

Physical stock is not necessarily sellable stock. Units may be damaged, reserved, quarantined, or otherwise unavailable.

### 6.3 Example calculation

Assume:

- Warehouse processing: 1 day
- Middle-mile transport: 1 day
- Last-mile processing and delivery: 1 day
- Additional planning buffer: 1 day

Illustrative estimate:

```text
1 + 1 + 1 + 1 = 4 days
```

A real promise engine should not simply add averages. It should account for order cutoffs, business calendars, departure schedules, network capacity, and uncertainty. It may use historical performance and predictive models to estimate a reliable delivery window.

### 6.4 Why the same product has different delivery dates

The same SKU can have different estimates for different customers because:

- Their postcodes are served by different facilities.
- Inventory is positioned differently.
- Carrier coverage and schedules differ.
- Local delivery capacity differs.
- The order is placed at a different time relative to cutoffs.
- A seller may support only selected destinations.

### 6.5 Why delivery may be unavailable

A product can exist in inventory but still be undeliverable to a destination.

Possible reasons:

1. No eligible inventory can serve the destination.
2. The seller does not ship to that postcode.
3. The carrier network does not cover the location.
4. The product is oversized or requires special handling.
5. The item is restricted or unsuitable for available transport modes.
6. Delivery-station capacity is unavailable.
7. A route is temporarily disrupted.
8. The system cannot make a sufficiently reliable delivery promise.

This can be a physical logistics constraint rather than a software defect.

## 7. How the delivery network works

The logistics process is commonly understood in three stages.

### 7.1 First mile: fulfilment centre

A warehouse management system coordinates tasks such as:

1. Receive the order or fulfilment request.
2. Identify the storage location.
3. Generate a picking task.
4. Pick and scan the item.
5. Pack and label the parcel.
6. Assign it to an outbound shipment.

Illustrative stock record:

```text
Warehouse: FC_MUM_01
SKU: LAPTOP_101
Bin: A-12-04
Physical quantity: 15
Reserved: 3
Damaged: 1
Sellable quantity: 11
```

### 7.2 Middle mile: movement between facilities

A parcel may travel through a network such as:

```text
Fulfilment Centre
       |
       v
Sort Centre
       |
       v
Regional Hub
       |
       v
Delivery Station
```

Not every parcel follows every facility in this sequence. The route depends on the network and service commitment.

Routing considers transit time, cost, vehicle capacity, package volume, facility hours, and route availability.

### 7.3 Last mile: delivery to the customer

At a delivery station, packages are grouped into routes and assigned to drivers or delivery partners.

The system can optimise stop order while considering:

- Driver and vehicle capacity.
- Delivery time windows.
- Geography and road network.
- Service constraints.
- Traffic and route conditions.

GPS-enabled delivery applications can send location updates. A backend can process these updates to show the latest observed location and estimate arrival. GPS, geospatial indexing, and route optimisation are general implementation patterns; specific technology choices vary.

## 8. Technologies and why they fit

Amazon uses many technologies across different teams and workloads. The table below mixes publicly documented technologies with representative implementation options; it is not a definitive list of Amazon's internal stack.

| Technology / category | Possible application | Why it fits |
|---|---|---|
| Java | Backend services | Mature ecosystem, concurrency, performance |
| C++ | Performance-sensitive components | Low-level control and efficiency |
| Python | Automation, data processing, ML | Productivity and libraries |
| JavaScript / TypeScript | Web applications and services | Web ecosystem and developer productivity |
| DynamoDB | Managed key-value/document workloads | Managed distributed database |
| Relational databases | Transactional records | ACID and structured relationships |
| Search indexes | Product discovery | Full-text search and filtering |
| Redis | Cache and ephemeral data | Low-latency access |
| Event streaming / queues | Asynchronous workflows | Decoupling and buffering |
| Object storage | Images and documents | Durable large-object storage |
| CDN | Static assets | Lower latency and origin load |
| ML models | Demand and delivery prediction | Forecasting from historical signals |
| Optimisation algorithms | Warehouse and route planning | Capacity and route decisions |

### Dynamo versus DynamoDB

- **Dynamo** is the distributed storage system described in Amazon's 2007 research paper.
- **DynamoDB** is Amazon's managed database service.

Do not use the names interchangeably.

### Why not use one relational database for everything?

A relational database is valuable for transactional correctness, but a single database may become a bottleneck for workloads with enormous key-based traffic, flexible search, or large analytical scans. The answer is not to abandon relational databases; it is to choose the right store for each workload and define clear ownership.

### Why not use a message broker for every operation?

A broker is useful for asynchronous work, but a customer-facing checkout request needs a timely response. A common design is to validate and persist a business operation synchronously, then publish durable events for downstream work.

## 9. Reliability and failure isolation

A recommendation outage should not prevent a customer from checking out. A shipping tracking delay should not corrupt payment records.

Reliability patterns include:

| Pattern | Purpose |
|---|---|
| Timeout | Avoid waiting indefinitely |
| Bounded retry with backoff and jitter | Handle transient failures without retry storms |
| Circuit breaker | Stop repeated calls to a failing dependency |
| Rate limiting | Protect services from excessive traffic |
| Load shedding | Reject lower-priority work during overload |
| Replication | Improve availability and durability |
| Bulkhead | Limit failure propagation |
| Idempotency | Prevent duplicate business effects |
| Dead-letter queue | Preserve messages that repeatedly fail |

Retries must be bounded and used carefully. A retry can make an outage worse if many clients retry simultaneously.

## 10. Consistency across services: Saga and Outbox

An order can involve separate services and databases:

1. Order
2. Inventory
3. Payment
4. Fulfilment
5. Notification

A single ACID database transaction generally cannot span all independent services.

### 10.1 Saga pattern

Example:

```text
Create Pending Order
        |
        v
Reserve Inventory
        |
        v
Process Payment
        |
        +---- Success
        |       |
        |       v
        |   Confirm Order
        |       |
        |       v
        |   Start Fulfilment
        |
        +---- Failure
                |
                v
          Release Inventory
                |
                v
           Cancel Order
```

A Saga coordinates local transactions and uses compensating actions when a later step fails.

### 10.2 Transactional Outbox

A common failure is:

- The database transaction commits.
- Publishing the event fails.
- Downstream services never learn about the change.

With the transactional outbox pattern, the service saves both the business update and an outgoing event record in the same local database transaction. A separate publisher sends the event and retries as needed.

Consumers should be idempotent because messages can be delivered more than once.

Payment flows also require idempotency keys, reconciliation, and explicit handling of uncertain outcomes. A timeout does not prove that a payment failed.

## 11. How delivery estimates adapt to disruptions

Suppose a delivery was initially estimated for 20 November, but a transport connection is cancelled.

A new estimate may be 22 November if the next available connection and remaining processing require two additional days. This is an illustrative scenario.

Systems can consume events such as:

```text
ORDER_CONFIRMED
INVENTORY_RESERVED
PACKAGE_PICKED
PACKAGE_PACKED
PACKAGE_DISPATCHED
ARRIVED_AT_SORT_CENTER
ARRIVED_AT_DELIVERY_STATION
OUT_FOR_DELIVERY
DELIVERY_COMPLETED
DELIVERY_FAILED
```

The system distinguishes:

- **Delivery promise:** The estimate or commitment presented before or at purchase.
- **Delivery prediction:** The latest expected arrival based on current information.
- **Tracking status:** The actual observed state of the shipment.

Machine learning and optimisation play different roles:

- ML can predict demand, transit duration, or delay probability.
- Optimisation can select inventory locations, transport routes, and delivery assignments under constraints.

A prediction is not a guarantee. The system should update estimates when meaningful new information arrives and communicate material changes.

## 12. Managing large operational and analytical datasets

Commerce systems generate customer, product, search, order, payment, inventory, shipment, tracking, and behavioural data.

Operational and analytical workloads should be separated.

```text
Application Services
        |
Operational Databases
        |
Event Stream / Data Ingestion
        |
   +----+----------------+
   |                     |
   v                     v
Data Lake          Stream Processing
   |                     |
   v                     v
Data Warehouse      Real-time Dashboards
   |
BI / Analytics / ML
```

- **OLTP:** Creates orders, reserves inventory, processes payments, updates shipment state.
- **OLAP:** Analyses sales, demand, warehouse performance, delivery delays, and route efficiency.

Analytical queries should not overload critical transactional databases.

## 13. Building a simplified version with Node.js and AWS

A practical implementation could use:

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js + TypeScript | SEO and server rendering |
| Backend | Node.js + NestJS | Modular TypeScript services |
| API routing | API Gateway / ALB | Routing and entry point |
| Compute | ECS Fargate | Containerised workloads |
| Transactional DB | PostgreSQL / Aurora | Relational transactions |
| Key-value store | DynamoDB | Key-based access patterns |
| Cache | Redis / ElastiCache | Frequently accessed data |
| Search | OpenSearch | Product search |
| Messaging | SQS + SNS | Queues and fan-out |
| Event routing | EventBridge | Domain event routing |
| Files | S3 | Product images and documents |
| CDN | CloudFront | Static content delivery |
| Monitoring | CloudWatch + OpenTelemetry | Logs, metrics, traces |
| Infrastructure | AWS CDK | Infrastructure as code |

These are recommended design choices for a learning or production project, not a claim that Amazon.com uses this exact stack.

### 13.1 Suggested repository structure

```text
ecommerce-platform/
|
+-- apps/
|   +-- web/
|   +-- api-gateway/
|   +-- services/
|       +-- identity-service/
|       +-- customer-service/
|       +-- catalog-service/
|       +-- search-service/
|       +-- pricing-service/
|       +-- cart-service/
|       +-- inventory-service/
|       +-- order-service/
|       +-- payment-service/
|       +-- fulfilment-service/
|       +-- delivery-service/
|       +-- notification-service/
|
+-- packages/
|   +-- contracts/
|   +-- event-schemas/
|   +-- observability/
|   +-- shared-utils/
|
+-- infrastructure/
    +-- networking/
    +-- databases/
    +-- messaging/
    +-- compute/
    +-- monitoring/
```

### 13.2 Data ownership

| Service | Example entities |
|---|---|
| Customer | Customer, Address |
| Catalogue | Product, SKU, Category |
| Pricing | Price, Promotion |
| Cart | Cart, CartItem |
| Inventory | Stock, Reservation |
| Order | Order, OrderItem |
| Payment | Payment, Refund |
| Fulfilment | Shipment, Warehouse |
| Delivery | Delivery, Route, TrackingEvent |

Each service should own its business data. Avoid allowing every service to query every other service's database directly.

### 13.3 Representative APIs

```http
GET /products/:productId
GET /products/search?q=laptop
GET /inventory/:sku?location=pune
POST /inventory/reservations
DELETE /inventory/reservations/:reservationId
GET /delivery-estimates?sku=SKU101&pincode=411001
GET /deliveries/:deliveryId/tracking
POST /orders
GET /orders/:orderId
POST /payments
GET /payments/:paymentId
```

### 13.4 Checkout workflow

```text
Customer
   |
   v
Order API
   |
   v
Validate Cart and Price
   |
   v
Reserve Inventory
   |
   v
Create Pending Order
   |
   v
Process Payment
   |
   +---- Payment Success
   |          |
   |          v
   |     Confirm Order
   |          |
   |          v
   |     Publish OrderConfirmed
   |          |
   |          v
   |     Fulfilment
   |
   +---- Payment Failure
              |
              v
        Cancel Pending Order
              |
              v
        Release Inventory
```

A real implementation needs durable state transitions, idempotency, outbox publishing, compensation, retry handling, and payment reconciliation. Do not implement this as a chain of API calls without failure recovery.

## 14. Interview topics to master

1. How would you design an e-commerce platform for millions of users?
2. How would you prevent two customers from buying the last unit?
3. How would you handle high concurrent checkout traffic?
4. How would you design a distributed shopping cart?
5. When would you choose PostgreSQL over DynamoDB?
6. How would you maintain consistency between orders and inventory?
7. How would you calculate a delivery estimate?
8. How would you handle a delivery delay after a promise is shown?
9. How would you assign packages to delivery partners?
10. How would you implement package tracking?
11. How would you prevent duplicate payment requests?
12. How would you stop a failing recommendation service affecting checkout?
13. How would you scale product search independently?
14. How would you avoid stale inventory data?
15. How would you process duplicate events safely?

## 15. Key engineering lessons

Amazon's scale does not come from one database, one programming language, or microservices alone. It comes from combining:

1. **Decomposition:** Independent services own business capabilities.
2. **Distribution:** Traffic and data are spread across infrastructure.
3. **Specialisation:** Different stores and tools serve different workloads.
4. **Asynchronous processing:** Non-critical work is decoupled through events.
5. **Fault isolation:** Failures are contained.
6. **Predictive intelligence:** Models forecast demand and delivery outcomes.
7. **Optimisation:** Algorithms coordinate inventory, warehouses, vehicles, and routes.
8. **Feedback loops:** Actual operational events update system decisions.

For system design interviews, focus especially on inventory consistency, delivery promise calculation, distributed checkout, failure recovery, and logistics optimisation. These demonstrate engineering judgement beyond simply knowing how to build microservices.

## 16. Further reading

- **Dynamo: Amazon's Highly Available Key-value Store** — https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf
- **Amazon Science** — https://www.amazon.science/
- **Amazon Seller Central: Delivery time and handling time guidance** — https://sellercentral.amazon.com/
- **Amazon Web Services architecture guidance** — https://docs.aws.amazon.com/architecture/

