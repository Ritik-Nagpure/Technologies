# Kubernetes Architecture

## 🏗️ High-Level Overview
Kubernetes follows a **master-worker (control plane–node)** architecture:
- **Control Plane (Master Node)**: Manages the overall cluster state.
- **Worker Nodes**: Run the actual applications (containers).

---

<img src='https://kubernetes.io/images/docs/kubernetes-cluster-architecture.svg' />

## 🎯 Control Plane Components
- **API Server**
  - Central management point; all commands go through it.
  - Exposes REST APIs for cluster operations.
  - Validates and processes requests.

- **etcd**
  - Distributed key-value store.
  - Stores cluster state and configuration data.
  - Highly available and consistent.

- **Controller Manager**
  - Runs controllers that ensure the desired state.
  - Examples:
    - Node Controller: Monitors node health.
    - Replication Controller: Ensures correct number of pods.
    - Endpoints Controller: Manages service endpoints.

- **Scheduler**
  - Assigns pods to nodes based on resource availability.
  - Considers CPU, memory, affinity/anti-affinity, taints/tolerations.

---

## ⚙️ Worker Node Components
- **Kubelet**
  - Agent running on each node.
  - Ensures containers are running as defined in PodSpecs.
  - Communicates with the API Server.

- **Kube Proxy**
  - Handles networking for services.
  - Maintains network rules for pod communication.
  - Provides load balancing within the cluster.

- **Container Runtime**
  - Executes containers (Docker, containerd, CRI-O).
  - Interfaces with Kubernetes via the Container Runtime Interface (CRI).

---

## 🔄 Cluster Communication Flow
1. User interacts with **API Server** (via `kubectl` or other clients).
2. API Server updates **etcd** with desired state.
3. **Controller Manager** ensures actual state matches desired state.
4. **Scheduler** assigns pods to worker nodes.
5. **Kubelet** on worker nodes runs pods using the container runtime.
6. **Kube Proxy** manages networking and service discovery.

---

## 🎯 Interview-Focused Points
- **Difference between Control Plane and Worker Node**: Control plane manages cluster state; worker nodes run workloads.
- **Role of etcd**: Stores cluster state; critical for recovery.
- **Scheduler vs. Controller Manager**: Scheduler places pods; Controller Manager ensures they stay running.
- **Why multiple components?**: Separation of concerns improves scalability and reliability.
- **Failure scenarios**: If API Server fails, cluster becomes unmanageable; if etcd fails, state is lost.

---

## 📝 Summary
Kubernetes architecture separates **management (control plane)** from **execution (worker nodes)**. This design ensures scalability, resilience, and clear responsibility boundaries, making Kubernetes the industry standard for container orchestration.


