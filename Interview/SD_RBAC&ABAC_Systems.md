# RBAC and ABAC -- System Architecture, Design and Technology Decisions

## 1. Overview

RBAC (Role-Based Access Control) and ABAC (Attribute-Based Access
Control) are authorization models. They determine whether an
authenticated user can perform a requested action on a resource.

-   **RBAC:** Access is determined by the roles assigned to a user and
    the permissions assigned to those roles.
-   **ABAC:** Access is determined by evaluating attributes of the
    subject, resource, action, and environment against policies.
-   **Hybrid RBAC + ABAC:** RBAC handles coarse-grained permissions
    while ABAC handles fine-grained, contextual conditions.

Authentication answers: "Who are you?" Authorization answers: "What are
you allowed to do?"

## 2. RBAC -- Role-Based Access Control

### 2.1 What it is

RBAC assigns permissions to roles and assigns roles to users. Instead of
maintaining individual permissions for every user, the system manages
reusable roles.

Example for an e-commerce application:

  Role            Permissions
  --------------- ---------------------------------------------------
  Super Admin     All administrative operations
  Admin           Manage users, products and orders
  Manager         Manage products and view reports
  Customer        View products and manage own orders
  Support Agent   View customer details and handle support requests

The core relationship is:

``` text
USER -> ROLE -> PERMISSION -> RESOURCE
```

A role groups permissions. A permission describes an operation on a
resource, for example `product:read` or `order:refund`.

### 2.2 RBAC architecture

Main components:

1.  **User:** Authenticated identity requesting access.
2.  **Role:** Named responsibility or job function.
3.  **Permission:** An allowed operation on a resource.
4.  **Authorization service:** Resolves whether the user has the
    required permission.
5.  **Policy Enforcement Point (PEP):** Intercepts the request and
    enforces the decision.
6.  **Resource:** Protected API, application function, or data record.

### 2.3 RBAC request flow

Example request:

``` http
DELETE /api/products/101
```

Flow:

1.  The user logs in.
2.  The authentication service verifies credentials.
3.  The API verifies the access token and identifies the user.
4.  The authorization layer retrieves the user's roles.
5.  It resolves the permissions associated with those roles.
6.  It checks whether a required permission such as `product:delete`
    exists.
7.  If allowed, the request proceeds; otherwise, the API returns
    `403 Forbidden`.

Simplified Express middleware:

``` typescript
type Role = "ADMIN" | "MANAGER" | "CUSTOMER";

const rolePermissions: Record<Role, string[]> = {
  ADMIN: ["product:read", "product:create", "product:delete"],
  MANAGER: ["product:read", "product:create"],
  CUSTOMER: ["product:read"]
};

function authorize(requiredPermission: string) {
  return (req, res, next) => {
    const userRoles = req.user.roles as Role[];

    const allowed = userRoles.some(role =>
      rolePermissions[role]?.includes(requiredPermission)
    );

    if (!allowed) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}
```

Usage:

``` typescript
app.delete(
  "/api/products/:id",
  authenticate,
  authorize("product:delete"),
  deleteProduct
);
```

This is an educational example. In production, permissions should
normally be resolved from a managed authorization data model rather than
hardcoded in application middleware.

## 3. RBAC database design

RBAC is naturally represented using relational tables.

### 3.1 Core tables

**users**

  Column                 Purpose
  ---------------------- ------------------------
  id UUID                User identifier
  email VARCHAR          User email
  status VARCHAR         Active, disabled, etc.
  created_at TIMESTAMP   Creation timestamp

**roles**

  Column             Purpose
  ------------------ ----------------------
  id UUID            Role identifier
  name VARCHAR       ADMIN, MANAGER, etc.
  description TEXT   Role description

**permissions**

  Column             Purpose
  ------------------ ------------------------------
  id UUID            Permission identifier
  resource VARCHAR   product, user, order
  action VARCHAR     read, create, update, delete
  description TEXT   Permission description

**user_roles**

  Column                  Purpose
  ----------------------- -------------------------------
  user_id UUID            References users
  role_id UUID            References roles
  assigned_at TIMESTAMP   Assignment date
  assigned_by UUID        Administrator who assigned it

**role_permissions**

  Column               Purpose
  -------------------- ------------------------
  role_id UUID         References roles
  permission_id UUID   References permissions

Relationships:

``` text
users 1 --- N user_roles N --- 1 roles
roles 1 --- N role_permissions N --- 1 permissions
```

Recommended constraints and indexes:

-   Unique constraint on `(user_id, role_id)`.
-   Unique constraint on `(role_id, permission_id)`.
-   Foreign keys for relationship integrity.
-   Index both sides of relationship tables according to query patterns.
-   Use transactions for role and permission updates.

### 3.2 Why PostgreSQL?

PostgreSQL is a strong default for conventional RBAC because:

-   RBAC contains many-to-many relationships.
-   SQL joins naturally resolve user-role-permission relationships.
-   Foreign keys provide referential integrity.
-   Transactions protect multi-step permission updates.
-   Indexes support predictable lookup patterns.

MongoDB can also implement RBAC, but references, aggregation queries,
and application-managed relationship integrity can add complexity.
Embedding roles and permissions in user documents may create duplication
and update challenges.

PostgreSQL is not mandatory; choose based on the application's existing
data model and operational requirements.

## 4. ABAC -- Attribute-Based Access Control

### 4.1 What it is

ABAC makes authorization decisions by evaluating attributes from four
dimensions:

  Attribute category   Meaning                        Example
  -------------------- ------------------------------ -------------------------------
  Subject              Who is requesting access?      Department = Finance
  Resource             What is being accessed?        Classification = Confidential
  Action               What operation is requested?   Read, update, delete
  Environment          Under what circumstances?      Time, IP, device trust

Example policy:

``` text
ALLOW access IF:

User.department == "Finance"
AND User.clearanceLevel >= Resource.classificationLevel
AND Action == "READ"
AND Environment.time is within working hours
AND Environment.device == "MANAGED"
```

Example outcomes:

  -----------------------------------------------------------------------
  Scenario                Result                  Reason
  ----------------------- ----------------------- -----------------------
  Finance employee,       Allow                   All conditions
  managed device, working                         satisfied
  hours                                           

  Finance employee,       Deny                    Device condition failed
  personal device                                 

  HR employee, managed    Deny                    Department condition
  device                                          failed
  -----------------------------------------------------------------------

ABAC is useful when authorization depends on context, not merely a
user's role.

### 4.2 ABAC architecture

The common NIST ABAC architecture identifies four major components:

1.  **PEP -- Policy Enforcement Point:** Intercepts requests and
    enforces decisions.
2.  **PDP -- Policy Decision Point:** Evaluates policies and returns a
    decision.
3.  **PIP -- Policy Information Point:** Supplies attributes needed for
    policy evaluation.
4.  **PAP -- Policy Administration Point:** Creates, updates, and
    manages policies.

Typical flow:

``` text
Client
  |
  v
API / PEP
  |
  v
PDP <------ PAP (policy administration)
  |
  +-------- PIP (trusted user/resource/environment attributes)
  |
  v
ALLOW or DENY
  |
  v
PEP enforces decision
  |
  v
Protected resource
```

### 4.3 Component responsibilities

**PEP** - Intercepts requests. - Builds or forwards an authorization
context. - Calls the PDP. - Enforces allow or deny. - Prevents the
business operation when access is denied.

It can be implemented in API middleware, an API gateway, or a
service-level authorization layer.

**PDP** - Evaluates the policy against the supplied context. - Applies
the configured policy-combination behavior. - Returns a decision, and
optionally a reason or obligations.

**PIP** - Retrieves attributes from trusted sources. - Examples:
department from an identity service, classification from a resource
record, device trust from endpoint management. - Must not blindly trust
values supplied by the browser.

**PAP** - Provides policy authoring and administration. - Supports
policy review, versioning, testing, approval, and deployment.

### 4.4 Simplified ABAC evaluation

``` typescript
type Context = {
  user: {
    department: string;
    clearanceLevel: number;
    status: string;
  };
  resource: {
    classificationLevel: number;
  };
  action: string;
  environment: {
    managedDevice: boolean;
  };
};

function evaluatePolicy(context: Context): boolean {
  const { user, resource, action, environment } = context;

  if (user.department !== "Finance") return false;
  if (user.clearanceLevel < resource.classificationLevel) return false;
  if (action !== "read") return false;
  if (!environment.managedDevice) return false;
  if (user.status !== "ACTIVE") return false;

  return true;
}
```

This is a simplified example. Production systems should define explicit
policy semantics, trusted attribute sources, error handling, and
default-deny behavior.

## 5. ABAC database design

A practical relational design can include:

**users**

``` text
id
email
department
designation
clearance_level
status
```

**resources**

``` text
id
resource_type
owner_id
classification_level
department
created_at
```

**policies**

``` text
id
name
description
effect
priority
status
version
created_at
```

**policy_rules**

``` text
id
policy_id
subject_conditions
resource_conditions
action_conditions
environment_conditions
```

**user_attributes**

``` text
id
user_id
attribute_key
attribute_value
```

**resource_attributes**

``` text
id
resource_id
attribute_key
attribute_value
```

**authorization_audit_logs**

``` text
id
user_id
resource_id
action
decision
policy_id
reason
timestamp
```

These are logical tables, not a requirement to store every attribute as
a separate key-value row. Frequently queried attributes should often be
typed columns. JSONB can hold additional dynamic attributes where
appropriate.

### Why store policies separately?

If access rules change, a policy-driven system can update the policy
without rewriting every API endpoint. Policies should be versioned,
tested, reviewed, and audited.

## 6. Technology stack and selection rationale

RBAC and ABAC are authorization models, not technologies. They can be
implemented with multiple languages, databases, and policy engines.

A possible Node.js and TypeScript stack:

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  Frontend                React / Next.js         UI visibility and user
                                                  experience

  Backend                 Node.js + Express       API and business logic

  Language                TypeScript              Type safety

  Authentication          OAuth 2.0 / OpenID      Identity and token
                          Connect                 flows

  RBAC                    Application             Role and permission
                          authorization service   resolution

  ABAC                    OPA or Cedar            Policy evaluation

  Primary database        PostgreSQL              Users, roles,
                                                  permissions, attributes

  Cache                   Redis                   Frequently accessed
                                                  authorization data

  Enforcement             Middleware / API        Enforce decisions
                          gateway                 

  Audit                   Database + centralized  Authorization history
                          logging                 

  Deployment              Docker / Kubernetes     Packaging and
                                                  orchestration
  -----------------------------------------------------------------------

### 6.1 Node.js + TypeScript

Why: - Fits API-driven applications. - TypeScript provides compile-time
contracts. - Asynchronous I/O is useful when fetching attributes from
services. - Fits an existing JavaScript/TypeScript ecosystem.

Alternatives: - Python is equally capable and may fit Python-oriented
platforms. - Java is strong for enterprise services and large JVM
environments.

Node.js is not inherently more secure or universally faster. Choose
according to the existing platform and team capabilities.

### 6.2 PostgreSQL

Why: - Relational RBAC model. - Transactions and constraints. - Strong
indexing and query capabilities. - JSONB for additional flexible
attributes.

Why not Redis as the primary store: - Redis is optimized for in-memory
access, not as the authoritative relational source for authorization
relationships.

### 6.3 Redis

Authorization checks can occur on every protected API request. Redis can
cache frequently used role-permission mappings or policy data.

Example cached value:

``` json
{
  "userId": "101",
  "permissions": [
    "product:read",
    "product:create",
    "order:read"
  ],
  "authorizationVersion": 12
}
```

The main risk is stale authorization data. If an administrator revokes a
role but a cache still contains the old permissions, access may continue
incorrectly.

Production controls: - Invalidate affected cache entries when roles or
permissions change. - Use versioned authorization data. - Use TTL as an
additional safeguard, not the only revocation mechanism. - Define
acceptable revocation latency. - Fail closed when a security-critical
decision cannot be established.

### 6.4 Open Policy Agent (OPA)

OPA is a general-purpose policy engine. It separates policy logic from
application code and uses Rego.

Example:

``` rego
package authz

default allow := false

allow if {
    input.user.department == "Finance"
    input.resource.classification == "Internal"
    input.action == "read"
    input.environment.managed_device == true
}
```

Why OPA: - Centralized policy evaluation. - Policy changes can be
separated from business code. - Supports complex conditions. - Can be
used across multiple services and platforms. - Provides policy testing
and deployment workflows.

Why not always use OPA: - Adds another component to operate and
monitor. - Requires Rego knowledge. - May be unnecessary for a small
application with a few stable rules.

Official documentation: https://www.openpolicyagent.org/docs/

### 6.5 Cedar

Cedar is a purpose-built authorization policy language and evaluator.

Example:

``` cedar
permit (
    principal,
    action == Action::"Read",
    resource
)
when {
    principal.department == "Finance" &&
    resource.classification == "Internal"
};
```

Why Cedar: - Purpose-built authorization model. - Explicit principal,
action, and resource concepts. - Supports authorization schemas. -
Designed with security-oriented policy evaluation in mind.

Why not always Cedar: - Requires learning its policy model. -
Integrations and operational model differ from OPA. - OPA may fit
broader infrastructure policy requirements better.

Official documentation: https://docs.cedarpolicy.com/

### 6.6 OPA vs Cedar

  -----------------------------------------------------------------------
  Consideration           OPA                     Cedar
  ----------------------- ----------------------- -----------------------
  Main purpose            General-purpose policy  Authorization policy
                          engine                  language and evaluator

  Policy language         Rego                    Cedar

  Application             Strong fit              Strong fit
  authorization                                   

  Infrastructure policy   Strong fit              Not its primary purpose

  Policy model            Rules and data          Principal, action,
                                                  resource, context

  Best suited for         Broad policy governance Fine-grained
                                                  application
                                                  authorization
  -----------------------------------------------------------------------

Choose one unless there is a concrete reason to operate both.

## 7. RBAC vs ABAC comparison

  -----------------------------------------------------------------------
  Feature                 RBAC                    ABAC
  ----------------------- ----------------------- -----------------------
  Authorization basis     Roles                   Attributes and policies

  Complexity              Low to medium           Medium to high

  Flexibility             Moderate                High

  Policy management       Role-permission mapping Policy evaluation

  Database design         Relatively simple       More flexible and
                                                  complex

  Performance             Usually predictable     Depends on attribute
                                                  retrieval and
                                                  evaluation

  Context awareness       Limited by itself       Native capability

  Fine-grained access     Possible, but may       Natural fit
                          create many roles       

  Administration          Easier                  Requires policy
                                                  governance

  Debugging               Relatively easy         More challenging
  -----------------------------------------------------------------------

### 7.1 Role explosion

Suppose an organization creates roles for every combination of
department, seniority, and access level:

``` text
FINANCE_ADMIN
FINANCE_MANAGER
FINANCE_EMPLOYEE
FINANCE_READONLY
HR_ADMIN
HR_MANAGER
HR_EMPLOYEE
HR_READONLY
```

As combinations grow, role administration becomes difficult. This is
known as role explosion.

ABAC can reduce the need for combination-specific roles by evaluating
attributes such as department, clearance, resource classification, and
environment.

ABAC does not eliminate complexity; it moves complexity into policy
design and attribute governance.

## 8. Hybrid RBAC + ABAC

Many enterprise applications benefit from combining the models.

-   RBAC handles coarse-grained permissions.
-   ABAC handles fine-grained contextual conditions.

Example:

User has `FINANCE_MANAGER`.

RBAC check:

``` text
Does FINANCE_MANAGER have payment:approve?
```

ABAC check:

``` text
Is payment amount <= manager approval limit?
Does payment belong to the manager's department?
Is the manager account active?
Is payment status PENDING?
```

Simplified decision:

``` text
ALLOW = RBAC_ALLOWED AND ABAC_ALLOWED
```

This is a simple deny-by-default composition. Real systems may need
explicit deny rules, ownership, delegated permissions, separation of
duties, or other policy-combination semantics.

## 9. Production API example: payment approval

Requirement: A finance manager can approve a payment only when: 1. The
user has `payment:approve`. 2. The payment belongs to the user's
department. 3. The payment amount is within the user's approval limit.
4. The payment status is `PENDING`. 5. The user's account is active.

### Step 1: Authentication

The user authenticates through an identity provider. The API verifies
the access token and identifies the subject.

Example token claims:

``` json
{
  "sub": "user-101",
  "iss": "https://identity.example.com",
  "aud": "payment-api",
  "exp": 1795000000
}
```

The token need not contain every permission and attribute. It can
primarily establish the authenticated identity.

### Step 2: API request

``` http
POST /api/payments/501/approve
Authorization: Bearer <access_token>
```

### Step 3: Authentication middleware

-   Verifies token signature.
-   Checks issuer and audience.
-   Checks expiration.
-   Extracts the user ID.

### Step 4: RBAC authorization

Resolve the user's permissions and check:

``` text
payment:approve
```

If absent, return `403 Forbidden`.

### Step 5: Fetch trusted ABAC attributes

Example:

``` text
User:
  department = FINANCE
  approval_limit = 500000
  status = ACTIVE

Payment:
  department = FINANCE
  amount = 200000
  status = PENDING
```

### Step 6: Evaluate policy

``` text
user.department == payment.department
AND user.approval_limit >= payment.amount
AND user.status == ACTIVE
AND payment.status == PENDING
```

If every required condition passes, authorization is granted.

### Step 7: Execute business operation

Do not treat authorization and the business update as unrelated
operations. Consider concurrency and state changes.

Example conditional update:

``` sql
UPDATE payments
SET status = 'APPROVED'
WHERE id = $1
  AND department = $2
  AND status = 'PENDING';
```

The application must also ensure that authorization-relevant attributes
remain valid at execution time. Use suitable transactions, locking,
version checks, or conditional writes based on the data model.

### Step 8: Audit

Example:

``` json
{
  "userId": "user-101",
  "resourceId": "payment-501",
  "action": "payment:approve",
  "decision": "ALLOW",
  "reason": "RBAC and ABAC policies satisfied"
}
```

Avoid logging access tokens, secrets, or unnecessary sensitive attribute
values.

## 10. Security considerations

  -----------------------------------------------------------------------
  Problem                 Risk                    Production solution
  ----------------------- ----------------------- -----------------------
  Client-side checks only Users bypass UI         Enforce on backend
                          restrictions            

  Outdated JWT roles      Revoked access remains  Short token lifetime
                          valid                   and revocation/version
                                                  checks

  IDOR                    User accesses another   Resource-level
                          user's records          authorization

  Stale cache             Revoked permissions     Invalidation and
                          remain cached           versioning

  Untrusted attributes    User manipulates        Fetch attributes from
                          authorization context   trusted sources

  Missing default deny    Unmatched requests may  Deny by default
                          be allowed              

  Excessive permissions   Privilege escalation    Least privilege

  Missing audit logs      Difficult               Centralized
                          investigations          authorization audit

  Policy misconfiguration Unauthorized access     Policy tests, reviews,
                                                  and controlled rollout
  -----------------------------------------------------------------------

### 10.1 RBAC does not automatically prevent IDOR

A user may have `order:read`, but that does not mean the user can read
every customer's order.

Example:

``` http
GET /api/orders/1001
```

The backend must verify ownership or another valid access relationship:

``` typescript
if (order.customerId !== req.user.id) {
  return res.status(403).json({ message: "Access denied" });
}
```

This can be modelled through ABAC or relationship-based authorization.

## 11. Scalability and performance

Consider an application with: - 1 million registered users. - 100,000
daily active users. - 5,000 API requests per second. - Multiple backend
microservices.

A naive design makes every microservice query PostgreSQL independently
for roles and permissions on every request. This can create unnecessary
database traffic and tight coupling.

Recommended design: 1. Centralize authorization policy management. 2.
Define shared authorization contracts. 3. Keep enforcement close to the
protected resource. 4. Cache frequently used, versioned authorization
data. 5. Avoid unnecessary synchronous attribute lookups. 6. Use local
policy evaluation or a highly available PDP. 7. Maintain audit logs
without making the request path depend on a slow logging pipeline.

### 11.1 Centralized vs distributed authorization

  -----------------------------------------------------------------------
  Architecture            Advantages              Disadvantages
  ----------------------- ----------------------- -----------------------
  Centralized PDP         Consistent policy       Network dependency and
                          governance              potential bottleneck

  Local PDP               Low latency and         Policy distribution
                          independent evaluation  complexity

  Hybrid PDP              Central governance,     More operational
                          local evaluation        complexity
  -----------------------------------------------------------------------

For high-scale systems, centrally managed policies with local evaluation
can be a good design, provided policy distribution, versioning, and
revocation are handled correctly.

Authorization caching is a security-consistency problem as well as a
performance problem. Define how quickly revocations must take effect.

## 12. Alternative authorization technologies

  -----------------------------------------------------------------------
  Technology              What it does            When it fits
  ----------------------- ----------------------- -----------------------
  Custom middleware       Application-specific    Small applications with
                          authorization checks    simple requirements

  Casbin                  Authorization library   Embedded authorization
                          supporting RBAC, ABAC,  library
                          and other models        

  OPA                     General-purpose policy  Cross-service policy
                          engine                  governance

  Cedar                   Authorization policy    Fine-grained
                          language and evaluator  application
                                                  authorization

  AWS IAM                 AWS identity and        AWS infrastructure
                          resource authorization  permissions

  Keycloak                Identity and access     Authentication,
                          management              federation, identity
                                                  and role management

  Auth0                   Managed identity        Reduce identity
                          platform                infrastructure
                                                  operations

  PostgreSQL              Persistent              Source of truth for
                          authorization data      relationships and
                                                  attributes

  Redis                   In-memory data store    Cache frequently
                                                  accessed authorization
                                                  data
  -----------------------------------------------------------------------

References: - Casbin: https://casbin.org/ - Keycloak:
https://www.keycloak.org/documentation - AWS IAM:
https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html

Do not introduce every technology into one application. Select only what
the requirements justify.

## 13. Recommended enterprise architecture

For a Node.js and TypeScript SaaS application:

``` text
React / Next.js Frontend
          |
          v
API Gateway / Node.js API
          |
          v
Authentication Middleware
          |
          v
Authorization PEP
          |
          +---------------------------+
          |                           |
          v                           v
      RBAC Service                 ABAC PDP
          |                           |
          v                           v
   PostgreSQL / Redis             OPA or Cedar
          |                           |
          +-------------+-------------+
                        |
                        v
              Authorization Decision
                   ALLOW / DENY
                        |
                        v
                Business Services
             Payments / Users / Orders
                        |
                        v
              Authorization Audit
```

### Recommended implementation phases

  Phase   Implementation                            Priority
  ------- ----------------------------------------- ------------------------
  1       Authentication and identity integration   Essential
  2       RBAC schema and permission middleware     Essential
  3       Resource ownership checks                 Essential
  4       ABAC policy engine                        When required
  5       Redis caching and invalidation            When justified by load
  6       Centralized policy management             Enterprise requirement
  7       Audit, monitoring and policy testing      Production requirement

## 14. Interview-ready answer

**Question: Would you choose RBAC or ABAC for an enterprise
application?**

Answer:

"I would first evaluate the application's authorization requirements
rather than selecting a model based on technology preference.

If the application has relatively stable business roles, such as Admin,
Manager, and Customer, I would start with RBAC because it is simple to
implement, maintain, and audit.

However, if access depends on additional conditions such as resource
ownership, department, data classification, approval limits, device
trust, or working hours, I would introduce ABAC.

For a complex enterprise application, I would prefer a hybrid
architecture where RBAC handles coarse-grained permissions and ABAC
handles fine-grained contextual authorization.

I would use PostgreSQL as the source of truth, Redis for carefully
managed caching, and a policy engine such as OPA or Cedar if policy
complexity justifies it.

I would also ensure that authorization is enforced on the backend,
follows least privilege, denies access by default, and maintains
auditable authorization decisions."

## 15. Related concepts to study

  -----------------------------------------------------------------------
  Concept                             Why it matters
  ----------------------------------- -----------------------------------
  Authentication vs Authorization     Identity verification vs access
                                      decisions

  RBAC                                Role-based permission management

  ABAC                                Attribute-based policy evaluation

  ReBAC                               Relationship-based access control

  PBAC                                Policy-based access control

  ACL                                 Access Control Lists

  OAuth 2.0                           Delegated authorization framework

  OpenID Connect                      Authentication and identity layer

  JWT                                 Signed token format

  PEP                                 Enforces authorization decisions

  PDP                                 Makes authorization decisions

  Least Privilege                     Limits unnecessary access

  Separation of Duties                Prevents conflicting
                                      responsibilities

  Multi-tenancy                       Isolates tenant resources and data
  -----------------------------------------------------------------------

**Recommended next topic:** Study ReBAC, particularly how systems such
as Google Drive, Slack, and GitHub handle resource sharing and
permissions. It complements RBAC and ABAC by modelling relationships
between users and resources.

## 16. Authoritative references

1.  NIST SP 800-162 -- Guide to Attribute Based Access Control:
    https://csrc.nist.gov/pubs/sp/800/162/upd2/final
2.  NIST RBAC resources:
    https://csrc.nist.gov/projects/role-based-access-control
3.  Open Policy Agent documentation:
    https://www.openpolicyagent.org/docs/
4.  Cedar documentation: https://docs.cedarpolicy.com/
5.  Casbin documentation: https://casbin.org/
6.  Keycloak documentation: https://www.keycloak.org/documentation
