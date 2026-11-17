# Uber System Architecture – Complete Production-Level Explanation

**Architecture:** Distributed, Event-Driven, Geospatial, ML-Driven  
**Domain:** Real-Time Ride-Hailing Marketplace

## 1. Introduction

Uber is not simply a ride-booking application. It is a real-time, location-aware, event-driven marketplace that continuously balances three things:

1. Rider demand: Where are customers requesting rides, and where will new requests originate?
2. Driver supply: Where are available drivers, how many are there, and how quickly can they reach customers?
3. Marketplace economics: What price, incentive, or discount will balance supply and demand while maintaining profitability?

Uber attempts to predict where customers will request rides, position drivers accordingly, and adjust pricing and incentives before demand arrives.

Its architecture revolves around:

- Real-time location tracking.
- Geospatial indexing.
- Demand and supply forecasting.
- Driver-rider matching.
- ETA prediction.
- Dynamic pricing.
- Personalized promotions.
- Event-driven data processing.

**Note:** Uber's complete production implementation is proprietary. This document explains publicly documented technologies and representative production architecture patterns.

---

# 2. High-Level Uber Architecture

| System | Responsibility |
|---|---|
| Rider Service | Manages customer accounts and ride requests |
| Driver Service | Manages driver accounts and availability |
| Location Service | Receives and processes GPS coordinates |
| Geospatial Service | Identifies nearby drivers and demand regions |
| Dispatch Service | Matches drivers with riders |
| Pricing Service | Calculates fares and dynamic pricing |
| Promotion Service | Determines customer-specific promotional eligibility |
| ETA Service | Estimates pickup and trip duration |
| Demand Forecasting | Predicts future ride demand |
| Supply Forecasting | Predicts future driver availability |
| Payment Service | Processes customer payments |
| Notification Service | Sends ride updates |
| Trip Service | Manages the complete ride lifecycle |
| Analytics Platform | Analyses marketplace behaviour |

These are logical service boundaries, not necessarily Uber's exact internal microservice structure.

---

# 3. Technology Stack and Why It Is Used

| Layer | Technology | Purpose |
|---|---|---|
| Mobile applications | Swift / Kotlin and other platform technologies | Rider and driver applications |
| API communication | REST / gRPC | Client and internal service communication |
| Backend | Java, Go and other languages | Business logic and distributed services |
| Event streaming | Apache Kafka | Processes continuous marketplace events |
| Stream processing | Apache Flink / Spark Streaming | Real-time aggregation |
| Relational databases | MySQL / PostgreSQL | Transactional data |
| Distributed storage | Cassandra and other distributed stores | Large-scale distributed data |
| Caching | Redis | Fast access to frequently changing information |
| Geospatial indexing | Uber H3 | Geographic partitioning |
| Machine learning | Michelangelo platform | ML model development and deployment |
| Data processing | Apache Spark | Historical analytics and model training |
| Observability | Metrics, logging and tracing | Production monitoring |

## 3.1 Why Different Technologies?

Different workloads have different requirements.

- Payment transactions require transactional correctness.
- GPS updates require high-throughput ingestion.
- Driver searches require efficient geospatial queries.
- Demand forecasting requires historical and real-time data.
- Driver matching requires fast prediction and optimization.

Using one database for every workload would create unnecessary performance and scalability problems.

## 3.2 Technology Trade-offs

| Technology | Advantages | Disadvantages |
|---|---|---|
| Kafka | High throughput, event decoupling and replay | Operational complexity |
| Redis | Low-latency reads and writes | Memory costs and consistency challenges |
| PostgreSQL | ACID transactions and relational queries | Requires careful scaling |
| Cassandra | Distributed storage and availability | Complex data modelling |
| H3 | Hierarchical geographic indexing | Cell boundaries approximate proximity |
| Flink | Stateful real-time processing | Complex deployment and state management |
| Machine Learning | Learns complex patterns | Requires monitoring and retraining |

---

# 4. Location Tracking Architecture

Uber needs to continuously understand:

- Where drivers are located.
- Which drivers are online.
- Which drivers are available.
- Which drivers are completing trips.
- Which drivers are moving towards pickups.
- How many available drivers are in a particular area.

## 4.1 GPS Data Collection

The driver's mobile application periodically sends location information to the backend.

Example:

```json
{
  "driverId": "D101",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "speed": 25,
  "heading": 120,
  "timestamp": "2026-11-17T10:10:00Z",
  "availability": "AVAILABLE"
}
```

The location service receives this information and updates the driver's latest known position.

## 4.2 Location Ingestion Flow

```text
Driver Mobile Application
          |
          v
     GPS Collection
          |
          v
       Location API
          |
          v
 Authentication and Validation
          |
          v
      Apache Kafka
          |
          v
   Location Processor
          |
          v
  Real-Time Location Store
          |
          v
     Geospatial Index
          |
          v
 Driver Availability Search
```

Kafka decouples location ingestion from downstream consumers.

Different systems can independently process location updates:

- Location aggregation.
- Driver availability calculation.
- Demand and supply analytics.
- Driver movement analysis.
- Fraud and anomaly detection.

## 4.3 Why Not Save Every GPS Update Directly to PostgreSQL?

Millions of drivers sending frequent GPS updates can create substantial database write pressure.

Instead, a dedicated location ingestion and processing pipeline handles frequent updates.

The latest driver position can be maintained in a low-latency location store, while appropriate historical information is persisted separately.

The relational database remains useful for transactional data such as trips, driver accounts and payments.

---

# 5. Geospatial Indexing Using H3

Uber developed H3, a hierarchical hexagonal geospatial indexing system.

The problem:

Imagine a city containing 100,000 active drivers.

A rider requests a ride.

Searching every driver in the entire city would be inefficient.

Uber needs to identify nearby drivers without scanning the entire driver population.

## 5.1 How H3 Works

H3 divides geographic areas into hexagonal cells.

Each latitude and longitude coordinate can be converted into an H3 cell identifier.

```text
Latitude: 18.5204
Longitude: 73.8567

          |
          v

      H3 Index

          |
          v

     Geographic Cell
```

Every driver can be associated with an H3 cell based on their latest location.

Every pickup request can also be associated with an H3 cell.

The system can search:

1. The same H3 cell.
2. Adjacent cells.
3. Larger neighbouring areas if necessary.

## 5.2 Why Hexagons?

- Six neighbouring cells.
- Relatively uniform distances between cell centres.
- Hierarchical geographic resolution.
- Efficient geographic aggregation.

H3 supports multiple resolutions.

| Resolution | Application |
|---|---|
| Coarse | City-level demand forecasting |
| Medium | Neighbourhood-level supply analysis |
| Fine | Local pickup and driver search |

## 5.3 How Does Uber Calculate Available Drivers?

Example:

| Driver | H3 Cell | Status |
|---|---|---|
| D101 | A101 | Available |
| D102 | A101 | Available |
| D103 | A101 | On trip |
| D104 | A102 | Available |
| D105 | A101 | Available |
| D106 | A102 | Offline |

Aggregation:

| Cell | Available | On Trip | Offline |
|---|---:|---:|---:|
| A101 | 3 | 1 | 0 |
| A102 | 1 | 0 | 1 |

Now the system knows:

```text
Cell A101 = 3 available drivers
Cell A102 = 1 available driver
```

A conceptual Redis representation:

```text
driver:location:D101
    -> latitude, longitude, H3 cell

cell:A101:available
    -> D101, D102, D105

cell:A101:available_count
    -> 3
```

Production systems must handle stale GPS updates, concurrent updates, duplicate events, driver state changes and expiration.

**Important:** A driver physically present in an area is not necessarily available for dispatch.

---

# 6. Demand Forecasting Architecture

Uber does not simply count current ride requests.

It attempts to predict where riders will request rides in the future.

This is called spatiotemporal demand forecasting.

## 6.1 Data Used for Demand Forecasting

| Feature | Example |
|---|---|
| Historical demand | Previous Friday's ride requests |
| Time | 6 PM |
| Day | Friday |
| Weather | Heavy rainfall |
| Traffic | Road congestion |
| Events | Concert at a stadium |
| Holidays | Festival or public holiday |
| Public transportation | Railway station arrivals |
| Rider activity | Searches and ride estimates |
| Historical conversion | Searches that become bookings |

These features help predict the number of ride requests in specific geographic areas and time intervals.

## 6.2 How Does Uber Know About a Concert?

There are multiple possible information sources.

### A. Historical Patterns

Uber can analyse previous events.

```text
Previous concerts:

Concert 1:
End time: 10 PM
Demand peak: 10:15 PM

Concert 2:
End time: 10 PM
Demand peak: 10:20 PM

Concert 3:
End time: 10 PM
Demand peak: 10:10 PM
```

The system learns that demand usually increases shortly after concerts finish.

### B. External Event Information

Potential sources include:

- Event organiser integrations.
- Stadium schedules.
- Ticketing platforms.
- Public event listings.
- City event calendars.
- Transport schedules.

These are possible data sources, not a claim that Uber uses every integration.

### C. Live Marketplace Activity

Uber can identify unusual activity through its own marketplace data:

- Increasing ride searches.
- Increasing fare estimates.
- More pickup requests.
- Changes in driver availability.
- Traffic changes around the venue.

### D. External Context

Weather, road closures, transport disruptions and other external signals can contribute to forecasting.

Uber does not necessarily need to know the name of the concert. It can identify unusual demand patterns from location and time-series data.

## 6.3 Demand Forecasting Model

A simplified model:

```text
Predicted Demand =
    Historical Demand
    + Current Marketplace Activity
    + Time and Day Features
    + Event Information
    + Weather
    + Traffic
```

Mathematical representation:

\[
D_{cell,t+h}=f(X,H,E,W,T)
\]

Where:

- D = predicted demand.
- X = current marketplace activity.
- H = historical demand.
- E = event information.
- W = weather.
- T = time-related features.
- h = prediction horizon.

Potential models:

- XGBoost.
- Time-series forecasting.
- Gradient-boosted trees.
- Deep learning models.

The appropriate model depends on data availability and forecasting requirements.

---

# 7. Supply Forecasting and Driver Repositioning

Predicting rider demand alone is insufficient.

Uber must also predict how many drivers will be available in each geographic area.

Example:

| Location | Predicted Demand | Available Drivers |
|---|---:|---:|
| Stadium | 1,200/hour | 100 |
| Railway Station | 300/hour | 150 |
| Shopping Mall | 200/hour | 120 |
| Business District | 250/hour | 200 |

The stadium has the greatest potential supply shortage.

The system can encourage drivers to move towards the stadium.

This is called driver repositioning.

The driver application may display demand heatmaps or earnings opportunities.

Drivers decide whether to move.

The system must also consider:

- Drivers already heading towards the area.
- Expected trip completions.
- Driver travel time.
- Nearby demand.
- Driver preferences.
- Road congestion.

The objective is to position supply before the demand peak occurs.

---

# 8. Driver-Rider Matching and Dispatch

When a customer requests a ride, the dispatch system must find a suitable driver.

The nearest driver is not necessarily the best driver.

## 8.1 Candidate Selection

```text
Rider Requests Ride
        |
        v
  Identify Pickup H3 Cell
        |
        v
 Find Drivers in Nearby Cells
        |
        v
 Filter Unavailable Drivers
        |
        v
 Calculate Pickup ETAs
        |
        v
 Evaluate Driver Candidates
        |
        v
 Select Suitable Driver
        |
        v
 Send Ride Offer
        |
        v
 Driver Accepts?
     /       \
   Yes        No
    |          |
 Assign     Try Another
 Driver     Candidate
```

## 8.2 Factors Used for Driver Matching

- Pickup ETA.
- Distance.
- Traffic conditions.
- Driver direction.
- Vehicle category.
- Driver eligibility.
- Driver acceptance probability.
- Existing commitments.
- Rider experience.
- Marketplace efficiency.

Simplified scoring function:

\[
Score(d,r)=w_1 ETA+w_2 Distance+w_3 Traffic+w_4 RejectionRisk
\]

The actual scoring function is more complex and proprietary.

## 8.3 Why ETA Instead of Straight-Line Distance?

| Factor | Driver A | Driver B |
|---|---:|---:|
| Straight-line distance | 1 km | 2 km |
| Estimated pickup time | 12 min | 5 min |
| Traffic | Heavy | Low |
| Direction | Moving away | Moving towards |

Driver B is a better candidate despite being geographically farther away.

This is why road-network routing and ETA prediction are important.

## 8.4 Sequential vs Batch Dispatch

### Sequential Dispatch

```text
Offer to Driver A
       |
       v
Wait for Response
       |
       v
Accepted?
   /      \
 Yes       No
  |         |
Assign    Offer B
```

Advantages:

- Simple coordination.
- Easier assignment control.

Disadvantages:

- Sequential waiting increases latency.
- Rejected offers delay assignment.

### Batch Dispatch

```text
Find Eligible Drivers
        |
        v
Calculate Candidate Scores
        |
        v
Select Candidate Group
        |
        v
Coordinate Offers
        |
        v
Process Acceptance
        |
        v
Confirm Assignment
```

Advantages:

- Can optimize multiple requests together.
- Can improve marketplace-wide matching.

Disadvantages:

- More complex coordination.
- Requires concurrency management.
- Multiple riders must not receive conflicting assignments.

## 8.5 Preventing Double Driver Assignment

Two riders must not receive the same driver.

Simplified SQL:

```sql
UPDATE driver
SET status = 'ASSIGNED'
WHERE driver_id = 'D101'
AND status = 'AVAILABLE';
```

If zero rows are updated, the driver is no longer available.

Production systems also need offer expiry, retries, idempotency and concurrency control.

---

# 9. ETA Prediction

ETA means Estimated Time of Arrival.

Uber needs to calculate:

1. Driver-to-rider pickup time.
2. Rider-to-destination travel time.

A simple distance calculation is insufficient because roads and traffic influence travel time.

## 9.1 ETA Calculation

Potential inputs:

- Road network.
- Traffic conditions.
- Road speed limits.
- Historical travel time.
- Time of day.
- Weather.
- Pickup and destination coordinates.
- Road closures.
- Driver movement.

Simplified model:

```text
Base ETA = Routing Engine

Predicted ETA =
    Base ETA
    + Traffic Adjustment
    + Historical Error Correction
```

ETA influences:

- Driver selection.
- Rider experience.
- Ride pricing.
- Pickup planning.
- Dispatch efficiency.

---

# 10. Dynamic Pricing and Surge Pricing

Surge pricing is used when rider demand exceeds available driver supply in a particular area.

Example:

```text
Stadium Area:

Ride requests: 500/hour
Available drivers: 50

Business District:

Ride requests: 100/hour
Available drivers: 120
```

The stadium has a higher demand-to-supply imbalance.

Uber can adjust prices and incentives to encourage the marketplace to rebalance.

## 10.1 Supply-Demand Ratio

Simplified calculation:

\[
R=\frac{AvailableDrivers}{ExpectedRideRequests}
\]

| Area | Drivers | Demand/hour | Ratio |
|---|---:|---:|---:|
| Stadium | 50 | 500 | 0.10 |
| Station | 100 | 200 | 0.50 |
| Mall | 120 | 100 | 1.20 |

A lower ratio indicates a potential supply shortage.

However, this ratio alone cannot determine production pricing.

The system must also consider:

- Driver arrival time.
- Expected trip completion.
- Forecasted demand.
- Driver acceptance probability.
- Rider cancellation probability.
- Product type.
- Local pricing regulations.

## 10.2 Why Increase Prices?

For riders:

- Some customers may choose to wait.
- Some may choose another transportation option.
- Some may still book despite higher prices.

For drivers:

- Higher earning opportunities may encourage drivers to serve the area.
- Drivers may reposition from lower-demand areas.

The objective is to reduce the imbalance.

## 10.3 Why Not Apply Surge to the Entire City?

Demand is geographically distributed.

A concert may create high demand around a stadium while the rest of the city has sufficient driver availability.

City-wide surge pricing would unnecessarily affect customers in balanced areas.

This is why hyper-local pricing is important.

---

# 11. Customer-Specific Promotions and Discounts

Dynamic pricing and personalized promotions are different concepts.

## 11.1 Dynamic Pricing

Pricing is influenced by trip and marketplace conditions.

Examples:

- Pickup location.
- Destination.
- Estimated distance.
- Estimated duration.
- Traffic.
- Driver availability.
- Demand and supply imbalance.

## 11.2 Personalized Promotions

Promotions are incentives offered to eligible customers based on campaign rules and relevant customer behaviour.

Example:

Customer A:

- Uses Uber frequently.
- Has recently completed multiple trips.
- Does not currently need a reactivation incentive.

Customer B:

- Has not used Uber recently.
- Has a history of using the service.
- May be encouraged to return through a promotional offer.

Customer B may receive a discount while Customer A does not.

## 11.3 Promotion Engine Architecture

```text
Customer Opens Uber
        |
        v
  Promotion Service
        |
        v
 Retrieve Customer Features
        |
        v
 Evaluate Campaign Rules
        |
        v
 Check Promotion Eligibility
        |
        v
 Evaluate Business Constraints
        |
        v
 Select Eligible Promotion
        |
        v
 Display Offer
```

Potential customer features:

- Trip history.
- Recent activity.
- Account age.
- Previous promotion usage.
- Booking frequency.
- Campaign engagement.

Business constraints:

- Campaign budget.
- Promotion expiry.
- Geographic eligibility.
- Minimum fare.
- Maximum discount.
- Fraud prevention.

## 11.4 Uplift Modelling

A useful ML concept is uplift modelling.

A normal prediction model might calculate:

```text
Probability of booking = 40%
```

But this does not tell us whether a discount will change the customer's behaviour.

An uplift model compares two scenarios.

Example:

Without discount:

```text
Booking probability = 20%
```

With discount:

```text
Booking probability = 45%
```

Estimated uplift:

```text
25 percentage points
```

Another customer:

Without discount:

```text
Booking probability = 90%
```

With discount:

```text
Booking probability = 92%
```

Estimated uplift:

```text
2 percentage points
```

The first customer may be a better promotion candidate.

The business must also consider discount cost, incremental revenue, contribution margin, campaign budget and fraud risk.

The objective is to identify where an incentive produces sufficient incremental business value.

---

# 12. Complete Concert Scenario

Imagine a concert is scheduled at a stadium in Pune.

Assumptions:

- Concert starts at 7 PM.
- Concert ends at 10 PM.
- Expected attendance: 40,000 people.
- Uber has historical data from previous events.
- The stadium is surrounded by multiple H3 cells.

## Phase 1: Before the Concert

At 5 PM, the demand forecasting service identifies the upcoming event.

Example:

```text
Event Location: Stadium
Event Ending: 10 PM
Expected Attendance: 40,000

Historical Demand:

10:00 PM - 400 requests/hour
10:15 PM - 800 requests/hour
10:30 PM - 1,100 requests/hour
10:45 PM - 900 requests/hour
```

The model predicts demand for each H3 cell.

The supply forecasting service estimates driver availability.

The marketplace identifies geographic areas where supply will be insufficient.

Uber can encourage drivers to move towards the stadium through driver incentives and demand notifications.

## Phase 2: During the Concert

At 9:30 PM:

```text
Stadium Area:

Available Drivers: 60
Predicted Demand: 1,000/hour
Current Requests: 200/hour
```

The location service continuously updates driver positions.

The streaming infrastructure updates available driver counts.

The forecasting service revises its predictions as new information arrives.

## Phase 3: Concert Ends

At 10 PM:

```text
Available Drivers: 55
Incoming Requests: 700/hour
Predicted Requests: 1,200/hour
```

Multiple systems work together:

1. Geospatial service identifies nearby drivers.
2. Dispatch service matches riders with drivers.
3. ETA service calculates pickup times.
4. Pricing service evaluates supply-demand imbalance.
5. Driver incentives encourage additional supply.
6. Promotion service independently evaluates customer promotion eligibility.

## Phase 4: Marketplace Recovery

At 10:30 PM:

```text
Available Drivers: 180
Requests: 700/hour
```

More drivers have arrived.

Demand starts falling.

Surge pricing can decrease as the marketplace becomes balanced.

Drivers may then be encouraged to serve other nearby areas.

This is a continuously operating feedback loop.

---

# 13. Complete Logical Architecture

```text
                  RIDER APPLICATION
                         |
                  DRIVER APPLICATION
                         |
                         v
                    API GATEWAY
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
        Rider          Driver          Auth
        Service        Service         Service
          |              |
          |              v
          |         Location API
          |              |
          |              v
          |         Kafka Events
          |              |
          |              v
          |       Location Processor
          |              |
          |              v
          |       Geospatial Index
          |              |
          |              v
          |       Driver Availability
          |              |
          +--------------+
                         |
                         v
                    Trip Service
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
       Dispatch        Pricing         ETA
       Service         Service       Service
          |              |              |
          v              v              v
       Driver          Surge          Routing
       Matching       Calculation      Engine
          |
          v
       Assignment
          |
          v
     Notification
        Service
          |
          v
     Rider and Driver
       Applications


           ANALYTICS AND ML PIPELINE
                         |
                         v
                    Kafka Events
                         |
                         v
                Stream Processing
                         |
                         v
                    Data Lake
                         |
                         v
               Historical Analytics
                         |
                         v
                ML Model Training
                         |
                         v
                Model Deployment
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
       Demand          Supply         ETA and
      Forecasting     Forecasting     Matching
          |              |              |
          +--------------+--------------+
                         |
                         v
                Marketplace Decisions
```

This is a logical view. Actual service interactions are bidirectional and may use synchronous RPCs, asynchronous events or shared platform capabilities.

---

# 14. Production-Level Engineering Challenges

## 14.1 Stale Driver Locations

Problem:

A driver loses internet connectivity.

The last known location is no longer reliable.

Solution:

- Timestamp every location update.
- Expire stale availability.
- Track heartbeat intervals.
- Avoid dispatching drivers with outdated positions.

## 14.2 Duplicate GPS Events

Problem:

Kafka consumers may process duplicate messages.

Solution:

- Idempotent event processing.
- Driver ID and event timestamp.
- Deduplication where necessary.
- Prevent older updates from overwriting newer locations.

## 14.3 Double Driver Assignment

Problem:

Two riders attempt to receive the same driver.

Solution:

- Atomic state transitions.
- Optimistic concurrency.
- Assignment expiry.
- Retry mechanisms.

## 14.4 GPS Inaccuracy

Problem:

GPS can place a driver on the wrong road or nearby building.

Solution:

- Map matching.
- GPS accuracy measurements.
- Road-network-aware ETA calculations.

## 14.5 Demand Forecasting Failure

Problem:

A concert is cancelled or ends earlier than expected.

Solution:

- Combine event schedules with live signals.
- Continuously update forecasts.
- Track prediction confidence.
- Use fallback forecasting models.

## 14.6 ML Model Drift

Problem:

Traffic patterns and customer behaviour change.

Solution:

- Monitor prediction errors.
- Retrain models.
- Run offline evaluations.
- Conduct controlled experiments.
- Maintain fallback models.

## 14.7 Regional Service Failures

Problem:

A location-processing cluster becomes unavailable.

Solution:

- Geographic partitioning.
- Replication.
- Circuit breakers.
- Regional failure isolation.
- Fallback dispatch strategies.

---

# 15. Architecture I Would Choose to Build an Uber-Like Platform

I would not immediately reproduce Uber's enormous infrastructure.

I would start with an architecture that can scale incrementally.

| Component | Technology |
|---|---|
| Rider Application | React Native |
| Driver Application | React Native |
| Backend | Node.js + TypeScript |
| API | REST |
| Internal Communication | gRPC where beneficial |
| Database | PostgreSQL + PostGIS |
| Cache | Redis |
| Geospatial Indexing | H3 |
| Event Streaming | Kafka |
| Stream Processing | Kafka consumers initially; Flink when justified |
| Machine Learning | Python + XGBoost |
| Routing | Google Maps / Mapbox / self-hosted routing |
| Cloud Infrastructure | AWS |
| Observability | OpenTelemetry + Prometheus + Grafana |

## Why This Stack?

### Node.js + TypeScript

Suitable for API services, asynchronous I/O and marketplace orchestration.

### PostgreSQL + PostGIS

Provides transactional consistency and geospatial querying.

### Redis

Provides low-latency access to frequently changing driver information.

### H3

Provides geographic partitioning and efficient aggregation.

### Kafka

Decouples high-volume location ingestion from downstream services.

### Python + XGBoost

Provides practical tools for demand forecasting and prediction.

### AWS

Provides managed infrastructure, networking, storage, deployment and monitoring capabilities.

## Architecture Strategy

I would initially use a modular monolith for core transactional operations.

I would separately isolate high-throughput location ingestion and processing when scaling requirements justify it.

I would introduce additional microservices only when independent deployment, ownership, scaling or fault isolation provides a measurable benefit.

Do not start with 30 microservices.

Build around independently scaling workloads, not around the number of features.

---

# 16. Important Architectural Concepts to Master

| Priority | Concept | Why It Matters |
|---|---|---|
| 1 | Geospatial Indexing | Understand geographic queries |
| 2 | Event-Driven Architecture | Understand real-time data processing |
| 3 | Distributed State Management | Understand live driver availability |
| 4 | Spatiotemporal Forecasting | Understand future demand |
| 5 | Matching Optimization | Understand driver assignment |
| 6 | Dynamic Pricing | Understand marketplace economics |
| 7 | Uplift Modelling | Understand customer-specific promotions |
| 8 | Distributed Systems Reliability | Understand production failures |
| 9 | ETA Prediction | Understand routing and traffic |
| 10 | Observability | Understand production monitoring |

---

# 17. Official Uber Engineering References

1. H3 Geospatial Indexing:
   https://www.uber.com/blog/h3/

2. Scaling Machine Learning at Uber:
   https://www.uber.com/in/en/blog/scaling-michelangelo/

3. Engineering More Reliable Transportation with Machine Learning and AI:
   https://www.uber.com/rs/en/blog/machine-learning/

4. Michelangelo ML Platform:
   https://www.uber.com/us/en/blog/from-predictive-to-generative-ai/

5. Uber Fulfillment Platform Re-architecture:
   https://www.uber.com/us/en/blog/fulfillment-platform-rearchitecture/

6. Reinforcement Learning for Modeling Marketplace Balance:
   https://www.uber.com/us/en/blog/reinforcement-learning-for-modeling-marketplace-balance/

---

# 18. Final Architectural Takeaway

Uber should not be understood as a collection of CRUD APIs or independent microservices.

It is a real-time distributed marketplace that solves three interconnected optimization problems:

## 1. Demand Forecasting

Predict where customers will request rides and when those requests will happen.

## 2. Supply Allocation

Identify available drivers and position them where they are most likely to be needed.

## 3. Marketplace Optimization

Balance supply and demand through driver matching, dynamic pricing and incentives.

Everything else supports these three fundamental capabilities.

Once these concepts are understood, the technology choices become much easier to justify from a software architecture perspective.