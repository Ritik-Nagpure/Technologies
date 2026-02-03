# Workloads in Kubernetes

## 📖 What Are Workloads?
- Workloads are **applications running on Kubernetes**.
- They define how pods are created, managed, scaled, and maintained.
- Kubernetes supports:
  - **Stateless workloads** (web servers, APIs).
  - **Stateful workloads** (databases, queues).
  - **Batch/cron workloads** (scheduled jobs, one‑time tasks).
  - **Cluster‑wide workloads** (monitoring/logging agents).

---

## ⚡ Stateless Workloads
- **Definition**: Applications that do not maintain client session state or persistent data within the pod itself.
- **Characteristics**:
  - Pods are interchangeable; any pod can serve any request.
  - Scaling is simple (add/remove replicas).
  - Failures do not affect correctness.
- **Examples**: Web frontends, REST APIs, microservices.
- **Kubernetes Resources Used**:
  - **Deployment** → Manages stateless pods, rolling updates, scaling.
  - **ReplicaSet** → Ensures correct number of replicas (usually managed by Deployments).
- **Interview Points**:
  - Why stateless apps scale easily? → No dependency on pod identity or local storage.
  - Why Deployment instead of ReplicaSet? → Deployment adds rollout strategies and rollback features.

---

## 🗂️ Stateful Workloads
- **Definition**: Applications that require stable identity, persistent storage, or ordered deployment.
- **Characteristics**:
  - Each pod has a unique identity and persistent volume.
  - Scaling and updates must preserve state.
- **Examples**: Databases (MySQL, MongoDB, Cassandra), message queues (Kafka, RabbitMQ).
- **Kubernetes Resource Used**:
  - **StatefulSet** → Provides stable identity and persistent storage.
- **Interview Points**:
  - Why StatefulSet for databases? → Ensures data consistency and stable pod identity.
  - Difference from Deployment? → Deployment is stateless; StatefulSet preserves state.

---

## 🌍 Cluster-Wide Workloads
### DaemonSet
- Ensures a pod runs on **every node** (or selected nodes).
- Automatically adds pods when new nodes join.
- **Use cases**: Monitoring agents, logging agents, networking components (CNI plugins).
- **Interview Points**:
  - Why DaemonSet? → Guarantees presence of critical services across the cluster.
  - Example: Running a log collector on every node.

---

## ⏱️ Batch Workloads
### Job
- Runs pods until completion.
- Ensures tasks finish successfully even if pods fail.
- **Use cases**: Data processing, backups, batch tasks.
- **Interview Points**:
  - Difference between Job and Deployment? → Job runs to completion; Deployment runs continuously.

### CronJob
- Schedules jobs to run at specific times or intervals.
- Useful for recurring tasks.
- **Use cases**: Nightly backups, scheduled reports, periodic cleanup.
- **Interview Points**:
  - CronJob vs. Job? → CronJob schedules jobs; Job runs immediately.

---

## 🔄 Workload Lifecycle
1. User defines workload (Deployment, StatefulSet, etc.).
2. API Server stores desired state in etcd.
3. Controller Manager ensures actual state matches desired state.
4. Scheduler assigns pods to nodes.
5. Kubelet runs pods via container runtime.
6. Controllers continuously reconcile state (self‑healing).

---

## 🛡️ Advanced Workload Features
- **Scaling**
  - Manual scaling (`kubectl scale`).
  - Horizontal Pod Autoscaler (HPA).
  - Vertical Pod Autoscaler (VPA).
- **Update Strategies**
  - Rolling updates (default).
  - Recreate strategy (delete all, then create new).
- **Resilience**
  - Self‑healing pods.
  - Rescheduling on healthy nodes.
- **Affinity & Anti‑Affinity**
  - Control pod placement based on labels.
- **Taints & Tolerations**
  - Restrict workloads to specific nodes.

---

## 🎯 Interview-Focused Questions
- Difference between Deployment, ReplicaSet, and StatefulSet?
- Why use StatefulSet instead of Deployment for databases?
- How does Kubernetes ensure workloads are resilient?
- What’s the role of DaemonSet in cluster services?
- Difference between Job and CronJob?
- How does HPA scale workloads automatically?

---

## 📝 Summary
Kubernetes workloads cover **all application types**:
- **Stateless (Deployments, ReplicaSets)** → interchangeable pods, easy scaling.
- **Stateful (StatefulSets)** → stable identity, persistent storage.
- **Cluster-wide (DaemonSets)** → system services across nodes.
- **Batch/Scheduled (Jobs, CronJobs)** → one‑time or recurring tasks.

This flexibility makes Kubernetes suitable for **microservices, databases, background tasks, and cluster services** alike.
