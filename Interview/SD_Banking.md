# Complete Banking System Architecture – HLD, LLD, Technologies, Workflows and Production Design

# 1. Introduction to Banking System Architecture

A modern banking system is a combination of distributed systems, financial transaction processing, security infrastructure, data platforms, and real-time payment networks.

Unlike applications such as Instagram or Uber, banking systems prioritize:

1. Financial correctness.
2. Strong consistency.
3. Security.
4. Auditability.
5. Regulatory compliance.
6. Availability and reliability.
7. Performance and scalability.

A banking application must support:

- Customer registration and KYC verification.
- Savings and current account creation.
- Deposits and withdrawals.
- Money transfers between accounts.
- UPI, NEFT, RTGS, IMPS and card payments.
- Loan management and EMI processing.
- Interest calculations.
- Fraud detection.
- Transaction history and statements.
- Notifications and alerts.
- Regulatory reporting and auditing.

Consider a simple scenario:

Ritik has ₹50,000 in his savings account and wants to transfer ₹10,000 to another customer.

The banking system must:

1. Authenticate Ritik.
2. Verify his account.
3. Check the available balance.
4. Validate transaction limits.
5. Detect suspicious activity.
6. Debit ₹10,000 from his account.
7. Credit ₹10,000 to the recipient.
8. Record the transaction permanently.
9. Generate the appropriate business events.
10. Notify both customers.

The most important requirement is that money must never disappear or be duplicated because of a system failure.

---

# 2. High-Level Banking Architecture

A typical modern digital banking architecture looks like this:

```text
                  CLIENT APPLICATIONS
              +-----------+-----------+
              |           |           |
           Mobile       Web App    ATM / Branch
           Banking                 Terminals
              |           |           |
              +-----------+-----------+
                          |
                          v
                  API GATEWAY / WAF
                          |
                          v
                   LOAD BALANCER
                          |
                          v
                IDENTITY & AUTH SERVICE
                          |
                          v
                     API / BFF
                          |
        +-----------------+------------------+
        |                 |                  |
        v                 v                  v
   ACCOUNT SERVICE   PAYMENT SERVICE   CUSTOMER SERVICE
        |                 |                  |
        |                 v                  |
        |            FRAUD SERVICE            |
        |                 |                  |
        +-----------------+------------------+
                          |
                          v
                  CORE BANKING SYSTEM
                          |
                          v
                   TRANSACTION ENGINE
                          |
                          v
                     LEDGER SYSTEM
                          |
             +------------+------------+
             |            |            |
             v            v            v
         PostgreSQL     Redis        Kafka
         / Oracle       Cache      Event Bus
             |            |            |
             +------------+------------+
                          |
                          v
                 ANALYTICS / DATA LAKE
                          |
                          v
              REPORTING / RECONCILIATION
```

This is a conceptual architecture. Not every bank uses the same technologies or service boundaries.

---

# 3. Client Applications

## Responsibility

Provides the interface through which customers interact with banking services.

Examples:

- Check account balance.
- Transfer money.
- Download statements.
- Manage beneficiaries.
- Manage debit cards.
- Apply for loans.
- Manage account information.

## Technologies

| Technology | Purpose |
|---|---|
| React | Web banking application |
| Angular | Enterprise web banking |
| Kotlin | Native Android banking |
| Swift | Native iOS banking |
| Flutter | Cross-platform mobile applications |
| React Native | Cross-platform mobile applications |

## Why React or Angular?

Banking applications have complex interfaces involving:

- Forms.
- Authentication workflows.
- Financial dashboards.
- Validation.
- Permissions.
- Reusable components.
- API integration.

Frameworks make these applications easier to maintain.

## Why not plain JavaScript?

Plain JavaScript works, but large applications become difficult to organize as the number of components, workflows and developers increases.

## Trade-offs

| Technology | Advantages | Disadvantages |
|---|---|---|
| React | Flexible, large ecosystem | Requires architectural decisions |
| Angular | Structured, batteries included | More complexity |
| Flutter | Cross-platform development | Platform-specific integration trade-offs |
| Native Kotlin/Swift | Native performance | Separate development teams |

---

# 4. API Gateway

The API Gateway is the entry point for backend requests.

Suppose a customer requests:

```http
GET /api/accounts/12345/balance
Authorization: Bearer JWT_TOKEN
```

The API Gateway performs:

1. Receives the request.
2. Validates the token or coordinates authentication checks.
3. Applies rate limiting.
4. Checks request size and security policies.
5. Routes the request to the Account Service.
6. Returns the response.

## Technologies

- Kong Gateway.
- NGINX.
- AWS API Gateway.
- Apigee.
- Envoy.

## Why use an API Gateway?

Imagine having 50 backend microservices.

Without a gateway, the frontend might need to know the address and authentication requirements of every service.

With an API Gateway:

```text
Frontend
   |
API Gateway
   |
   +-- Account Service
   +-- Payment Service
   +-- Loan Service
   +-- Customer Service
   +-- Card Service
```

The frontend communicates through a controlled entry point.

## Why not directly communicate with microservices?

Direct communication can create:

- Tight coupling.
- More exposed endpoints.
- Duplicated security logic.
- Difficult API versioning.
- More complicated client applications.

## Trade-offs

| Advantages | Disadvantages |
|---|---|
| Centralized security policies | Additional network hop |
| Rate limiting | Potential bottleneck |
| Routing | Operational complexity |
| API versioning | Gateway availability becomes critical |

Production gateways should be deployed redundantly to avoid a single point of failure.

---

# 5. Identity and Authentication Service

Banking applications require strong authentication.

Consider a customer logging into mobile banking.

The authentication service verifies:

- Username or customer identifier.
- Password or PIN.
- OTP.
- Device identity.
- Biometric authentication where applicable.
- Session validity.

## Technologies

- Keycloak.
- OAuth 2.0.
- OpenID Connect.
- Spring Security.
- Custom identity platforms.

## Important distinction

OAuth 2.0 is an authorization framework.

OpenID Connect adds an authentication layer on top of OAuth 2.0.

Banks may also use:

- Hardware-backed credentials.
- Device binding.
- Risk-based authentication.
- Multi-factor authentication.
- Session revocation.

## Why not use simple JWT authentication everywhere?

JWT is a token format, not a complete authentication or authorization system.

Banking applications need:

- Token lifecycle management.
- Session revocation.
- MFA.
- Device management.
- Role-based and attribute-based authorization.
- Fraud and risk-based authentication.

A stolen, still-valid token must not provide unlimited access to financial operations.

---

# 6. Core Banking System (CBS)

The Core Banking System is the central system responsible for maintaining the bank's financial operations.

It manages:

- Customer accounts.
- Account balances.
- Deposits.
- Withdrawals.
- Transfers.
- Loans.
- Interest calculations.
- Financial transactions.
- Account restrictions.

Think of it as the financial engine of the bank.

## Example

A customer visits a branch in Mumbai and deposits ₹20,000.

The transaction is recorded in the bank's core banking infrastructure.

The customer can then see the updated balance through a mobile application or another branch.

This is why banking is called core banking: customers can access their banking services across branches and channels.

## Why do banks use Java, COBOL and C/C++?

These are examples of technologies found in banking environments, not technologies universally used by every bank.

| Technology | Why banks use it | Disadvantages |
|---|---|---|
| Java | Enterprise systems and transaction processing | JVM resource consumption |
| COBOL | Legacy mainframe systems and established financial processing | Specialized talent and legacy complexity |
| C/C++ | Performance-sensitive systems | Memory safety and maintenance complexity |
| C#/.NET | Enterprise banking applications | Platform and ecosystem considerations |
| Go | Network services and infrastructure | Smaller legacy banking footprint |

## Why COBOL is still relevant

Many large banks have decades of financial processing logic running on mainframes.

Replacing this logic is risky because it contains:

- Financial calculations.
- Interest rules.
- Account processing.
- Historical business rules.
- Regulatory requirements.

A bank cannot simply replace its core banking platform because a newer programming language exists.

Migration requires extensive testing, reconciliation and controlled execution.

---

# 7. Transaction Processing and Double-Entry Accounting

This is arguably the most important concept in banking architecture.

Banks do not simply update a customer's balance using:

```javascript
account.balance -= 10000;
```

That approach is insufficient for a reliable financial system.

Instead, banks maintain a financial ledger.

## What is a ledger?

A ledger is a permanent record of financial movements.

Consider:

- Ritik has ₹50,000.
- Rahul has ₹20,000.
- Ritik transfers ₹10,000 to Rahul.

The transaction produces two accounting entries.

### Before Transaction

| Customer | Balance |
|---|---:|
| Ritik | ₹50,000 |
| Rahul | ₹20,000 |
| Total | ₹70,000 |

### After Transaction

| Customer | Balance |
|---|---:|
| Ritik | ₹40,000 |
| Rahul | ₹30,000 |
| Total | ₹70,000 |

### Ledger Entries

| Account | Debit | Credit |
|---|---:|---:|
| Ritik's account | ₹10,000 | — |
| Rahul's account | — | ₹10,000 |
| Total | ₹10,000 | ₹10,000 |

The accounting invariant is:

Total Debits = Total Credits.

The exact debit/credit interpretation depends on account type and accounting conventions. The important invariant is that the transaction balances.

## Why PostgreSQL or Oracle?

Banks need strong transactional guarantees.

Consider a transfer:

1. Debit Ritik.
2. Credit Rahul.

What happens if the application crashes after step one?

A database transaction ensures both changes commit together or neither does.

### Illustrative SQL

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 10000
WHERE account_id = 'RITIK'
AND balance >= 10000;

UPDATE accounts
SET balance = balance + 10000
WHERE account_id = 'RAHUL';

COMMIT;
```

This is illustrative SQL, not production-ready transfer logic.

Production code must:

- Verify affected row counts.
- Validate account ownership.
- Validate account status.
- Enforce transaction limits.
- Apply appropriate locking.
- Handle concurrent transactions.
- Record immutable ledger entries.

## ACID Properties

| Property | Meaning in banking |
|---|---|
| Atomicity | Both financial entries succeed or neither does |
| Consistency | Financial invariants remain valid |
| Isolation | Concurrent transactions do not corrupt results |
| Durability | Committed transactions survive failures |

## Why not MongoDB or Redis as the primary ledger?

They have different strengths and transaction models.

MongoDB supports transactions, but relational databases are often a natural fit for financial ledgers and accounting relationships.

Redis is excellent for caching and fast lookups, but should not be the authoritative financial ledger.

PostgreSQL and Oracle provide mature transactional guarantees, relational constraints and operational tooling.

For a new banking ledger, PostgreSQL is a strong option if its deployment, isolation, partitioning, backup and recovery strategy meets the bank's requirements.

---

# 8. Payment Processing Architecture

A bank generally does not process every payment through the same mechanism.

Different payment rails have different protocols, settlement models, participants and operational requirements.

## Common Indian Payment Methods

| Payment Method | Responsibility |
|---|---|
| UPI | Real-time account-to-account payments |
| IMPS | Immediate interbank payments |
| NEFT | Electronic funds transfer through settlement batches |
| RTGS | Real-time gross settlement |
| Debit/Credit Cards | Card-network-based payment processing |

These payment methods involve external infrastructure and participating banks.

## Example: UPI Payment

Suppose Ritik sends ₹5,000 to Rahul using UPI.

```text
        Ritik's UPI App
               |
               v
         PSP / UPI App
               |
               v
          NPCI UPI
               |
               v
        Remitter Bank
               |
          Validation
               |
        Debit Processing
               |
               v
          NPCI UPI
               |
               v
        Beneficiary Bank
               |
        Credit Processing
               |
               v
         Rahul's Account
               |
               v
         Confirmation
```

This is a simplified logical flow.

Actual routing, messaging, authentication and settlement involve additional participants and processes.

## Why is a Payment Switch Required?

A payment switch routes transactions between participating financial institutions.

It handles:

- Transaction routing.
- Message validation.
- Bank identification.
- Response handling.
- Timeouts.
- Duplicate requests.
- Transaction status.

## What happens if the recipient bank does not respond?

The transaction may enter a pending or uncertain state.

The system must not assume that a timeout means the transaction failed.

It must perform status checks and reconciliation before deciding what corrective action is required.

This is important because the sender may have been debited even though confirmation was not received.

---

# 9. Kafka and Event-Driven Architecture

Banks process enormous numbers of events.

For example, when a customer transfers money, multiple systems need to know about the transaction.

- Notification Service sends an SMS.
- Fraud Service evaluates transaction behavior.
- Analytics Service records transaction metrics.
- Statement Service updates transaction history.
- Reporting Service processes relevant financial events.

Should the Payment Service call all five services synchronously?

Usually, no.

This creates tight coupling and increases transaction latency.

Instead, an event-driven architecture can be used.

```text
             Payment Service
                    |
                    v
             Financial Database
                    |
                    v
               Kafka Event
                    |
          +---------+----------+
          |         |          |
          v         v          v
        Fraud   Notification Analytics
        Service   Service    Service
          |         |          |
          v         v          v
       Analysis    SMS       Reporting
```

## Technology: Apache Kafka

Why Kafka?

- High-throughput event streaming.
- Persistent event storage.
- Consumer groups.
- Replayable events.
- Horizontal scalability.
- Decoupled services.

## Why not simply use REST APIs?

REST is appropriate for synchronous request-response operations.

However, if every service must be called synchronously, a temporary failure in the notification system could affect the payment workflow unnecessarily.

Kafka allows independent consumers to process events asynchronously.

## Trade-offs

| Advantages | Disadvantages |
|---|---|
| Loose coupling | Operational complexity |
| High throughput | Eventual consistency |
| Replayability | Duplicate processing is possible |
| Independent scaling | Requires monitoring and partition management |

## Transactional Outbox Pattern

A financial transaction must not depend on an unreliable asynchronous event being published after the database commits.

A common solution is the Transactional Outbox Pattern.

The financial transaction and its corresponding outbox event are committed in the same database transaction.

A separate publisher delivers the event to Kafka.

Consumers should be idempotent because messages may be delivered more than once.

---

# 10. Database Architecture

Banks do not necessarily use one database for everything.

Different data types have different consistency and performance requirements.

| Database | Responsibility | Why |
|---|---|---|
| Oracle | Core banking and financial records | Mature enterprise transaction processing |
| PostgreSQL | Accounts, transactions, ledgers | ACID and relational integrity |
| Redis | Caching, rate limits, temporary state | Low-latency access |
| Cassandra | High-volume distributed workloads | Horizontal scalability |
| Elasticsearch/OpenSearch | Search and log analysis | Full-text search and indexing |
| Data Lake | Historical and analytical data | Large-scale analytics |

## Source of Truth vs Read-Optimized Data

The source of truth and the read-optimized data store should not be confused.

For example:

When a customer checks their balance, a bank may use a read-optimized service.

However, the balance shown must have an appropriate freshness guarantee.

A cached balance must never be used as the authority for approving a withdrawal.

---

# 11. Fraud Detection and Risk Management

Banks must identify suspicious transactions.

Consider the following situation:

A customer normally makes transactions between ₹100 and ₹5,000.

Suddenly:

- A ₹2 lakh transaction occurs.
- The transaction comes from a new device.
- The IP address is from a different country.
- Multiple failed login attempts occurred.
- The beneficiary was recently added.

The bank may calculate a risk score.

### Illustrative Risk Scoring

| Signal | Risk Contribution |
|---|---:|
| Unusual transaction amount | 25 |
| New device | 15 |
| Unusual location | 20 |
| New beneficiary | 15 |
| Suspicious behavioral pattern | 25 |
| Total | 100 |

### Illustrative Decision Rules

```text
Risk Score: 0-30
    -> Allow transaction

Risk Score: 31-60
    -> Additional authentication

Risk Score: 61-80
    -> Manual review or additional controls

Risk Score: 81-100
    -> Block or hold according to policy
```

Actual bank risk engines use more sophisticated rules, models, thresholds and regulatory requirements.

## Technologies

- Python.
- Scikit-learn.
- XGBoost.
- TensorFlow.
- PyTorch.
- Apache Flink.
- Kafka Streams.

## Why Machine Learning?

Rule-based systems are useful for known fraud patterns.

Machine learning can help detect more complex behavioral patterns.

However, machine learning is not automatically better.

| Rule-Based | Machine Learning |
|---|---|
| Easy to understand | Can identify complex patterns |
| Predictable | Requires model monitoring |
| Easier to audit | Explainability can be difficult |
| Limited adaptability | Can adapt through retraining |

Banks often use both.

---

# 12. Infrastructure and Deployment Architecture

Banking infrastructure needs high availability and disaster recovery.

A bank cannot afford to have its entire digital banking system unavailable because one server or data center fails.

## Example Architecture

```text
                 CUSTOMERS
                     |
                LOAD BALANCER
                     |
             +-------+-------+
             |               |
          REGION A        REGION B
             |               |
        Application      Application
          Cluster          Cluster
             |               |
        Database          Database
          Primary       Replica / DR
             |               |
             +-------+-------+
                     |
              BACKUP SYSTEM
```

## Technologies

| Technology | Responsibility |
|---|---|
| Kubernetes | Container orchestration |
| Docker | Application packaging |
| AWS/Azure | Cloud infrastructure |
| Terraform | Infrastructure as Code |
| Prometheus | Metrics collection |
| Grafana | Monitoring dashboards |
| ELK/OpenSearch | Centralized logging |
| Vault/HSM | Secret and cryptographic key management |

## Why Kubernetes?

It helps with:

- Container orchestration.
- Automatic workload recovery.
- Horizontal scaling.
- Deployment management.
- Service discovery.

## Why not deploy everything on a single EC2 instance?

Because banking applications require resilience, scalability, controlled deployment and fault isolation.

However, Kubernetes is not mandatory for every banking workload.

Mainframe systems, virtual machines, managed platforms and bare-metal environments remain relevant.

Kubernetes also does not automatically solve database high availability or cross-region consistency.

---

# 13. How Does a Bank Handle Millions of Customers?

Suppose a bank has:

- 50 million registered customers.
- 5 million daily active customers.
- 500,000 concurrent users during peak periods.
- Millions of transactions per day.

These numbers are illustrative.

The bank cannot handle this load by simply increasing the capacity of one server.

It uses several techniques.

## A. Horizontal Scaling

Instead of one payment service:

```text
Payment Service
```

Deploy multiple instances:

```text
Load Balancer
      |
  +---+---+
  |   |   |
 P1  P2  P3
  |   |   |
  +---+---+
      |
   Database
```

## B. Database Partitioning

Financial records can be partitioned based on suitable keys and access patterns.

For example:

- Customer ID.
- Account ID.
- Transaction date.
- Geographic or regulatory boundaries.

The partitioning strategy must preserve transaction correctness.

## C. Caching

Frequently accessed information can be cached.

Examples:

- Product information.
- Branch details.
- Customer preferences.
- Non-authoritative account display data.

## D. Asynchronous Processing

Non-critical tasks can happen independently.

Examples:

- Notifications.
- Analytics.
- Statement generation.
- Some reporting workloads.

## E. Geographic Distribution

Banks may distribute services and infrastructure across regions to reduce latency and improve availability.

However, financial writes need carefully designed consistency and failover rules.

---

# 14. How Does Banking Architecture Handle Failures?

Consider five scenarios.

| Failure | Required Behavior |
|---|---|
| Customer clicks Pay twice | Prevent duplicate financial execution |
| Payment service crashes | Recover transaction state |
| Database crashes | Recover committed transactions |
| Recipient bank times out | Reconcile transaction status |
| Kafka becomes unavailable | Preserve committed events in outbox for later delivery |

## 14.1 Idempotency

Suppose Ritik clicks Pay twice because the application freezes.

Without protection, the system might process two payments.

The application sends:

```http
POST /api/payments
Idempotency-Key: payment-123456
```

The backend stores the key with the transaction result.

If the same request arrives again, the backend returns the existing result rather than executing another transfer.

The key must be associated with the authenticated customer and appropriate request parameters.

## 14.2 Reconciliation

Suppose:

- Ritik's bank debits ₹10,000.
- The receiving bank does not return confirmation.
- The payment remains pending.

The bank cannot simply assume that the money has disappeared.

It must reconcile internal transaction records with external payment-network records and determine whether to confirm, reverse or continue processing.

This is a critical banking operation.

---

# 15. Security Architecture

Security is not one microservice. It is a cross-cutting architectural requirement.

| Component | Responsibility |
|---|---|
| WAF | Web attack protection |
| IAM | Identity and access management |
| MFA | Strong authentication |
| HSM | Cryptographic key protection |
| TLS | Encryption in transit |
| Encryption at rest | Protect stored information |
| RBAC/ABAC | Authorization |
| SIEM | Security monitoring |
| Audit logs | Traceability |
| Fraud engine | Financial risk detection |

## Important Security Principles

1. Never store passwords in plaintext.
2. Never log OTPs, PINs or sensitive credentials.
3. Apply least-privilege access.
4. Encrypt sensitive information.
5. Use hardware-backed key management where required.
6. Separate operational permissions from financial approval permissions.
7. Maintain tamper-resistant audit trails.
8. Implement transaction limits and velocity checks.

For Indian banks, regulatory requirements from RBI and applicable payment-system requirements must also influence architecture.

---

# 16. Customer, Account, Mobile Number and Device Relationships

This is an important architectural concept.

A customer, bank account, mobile number and device are separate entities.

## Can a Customer Have the Same Savings Account on Different Mobile Numbers?

Yes, depending on the bank's policies and account configuration.

However, a bank account is not duplicated for every mobile number.

There are three common scenarios.

### Scenario A: Single Account, Single Registered Mobile Number

```text
Customer: Ritik
     |
Customer ID: CIF-1001
     |
Savings Account: ACC-1001
     |
Registered Mobile: 9876543210
```

Transaction alerts go to the registered number and other configured channels.

### Scenario B: Joint Account, Multiple Account Holders

```text
       Joint Savings Account
                |
         +------+------+
         |             |
       Ritik         Rahul
         |             |
      Mobile A      Mobile B
```

Both customers may have separate customer identities and mobile numbers.

Whether both receive transaction alerts depends on the bank's account mandate, customer-level registration and notification policies.

### Scenario C: Same Customer with Multiple Registered Devices

```text
         Customer: Ritik
                |
         Savings Account
                |
         Mobile Banking
                |
          +-----+-----+
          |           |
       Device A    Device B
       iPhone       Android
```

A bank may allow multiple registered devices, subject to its security policy.

The devices do not create separate bank accounts or independent balances.

**Important:** Multiple phone numbers and multiple devices are different things.

A bank may permit multiple devices while sending SMS transaction alerts only to the registered contact number.

---

# 17. What Happens When a Customer Changes Their Mobile Number?

Suppose Ritik originally registered:

- Mobile A: 9876543210.
- Account: ACC-1001.

He changes his number to:

- Mobile B: 9123456780.

The account does not change. The bank updates the customer's registered contact information after verification.

## Mobile Number Change Flow

```text
Customer requests mobile number change
                |
                v
        Identity verification
                |
                v
     Bank performs risk checks
                |
                v
       New number verification
                |
                v
      Update customer profile
                |
                v
     Update account associations
                |
                v
     Update notification routing
                |
                v
      Confirmation notification
```

Depending on the bank, verification may involve:

- Branch-based verification.
- ATM-based verification.
- Existing registered mobile number.
- Debit card authentication.
- Other approved identity verification methods.

The old number should not automatically remain an authorized notification destination after a successful change unless the bank's policy specifically provides otherwise.

**Architectural point:** Mobile number changes are customer-profile events, not account-creation events.

---

# 18. How Does the Bank Know Where to Send Notifications?

A bank maintains separate records for customers, accounts, contact details, devices and notification preferences.

## Customer Table

| customer_id | name |
|---|---|
| C001 | Ritik |
| C002 | Rahul |

## Account Table

| account_id | account_type |
|---|---|
| A001 | Savings |
| A002 | Savings |

## Account Holders Table

| account_id | customer_id | relationship |
|---|---|---|
| A001 | C001 | Primary |
| A001 | C002 | Joint |
| A002 | C001 | Primary |

## Customer Contacts Table

| contact_id | customer_id | mobile | verified |
|---|---|---|---|
| M001 | C001 | 9876543210 | Yes |
| M002 | C002 | 9123456780 | Yes |

## Registered Devices Table

| device_id | customer_id | device |
|---|---|---|
| D001 | C001 | iPhone |
| D002 | C001 | Android |
| D003 | C002 | Android |

Notice:

- C001 has two accounts.
- C001 has two registered devices.
- A001 has two account holders.
- Mobile numbers belong to customer records, not necessarily directly to bank accounts.

Some banks instead maintain account-level contact preferences or primary-holder notification rules.

The actual schema depends on the bank's core banking platform.

---

# 19. What Exactly Triggers a Bank Notification?

A notification is generally triggered by a business event, not simply because someone clicked a button in the frontend.

Consider Ritik transferring ₹10,000.

## Complete Event Flow

```text
1. Customer initiates payment
           |
           v
2. Payment API receives request
           |
           v
3. Authentication and authorization
           |
           v
4. Fraud and transaction validation
           |
           v
5. Transaction Engine processes payment
           |
           v
6. Ledger transaction commits
           |
           v
7. Payment status changes to SUCCESS
           |
           v
8. Transaction event is created
           |
           v
9. Event published to Kafka
           |
           v
10. Notification Service consumes event
           |
           v
11. Fetch notification recipients
           |
           v
12. Fetch notification preferences
           |
           v
13. Generate notification message
           |
           v
14. Send through notification channels
           |
      +----+---------+
      |    |         |
      SMS  Email    Push
```

The critical detail is step 6.

The bank should not send a successful-payment notification merely because the API received a request.

It should send it when the relevant transaction reaches the appropriate confirmed state.

For an external payment, that may require additional confirmation from the payment network or recipient bank.

## Events That Trigger Notifications

| Event | Notification |
|---|---|
| ACCOUNT_CREATED | Account opening confirmation |
| MONEY_CREDITED | Credit alert |
| MONEY_DEBITED | Debit alert |
| PAYMENT_PENDING | Payment pending notification |
| PAYMENT_FAILED | Payment failure notification |
| PAYMENT_REVERSED | Reversal confirmation |
| MOBILE_NUMBER_CHANGED | Contact change confirmation |
| NEW_DEVICE_REGISTERED | New device registration alert |
| PASSWORD_CHANGED | Password change alert |
| BENEFICIARY_ADDED | Beneficiary registration alert |
| CARD_BLOCKED | Card blocking confirmation |
| LARGE_TRANSACTION_DETECTED | Security alert |

These are illustrative internal event names, not standardized banking event names.

---

# 20. How Does the Notification Service Decide Who Receives the Notification?

Consider Ritik and Rahul sharing a joint account.

Ritik transfers ₹10,000 from their account.

The transaction event might look like this:

```json
{
  "eventId": "EVT-10001",
  "eventType": "MONEY_DEBITED",
  "transactionId": "TXN-10001",
  "accountId": "A001",
  "amount": 10000,
  "currency": "INR",
  "status": "SUCCESS",
  "timestamp": "2026-11-17T10:30:00Z"
}
```

The Notification Service receives this event.

## Step 1: Identify the Account Holders

```sql
SELECT account_id, customer_id, relationship
FROM account_holders
WHERE account_id = 'A001';
```

Result:

```text
A001 -> C001 (Ritik)
A001 -> C002 (Rahul)
```

## Step 2: Fetch Eligible Notification Recipients

```sql
SELECT customer_id, mobile_number, email
FROM customer_notification_contacts
WHERE customer_id IN ('C001', 'C002')
AND transaction_alerts_enabled = TRUE;
```

## Step 3: Apply Bank Policies

The service determines:

- Should only the primary account holder receive alerts?
- Should all joint account holders receive alerts?
- Are there customer-level notification preferences?
- Are there account-level notification preferences?
- Is the mobile number verified?
- Is the channel enabled?

## Step 4: Dispatch Notifications

```text
Ritik  -> SMS / Push / Email
Rahul  -> SMS / Push / Email
```

The result depends on the bank's configured notification policy.

This is why a bank can send notifications to different mobile numbers without maintaining separate savings accounts for every number.

---

# 21. How Are SMS, Email and Push Notifications Actually Delivered?

The Notification Service generally integrates with external communication providers.

```text
              Notification Service
                       |
             +---------+---------+
             |         |         |
             v         v         v
            SMS      Email      Push
             |         |         |
             v         v         v
          SMS API   Email API   FCM/APNs
             |         |         |
             v         v         v
          Telecom   Mailbox   Mobile Device
          Operator
```

## A. SMS Notification

```text
Notification Service
        |
        v
     SMS API
        |
        v
    SMS Gateway
        |
        v
  Telecom Operator
        |
        v
 Customer's SIM
```

The SMS provider sends the message to the phone number supplied by the bank.

It does not need to know which mobile banking application is installed.

## B. Push Notification

Push notifications work differently.

Suppose Ritik has installed the banking application on two phones.

Both devices register with the bank's mobile backend.

The application obtains device-specific push tokens through:

- Firebase Cloud Messaging (FCM) on Android.
- Apple Push Notification Service (APNs) on iOS.

The backend stores these tokens against registered devices.

```text
Customer C001
      |
      +-- Device D001
      |      |
      |      +-- Push Token P001
      |
      +-- Device D002
             |
             +-- Push Token P002
```

When a transaction occurs:

```text
Notification Service
        |
        v
   Device Registry
        |
   +----+-----+
   |          |
 Token P001  Token P002
   |          |
   v          v
  FCM        FCM
   |          |
 Phone 1    Phone 2
```

Both devices can receive notifications if both are registered and eligible.

Notice that push notifications are routed using device tokens, whereas SMS is routed using mobile numbers.

These are two entirely different notification delivery mechanisms.

---

# 22. What If a Customer Uses Another Phone with a Different SIM?

Consider:

- Bank-registered number: 9876543210.
- New phone SIM: 9123456780.
- Banking application installed on the new phone.

The bank cannot assume that the new SIM belongs to the same customer.

The bank must establish the customer's identity and register the device through its approved security process.

## Device Registration Flow

```text
New phone opens banking application
                |
                v
       Device identification
                |
                v
       Customer authentication
                |
                v
      Mobile number verification
                |
                v
         Device binding
                |
                v
       Risk / security checks
                |
                v
       Device registration
                |
                v
      Registration notification
                |
                v
        Banking access enabled
```

If the bank supports multiple registered devices, it must maintain a device registry and provide the customer with a way to disable registered devices.

A particularly important distinction:

Installing an application on a new phone does not automatically authorize that phone to perform financial transactions.

Device binding and transaction authentication are separate security controls.

---

# 23. What Happens If Notification Delivery Fails?

Suppose the payment succeeds, but the SMS provider is unavailable.

Should the bank reverse the payment?

No.

Notification delivery and financial transaction execution are separate processes.

The bank should preserve the successful financial transaction and retry notification delivery independently.

## Failure Handling

```text
Payment SUCCESS
      |
      v
Event persisted in Outbox
      |
      v
Kafka publishes event
      |
      v
Notification Service
      |
      v
SMS provider unavailable
      |
      v
Retry mechanism
      |
      +-- Success -> Mark delivered
      |
      +-- Failure -> Retry / Dead Letter Queue
```

The system should maintain separate statuses:

| Status | Meaning |
|---|---|
| Transaction SUCCESS | Money movement confirmed |
| Notification PENDING | Notification not yet processed |
| Notification SENT | Provider accepted the request |
| Notification DELIVERED | Delivery confirmed, if provider supports it |
| Notification FAILED | Delivery unsuccessful |

Never confuse notification delivered with payment successful.

---

# 24. What Triggers the Process: Database Triggers or Application Events?

As a backend engineer, you should understand this distinction.

There are three possible mechanisms.

| Mechanism | How it works | Recommendation |
|---|---|---|
| Database Trigger | Database detects INSERT/UPDATE and executes logic | Use selectively |
| Application Domain Event | Business service emits an event after a state transition | Recommended |
| Transactional Outbox | Business transaction stores an event in the same database transaction | Strong production choice |

For a banking system, I would prefer:

**Domain Events + Transactional Outbox + Kafka + Notification Service.**

## Why?

A database trigger that directly calls an SMS API introduces external dependencies into the financial database transaction.

That is undesirable.

Instead:

1. Payment service processes the transaction.
2. Ledger entries are committed.
3. An outbox event is committed in the same database transaction.
4. An outbox publisher sends the event to Kafka.
5. Notification service consumes it.
6. The service resolves recipients.
7. SMS, email and push providers deliver it.

This gives us independent failure handling and reliable event publication.

---

# 25. Database Design for the Complete Banking System

If implementing this using Node.js and PostgreSQL, I would consider the following schema.

| Table | Responsibility |
|---|---|
| customers | Customer identity |
| accounts | Bank accounts |
| account_holders | Customer-account relationship |
| customer_contacts | Mobile numbers and email |
| notification_preferences | Alert preferences |
| registered_devices | Authorized devices |
| device_push_tokens | FCM/APNs tokens |
| transactions | Financial transaction records |
| ledger_entries | Debit and credit records |
| outbox_events | Reliable event publication |
| notification_logs | Notification processing and delivery status |

## Important Database Relationships

```text
CUSTOMERS
    |
    +---- CUSTOMER_CONTACTS
    |
    +---- REGISTERED_DEVICES
    |
    +---- ACCOUNT_HOLDERS
                  |
                  v
               ACCOUNTS
                  |
                  v
              TRANSACTIONS
                  |
                  v
              LEDGER_ENTRIES

TRANSACTIONS
    |
    v
OUTBOX_EVENTS
    |
    v
KAFKA
    |
    v
NOTIFICATION_SERVICE
    |
    v
NOTIFICATION_LOGS
```

**Important design rule:** Never use a mobile number as the primary identifier of a bank customer.

Use an immutable customer ID and maintain mobile numbers as independently verifiable contact attributes.

The mobile number can change. The customer's identity and account ownership should not change merely because the contact number changes.

---

# 26. Production Architecture: How I Would Design a New Digital Banking Platform

If I were architecting a new digital banking platform, I would separate financial correctness from customer-facing features.

## Proposed Architecture

```text
                    CLIENT LAYER
              React / Android / iOS
                         |
                         v
                   API GATEWAY
                         |
                         v
                  IDENTITY SERVICE
                         |
                         v
                 ACCOUNT / CUSTOMER
                         |
                         v
                  PAYMENT SERVICE
                         |
              +----------+----------+
              |                     |
              v                     v
        FRAUD ENGINE          PAYMENT SWITCH
              |                     |
              +----------+----------+
                         |
                         v
                 TRANSACTION ENGINE
                         |
                         v
                   LEDGER SERVICE
                         |
                         v
                 POSTGRESQL / ORACLE
                         |
                    OUTBOX TABLE
                         |
                         v
                       KAFKA
                         |
           +-------------+-------------+
           |             |             |
           v             v             v
      NOTIFICATION    ANALYTICS     AUDIT /
        SERVICE        SERVICE     REPORTING
```

## Recommended Technology Decisions

| Component | My Choice | Reason |
|---|---|---|
| Frontend | React + TypeScript | Maintainable web application |
| Backend | Java + Spring Boot | Mature enterprise ecosystem |
| API Gateway | Kong | Flexible API management |
| Database | PostgreSQL | ACID and relational integrity |
| Cache | Redis | Fast non-authoritative lookups |
| Messaging | Kafka | Durable event streaming |
| Fraud | Python | Mature data science ecosystem |
| Deployment | Kubernetes | Workload orchestration |
| Monitoring | Prometheus + Grafana | Operational visibility |

One important design decision:

I would initially keep the financial ledger and transaction engine within a tightly controlled transactional boundary rather than immediately splitting every financial operation into independent microservices.

I would introduce additional service boundaries only when there is a clear scaling, ownership, security or deployment requirement.

This avoids distributed transactions and unnecessary complexity in the most sensitive part of the system.

---

# 27. Technology Stack – Consolidated View

Here is an example of a modern banking technology stack.

| Layer | Example Technology | Purpose |
|---|---|---|
| Web Frontend | React | Banking web application |
| Mobile | Kotlin / Swift | Mobile banking |
| API Gateway | Kong / Apigee | API management |
| Backend | Java / Spring Boot | Financial business logic |
| Legacy Core | COBOL / Mainframe | Existing core banking workloads |
| Authentication | Keycloak / OIDC | Identity management |
| Primary Database | Oracle / PostgreSQL | Financial records |
| Cache | Redis | Fast data access |
| Event Streaming | Kafka | Asynchronous communication |
| Fraud Detection | Python / XGBoost | Risk analysis |
| Stream Processing | Flink | Real-time analytics |
| Search | OpenSearch | Search and indexing |
| Containers | Docker | Application packaging |
| Orchestration | Kubernetes | Deployment |
| Cloud | AWS / Azure / Private Cloud | Infrastructure |
| Monitoring | Prometheus / Grafana | Observability |
| Push Notifications | FCM / APNs | Mobile device notifications |
| SMS | SMS Gateway | Telecom delivery |
| Email | Email Provider | Email delivery |

These are candidate technologies and examples, not a verified inventory of any particular bank's production stack.

---

# 28. Why Banks Don't Use One Technology for Everything

This is an important architectural decision.

| Requirement | Selected Approach | Why Not Alternatives? |
|---|---|---|
| Financial ledger | PostgreSQL / Oracle | Redis is not suitable as the authoritative ledger |
| Real-time event streaming | Kafka | REST alone creates tight coupling |
| Authentication | OIDC / OAuth-based identity | Basic username/password is insufficient |
| Caching | Redis | Relational databases are inefficient for every cache lookup |
| Fraud detection | Rules + ML | Rules alone cannot identify every complex pattern |
| Financial processing | ACID transactions | Eventual consistency alone is insufficient