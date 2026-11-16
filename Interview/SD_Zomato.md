# Zomato System Architecture: Complete Technical Breakdown

> Note: Zomato's complete production architecture, internal algorithms, database schemas and technology choices are proprietary. This document distinguishes publicly documented engineering information from proposed reference architecture and illustrative examples.

## 1. Understanding the Business Problem

Zomato is a large-scale, location-aware, real-time food delivery platform.

It connects three independent participants:

1. Customer - Creates demand.
2. Restaurant - Supplies food.
3. Delivery Partner - Supplies delivery capacity.

Zomato acts as the orchestrator connecting all three.

### The Core Challenges

- Finding restaurants that can serve a customer's location.
- Managing menus, availability and pricing.
- Processing orders and payments.
- Managing restaurant preparation capacity.
- Finding available delivery partners.
- Assigning delivery partners efficiently.
- Predicting demand in geographical areas.
- Balancing delivery partner supply and customer demand.
- Optimizing discounts and promotions.
- Maintaining real-time order tracking.

### The Three-Sided Marketplace Problem

The platform must continuously balance:

- Customer demand.
- Restaurant supply and kitchen capacity.
- Delivery partner availability.

Examples:

- Too many customers and too few restaurants result in longer preparation queues.
- Too many orders and too few delivery partners result in delivery delays.
- Too many delivery partners and too few orders result in idle delivery capacity.
- Excessive discounts can increase orders while reducing profitability.

Therefore, the platform must optimize the entire marketplace, not just API response times.

---

## 2. High-Level System Architecture

The following is a proposed logical architecture, not a verified representation of every internal Zomato service.

### Client Applications

- Customer Application
- Restaurant Application
- Delivery Partner Application
- Admin Application

### API Gateway / Edge Layer

Responsibilities:

- Authentication
- Authorization
- Rate limiting
- Request routing
- WAF
- API versioning

### Backend Services

1. Authentication Service
2. Customer Service
3. Restaurant Service
4. Restaurant Discovery Service
5. Catalog Service
6. Search Service
7. Pricing Service
8. Promotion Service
9. Cart Service
10. Order Service
11. Payment Service
12. Dispatch Service
13. Delivery Partner Service
14. Location Service
15. ETA Prediction Service
16. Notification Service
17. Analytics Service

### Data Infrastructure

- PostgreSQL / Aurora: Transactional data.
- Redis / ElastiCache: Caching and frequently updated state.
- Kafka: Event streaming.
- DynamoDB: High-scale key-value access.
- MongoDB: Flexible document storage.
- Elasticsearch / OpenSearch: Restaurant and menu search.
- S3: Object storage and ML artifacts.
- Data Lake: Historical analytics and model training.

---

## 3. Why Microservices Instead of a Monolith?

Imagine a backend containing:

- Authentication
- Restaurant discovery
- Menu management
- Orders
- Payments
- Delivery assignment
- Notifications

If delivery assignment suddenly experiences high traffic, scaling the entire backend becomes expensive.

With independently deployable services, we can scale dispatch without scaling the entire application.

| Architecture | Advantages | Disadvantages |
|---|---|---|
| Monolith | Simple deployment, easier transactions | Scaling and deployment coupling |
| Microservices | Independent scaling and ownership | Network failures, operational complexity |
| Modular Monolith | Strong boundaries without distributed overhead | Limited independent scaling |

Recommendation:

Use domain-driven boundaries and independently scale high-load components. Do not split every small business operation into a separate microservice.

---

## 4. Technology Selection and Alternatives

These are suitable technologies for a Zomato-scale reference architecture, not a claim that Zomato uses every technology listed.

| Technology | Why Use It? | Alternative |
|---|---|---|
| Node.js / Go / Java | High-concurrency services | Python, .NET |
| PostgreSQL | Transactional consistency | MySQL |
| Redis | Low-latency frequently accessed data | Memcached |
| Kafka | Asynchronous event distribution | RabbitMQ, Pulsar |
| Elasticsearch | Text and geo-search | PostgreSQL/PostGIS |
| Kubernetes | Container orchestration | ECS, Nomad |
| WebSockets | Live tracking updates | SSE, Polling |
| Python | ML and forecasting | Java, Scala |

Important:

Do not use Kafka for every request.

An order payment confirmation requires reliable transactional handling. An asynchronous event stream helps distribute the resulting state changes to other services.

---

## 5. How Zomato Divides a City into Restaurant Zones

This is one of the most important architectural concepts.

When a customer opens Zomato in Pune, the system does not need to search every restaurant in India.

It needs to identify restaurants that can serve the customer's delivery location.

Two separate concepts are involved:

1. Geospatial partitioning: Dividing geographical areas into manageable regions.
2. Serviceability: Determining whether a restaurant can deliver to a particular customer location.

### Step 1: Capture Customer Location

Example:

    {
      "latitude": 18.5204,
      "longitude": 73.8567
    }

The backend receives the customer's delivery coordinates.

### Step 2: Divide the City into Geographical Cells

A system can use:

- H3
- Google S2
- Geohash
- PostGIS

Imagine Pune divided into geographical cells:

| Cell | Illustrative Area |
|---|---|
| P1 | Shivajinagar |
| P2 | Koregaon Park |
| P3 | Kothrud |
| P4 | Baner |
| P5 | Hadapsar |

These are illustrative business zones, not actual Zomato partitions.

Each restaurant has:

- Restaurant ID
- Latitude
- Longitude
- Serviceable delivery area
- Operating hours
- Availability status

### Step 3: Find Eligible Restaurants

Example restaurant:

    {
      "restaurantId": "R101",
      "latitude": 18.5362,
      "longitude": 73.8940,
      "deliveryRadiusKm": 5,
      "isAcceptingOrders": true
    }

A naive system might use:

    distance(customer, restaurant) <= 5 km

However, straight-line distance is not the same as road distance.

A restaurant 3 km away geographically could require 6 km of road travel.

A better eligibility pipeline:

1. Find nearby restaurants using a spatial index.
2. Check restaurant serviceability.
3. Check operating hours.
4. Check kitchen capacity.
5. Estimate road travel time.
6. Rank eligible restaurants using relevance, ETA and quality.

### Restaurant Discovery Pipeline

    Customer Coordinates
            |
            v
    Geospatial Index Lookup
            |
            v
    Serviceability Filtering
            |
            v
    Restaurant Availability
            |
            v
    ETA Calculation
            |
            v
    Restaurant Ranking
            |
            v
    Results Returned to Customer

### Why H3, Geohash or PostGIS?

H3:
- Hierarchical hexagonal geographical indexing.
- Useful for location aggregation.
- Useful for geographical demand analysis.

Geohash:
- Hierarchical spatial indexing.
- Simple encoding of geographical coordinates.

PostGIS:
- Powerful spatial queries.
- Polygon and geographical operations.
- Exact distance calculations.

These technologies are alternatives, not necessarily all used together.

---

## 6. How Zomato Knows Available Delivery Partners

This is where real-time location processing becomes important.

A delivery partner's mobile application periodically sends GPS updates to the backend.

Example:

    {
      "partnerId": "DP101",
      "latitude": 18.5204,
      "longitude": 73.8567,
      "timestamp": "2026-11-16T20:30:00Z",
      "status": "AVAILABLE"
    }

The Location Service maintains the latest partner location in Redis or another low-latency location store.

### 6.1 Delivery Partner States

A delivery partner isn't simply online or offline.

Possible states:

| State | Meaning |
|---|---|
| OFFLINE | Not accepting work |
| AVAILABLE | Ready for an order |
| OFFERED | Assignment offer sent |
| RESERVED | Temporarily reserved |
| TO_PICKUP | Travelling to restaurant |
| AT_RESTAURANT | Waiting for food |
| TO_CUSTOMER | Delivering food |
| COMPLETED | Delivery completed |

These states prevent incompatible simultaneous assignments.

### 6.2 Count Delivery Partners in a Particular Area

Imagine Baner has the following tracked partners:

| State | Count |
|---|---:|
| Available | 120 |
| Delivering | 80 |
| Reserved / Unavailable | 50 |
| Total | 250 |

These figures are illustrative.

The system can query delivery partners inside a geographical cell and its neighbouring cells.

Illustrative SQL:

    SELECT COUNT(*)
    FROM delivery_partners
    WHERE h3_cell IN ('BANER_CELL', 'NEIGHBOUR_CELL')
    AND status = 'AVAILABLE'
    AND last_seen > NOW() - INTERVAL '60 seconds';

At scale, avoid running this database query on every customer request.

Maintain a continuously updated location index and aggregated counters.

### 6.3 GPS Location Is Not Availability

Consider these situations:

- Partner is online but has poor network connectivity.
- Partner has GPS enabled but has stopped accepting orders.
- Partner is delivering an order and is physically near another restaurant.
- Partner has accepted an assignment but hasn't started moving.

Therefore, the system needs:

- Heartbeats.
- Last-seen timestamps.
- Assignment state.
- GPS freshness checks.
- Atomic assignment reservations.

A partner whose last GPS update was 10 minutes ago should not be considered immediately available.

---

## 7. How Zomato Predicts Required Delivery Partners

Counting available partners and predicting required partners are two different problems.

Imagine Baner has:

| Metric | Value |
|---|---:|
| Predicted orders next 30 minutes | 180 |
| Average delivery cycle | 30 minutes |
| Target utilization | 75% |
| Available partners | 100 |

Simplified capacity calculation:

    RequiredDP =
    (PredictedOrders * AverageDeliveryCycle)
    / (TimeWindow * TargetUtilization)

    RequiredDP =
    (180 * 30) / (30 * 0.75)

    RequiredDP = 240

Therefore:

- Required partners: 240
- Available partners: 100
- Estimated shortage: 140

This simplified calculation assumes each partner handles one order per delivery cycle.

Real systems must account for:

- Delivery batching.
- Pickup delays.
- Travel distances.
- Partner shifts.
- Traffic.
- Restaurant preparation times.
- Uneven geographical demand.

### 7.1 How Does Zomato Predict What Customers Will Order?

It does not need to know exactly which customer will order a pizza.

It predicts aggregate demand.

Example:

    {
      "area": "BANER",
      "timeWindow": "20:30-21:00",
      "predictedOrders": 180,
      "expectedCategories": {
        "pizza": 45,
        "biryani": 55,
        "burgers": 30,
        "other": 50
      }
    }

These numbers are hypothetical.

Potential input features:

| Feature | Why It Matters |
|---|---|
| Historical orders | Recurring demand patterns |
| Time of day | Lunch and dinner patterns |
| Day of week | Weekend behaviour |
| Weather | Rain can affect ordering |
| Festivals | Special demand patterns |
| Local events | Sudden demand spikes |
| Active users | Current customer interest |
| Search events | Purchase intent |
| Cart events | Stronger purchase intent |
| Restaurant availability | Limits actual supply |

### Demand Forecasting Pipeline

    Historical Orders
            |
    Live Events
            |
    Weather Data
            |
    Calendar Data
            |
            v
    Feature Engineering
            |
            v
    ML / Time-Series Model
            |
            v
    Demand Prediction by Area
            |
            v
    Delivery Partner Supply Planning
            |
            v
    Partner Incentives and Allocation

The platform can use predictions to encourage more delivery partners to come online or move toward areas with expected demand.

---

## 8. How Delivery Partner Assignment Works

Imagine:

- Customer orders biryani.
- Restaurant is in Koregaon Park.
- Customer is in Kalyani Nagar.
- Five delivery partners are nearby.

The closest partner is not necessarily the best partner.

### Step 1: Find Candidate Partners

The Dispatch Service queries a spatial index.

| Partner | Distance to Restaurant | Status |
|---|---:|---|
| DP101 | 500 m | Available |
| DP102 | 700 m | Available |
| DP103 | 300 m | Delivering another order |
| DP104 | 1.2 km | Available |
| DP105 | 400 m | Reserved |

Initially, DP101, DP102 and DP104 are candidates.

### Step 2: Estimate Pickup Arrival Time

    PickupETA =
    TravelTime(DeliveryPartner, Restaurant)

The system considers:

- Road distance.
- Traffic.
- Road restrictions.
- Historical delivery partner speed.
- Current GPS location.

### Step 3: Estimate Total Delivery Time

    DeliveryETA =
    KitchenPreparationTime
    + PickupTravelTime
    + FoodDeliveryTime
    + OperationalBuffer

### Step 4: Calculate Assignment Score

A simplified weighted scoring model:

    Score =
    w1 * PickupETA
    + w2 * DeliveryETA
    + w3 * PartnerWorkload
    + w4 * AssignmentRisk

The dispatch system selects the candidate with the lowest valid score, subject to operational constraints.

Example:

| Partner | Pickup ETA | Total Delivery ETA |
|---|---:|---:|
| DP101 | 5 min | 28 min |
| DP102 | 7 min | 25 min |
| DP104 | 11 min | 31 min |

DP102 could be selected even though DP101 is closer because its overall delivery time is lower.

### Step 5: Reserve the Partner

This is a distributed-systems concurrency problem.

Two simultaneous orders must not successfully reserve the same available partner.

Illustrative Redis operation:

    SET assignment:DP102 ORDER123 NX EX 30

Explanation:

- NX: Only set if the key doesn't exist.
- EX 30: Expire the reservation after 30 seconds.

Production implementation also needs:

- Assignment ownership.
- Idempotency.
- Expiry handling.
- State reconciliation.
- Reliable acceptance and rejection handling.

### Step 6: Send Assignment Notification

    Dispatch Service
          |
          v
    Assignment Created
          |
          v
    Kafka Event
          |
          v
    Delivery Partner Notification
          |
          v
    Partner Accepts / Rejects
          |
          v
    Confirm Assignment or Retry

If the partner rejects or times out, the dispatch system attempts another candidate.

### Zomato's Publicly Documented ETA Engineering

Zomato published an engineering series about its ETA prediction system.

Its documented approach includes:

- Kitchen Preparation Time.
- Dynamic buffers.
- Delivery partner ETA.
- Traffic and road conditions.
- Weather.
- Demand and delivery partner supply.
- Tree-based prediction models.

The company explained why it moved from a map-graph-based model to a tree-based prediction model for delivery ETA.

This is an example of choosing a model based on production constraints rather than theoretical sophistication.

---

## 9. How Zomato Decides Discounts on Restaurants and Items

Discounting is a combination of marketplace economics, restaurant agreements, customer behaviour, campaign rules and optimization.

### 9.1 Types of Discounts

| Discount Type | Who Funds It? |
|---|---|
| Restaurant-funded | Restaurant |
| Platform-funded | Zomato |
| Bank-funded | Banking partner |
| Membership benefit | Platform or agreed partner |
| Joint promotion | Multiple parties |

This distinction is important because the discount directly affects profitability.

### 9.2 What Determines Whether an Item Gets a Discount?

I would design a Promotion Decision Engine.

Inputs:

#### A. Restaurant Information

- Restaurant sales volume.
- Kitchen capacity.
- Restaurant profit margin.
- Historical order conversion.
- Restaurant-funded promotional budget.

#### B. Item Information

- Item popularity.
- Item selling price.
- Item contribution margin.
- Historical sales.
- Inventory or availability.
- Item conversion rate.

#### C. Customer Information

- Order frequency.
- Customer acquisition or retention status.
- Previous orders.
- Price sensitivity.
- Membership eligibility.
- Campaign eligibility.

#### D. Marketplace Information

- Current demand in the area.
- Competitor promotions.
- Restaurant availability.
- Delivery partner availability.
- Time of day.
- Campaign budget.

These are proposed decision features, not a confirmed list of Zomato's internal ML features.

### 9.3 Example: Biryani Promotion Economics

Original item price: ₹250

Restaurant discount: 20%

Total discount: ₹50

Customer pays: ₹200

Suppose the discount funding is:

| Funding Source | Amount |
|---|---:|
| Restaurant | ₹30 |
| Platform | ₹20 |
| Total | ₹50 |

Taxes, delivery fees and other charges are excluded.

### 9.4 Why Would the Platform Discount an Item?

Imagine:

Restaurant A sells 100 biryanis daily without a discount.

Restaurant B sells 20 biryanis daily.

Restaurant B has spare kitchen capacity and wants more orders.

The platform could run a promotion for Restaurant B to increase order volume.

However, discounts are not automatically profitable.

The promotion should generate incremental orders rather than simply discount orders that would have happened anyway.

Simplified equation:

    IncrementalProfit =
    IncrementalContribution - PromotionCost

### 9.5 Promotion Decision Engine

    Customer Opens Restaurant / Item
                  |
                  v
    Promotion Eligibility Service
                  |
          +-------+-------+
          |       |       |
          v       v       v
       Customer Item   Budget
       Rules   Rules   Validation
          |       |       |
          +-------+-------+
                  |
                  v
          Campaign Rules
                  |
                  v
        Promotion Optimization
                  |
                  v
       Final Eligible Offers
                  |
                  v
        Final Payable Amount

Production requirements:

- Campaign budget reservation.
- Maximum discount limits.
- Coupon stacking restrictions.
- Idempotent redemption.
- Expiration and eligibility validation.
- Fraud detection.
- Audit logs.

Important architectural decision:

Never trust the discount amount sent by the frontend. The backend must calculate and validate the final payable amount.

---

## 10. Complete Order Lifecycle

Let's connect everything.

Suppose a customer orders biryani from a restaurant in Pune.

### Order Flow

1. Customer opens Zomato.
2. Location Service resolves delivery coordinates.
3. Restaurant Discovery identifies serviceable restaurants.
4. Catalog Service returns menu information.
5. Promotion Engine evaluates eligible offers.
6. Customer adds items to cart.
7. Order Service validates cart, pricing and delivery address.
8. Payment Service authorizes payment.
9. Restaurant receives the order.
10. Restaurant confirms preparation.
11. ETA Service predicts preparation and delivery time.
12. Dispatch Service finds a suitable delivery partner.
13. Delivery partner accepts assignment.
14. Partner travels to the restaurant.
15. Partner collects the food.
16. Live tracking updates customer location view.
17. Partner delivers the order.
18. Order Service marks the order delivered.
19. Payment settlement and partner payout workflows are updated.

### Order State Machine

    CREATED
       |
       v
    PAYMENT_AUTHORIZED
       |
       v
    RESTAURANT_CONFIRMED
       |
       v
    PREPARING
       |
       v
    READY_FOR_PICKUP
       |
       v
    PICKED_UP
       |
       v
    DELIVERED

Failure states must also exist:

    PAYMENT_FAILED
    RESTAURANT_REJECTED
    CUSTOMER_CANCELLED
    DELIVERY_UNASSIGNED
    DELIVERY_FAILED
    REFUND_PENDING
    REFUNDED

### Synchronous vs Asynchronous Operations

| Operation | Recommended Approach | Reason |
|---|---|---|
| Restaurant search | Synchronous | Immediate results |
| Price validation | Synchronous | Prevent incorrect checkout |
| Payment authorization | Synchronous request with provider | Checkout needs an outcome |
| Restaurant notification | Asynchronous | Avoid blocking order processing |
| Partner location updates | Streaming / asynchronous | High-frequency updates |
| Dispatch events | Event-driven | Independent processing |
| Customer notifications | Asynchronous | Not critical to order commit |
| Analytics | Asynchronous | Must not slow checkout |

A production order workflow should use:

- State machines.
- Durable events.
- Saga pattern.
- Transactional outbox.
- Idempotent consumers.

Why?

Because an order, payment, restaurant and delivery assignment cannot safely be treated as one traditional database transaction across independent services.

---

## 11. Technologies Publicly Documented by Zomato

Zomato's February 2024 engineering articles provide useful insight into its infrastructure.

The following technologies have been publicly documented:

| Technology | Documented Usage |
|---|---|
| AWS EC2 | Compute infrastructure |
| AWS ECS | Container orchestration |
| ElastiCache | Caching |
| DynamoDB | Database |
| Aurora RDS | Relational database |
| MongoDB | Database |
| Kafka | Event-driven architecture |
| Kuma | Service mesh |
| LightGBM | ETA prediction |
| FastAPI | ML model serving |
| Optuna | Hyperparameter optimization |
| S3 | ML model artifact storage |

### Why These Technologies?

| Technology | Why It Fits | Main Disadvantage |
|---|---|---|
| ECS | Managed container orchestration | Less flexible than Kubernetes in some scenarios |
| ElastiCache | Low-latency caching | Cache invalidation and memory cost |
| DynamoDB | Horizontally scalable key-value access | Query and data modelling constraints |
| Aurora | Relational transactions | Scaling writes and cost management |
| MongoDB | Flexible document storage | Requires careful consistency and indexing |
| Kafka | High-throughput event streaming | Operational and consumer-management complexity |
| Kuma | Service-to-service traffic management | Additional network overhead |
| LightGBM | Fast inference on structured data | Not ideal for every ML problem |
| FastAPI | Lightweight Python model serving | Python concurrency and CPU considerations |

### Why LightGBM Instead of a Neural Network?

ETA prediction is a structured regression problem.

Zomato reported that gradient-boosted trees performed competitively with neural networks while meeting its accuracy, latency and resource requirements.

Its engineering team also reported switching ML serving from MLflow to FastAPI, achieving 3x throughput per pod and 2x latency improvement in its particular benchmark.

This illustrates an important engineering principle:

Choose the simplest model that meets accuracy, throughput, latency and cost requirements.

---

## 12. Handling Massive Traffic

Imagine New Year's Eve.

Thousands of customers are placing orders simultaneously.

Zomato must avoid:

- Database connection exhaustion.
- Slow restaurant discovery.
- Kafka consumer backlogs.
- Redis memory pressure.
- Duplicate orders.
- Duplicate delivery assignments.
- Payment inconsistencies.
- Notification failures.

Zomato's publicly documented NYE 2023 engineering report reported:

| Metric | Reported Value |
|---|---:|
| Peak incoming requests | 80.92 million/minute |
| Peak order rate | 8,400/minute |
| Kafka messages | 450+ million/minute |
| Cache memory | 35 TB |
| EC2 instances | 11,000 |
| ECS tasks | Approximately 40,000 |
| Microservices benchmarked | 300+ |

These are historical figures for that specific event, not current capacity guarantees.

### Production Reliability Mechanisms

| Problem | Solution |
|---|---|
| Service unavailable | Circuit breaker |
| Slow downstream service | Timeout |
| Temporary failure | Controlled retry with backoff |
| Duplicate events | Idempotency |
| Consumer backlog | Partitioning and consumer scaling |
| Database overload | Caching, indexing and read replicas |
| Traffic spike | Autoscaling and pre-scaling |
| Critical dependency failure | Graceful degradation |
| Hidden performance problems | Distributed tracing and metrics |

Important concepts:

- Kill switches.
- Degraded operating modes.
- Chaos testing.
- Backpressure.
- Rate limiting.
- Load shedding.

Production architecture is not just about handling normal requests. It is about controlling failures.

---

## 13. Important Architectural Concepts to Learn

| Business Problem | Engineering Concept |
|---|---|
| Find nearby restaurants | Geospatial indexing |
| Find available delivery partners | Real-time location indexing |
| Predict demand | Time-series forecasting / ML |
| Assign delivery partners | Optimization algorithms |
| Calculate ETA | Regression / ML |
| Offer discounts | Pricing and promotion optimization |
| Handle millions of events | Event-driven architecture |
| Prevent duplicate assignments | Atomic operations and concurrency control |
| Handle payment and order consistency | Saga pattern |
| Scale services independently | Microservices |
| Survive traffic spikes | Horizontal scaling |
| Handle service failures | Resilience engineering |
| Track order progress | Event streaming and real-time communication |

---

## 14. How I Would Build a Zomato-Like Platform

I would not start by implementing 30 microservices.

I would build it in phases.

### Phase 1: Core Marketplace

Technology:

- React / Next.js
- Node.js + TypeScript
- PostgreSQL + PostGIS
- Redis

Features:

- Customer authentication.
- Restaurant registration.
- Restaurant discovery.
- Menu management.
- Cart.
- Orders.
- Payments.

### Phase 2: Delivery Orchestration

Technology:

- Kafka.
- WebSockets.
- Redis.
- Geospatial indexing.

Features:

- Delivery partner application.
- GPS ingestion.
- Delivery partner availability.
- Dispatch engine.
- Partner assignment.
- Live tracking.

### Phase 3: Intelligence Layer

Technology:

- Python.
- LightGBM.
- Time-series models.
- Data pipelines.

Features:

- Demand forecasting.
- ETA prediction.
- Promotion optimization.
- Delivery partner supply prediction.
- Customer segmentation.

### Phase 4: Enterprise Scale

Technology:

- AWS ECS / Kubernetes.
- Multi-region architecture.
- Observability infrastructure.
- Automated scaling.
- Chaos engineering.
- Data lake and analytics.

---

## 15. Three Algorithms Worth Understanding Deeply

### 1. Geospatial Serviceability and Demand Mapping

Study:

- H3.
- Geohash.
- PostGIS.
- Spatial indexing.
- Geofencing.
- Location aggregation.

Goal: Understand how a platform finds nearby restaurants and tracks geographical demand.

### 2. Delivery Partner Dispatch Optimization

Study:

- Nearest-neighbour search.
- ETA prediction.
- Weighted assignment.
- Bipartite matching.
- Vehicle routing problem.
- Delivery batching.

Goal: Understand how a platform chooses the best delivery partner rather than simply choosing the closest one.

### 3. Dynamic Pricing and Promotion Optimization

Study:

- Customer segmentation.
- Price elasticity.
- Incremental contribution.
- Constrained optimization.
- Multi-armed bandits.

Goal: Understand how a platform determines which promotion to show, to whom, when and at what cost.

---

## 16. Official Engineering References

Recommended reading order:

1. The Accurate ETA to Customer Satisfaction - Part 1
   - https://www.zomato.com/blog/the-accurate-eta-to-customer-satisfaction-part-1

2. The Accurate ETA to Customer Satisfaction - Part 2
   - https://www.zomato.com/blog/the-accurate-eta-to-customer-satisfaction-part-2

3. A Tale of Scale: Behind the Scenes at Zomato Tech
   - https://www.zomato.com/blog/a-tale-of-scale-behind-the-scenes-at-zomato-tech

4. Eternal Company Overview
   - https://www.eternal.com/

---

## Final Architectural Observation

Zomato is not fundamentally a food-ordering application.

It is a real-time marketplace optimization system.

Its success depends on coordinating:

1. Customer demand.
2. Restaurant capacity.
3. Delivery partner supply.
4. Geography.
5. Pricing.
6. Time.
7. Operational reliability.

The most important architectural lesson is that these components cannot be optimized independently.

For example:

- A discount increases demand.
- Increased demand affects kitchen capacity.
- Kitchen delays affect preparation time.
- Preparation time affects delivery partner scheduling.
- Delivery partner shortages affect ETA.
- Poor ETA affects customer satisfaction.

This is why Zomato's architecture is much more interesting than a conventional e-commerce CRUD application.

The real engineering challenge is coordinating multiple independently changing systems while maintaining a reliable customer experience.