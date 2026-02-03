# Storage in Kubernetes

## 📦 Why Storage Matters
- Containers are **ephemeral** by default — data is lost when a pod restarts or is rescheduled.
- Kubernetes provides abstractions to manage **persistent storage** for applications.
- Ensures **stateful workloads** (databases, message queues, etc.) can survive pod restarts and node failures.

---

## 🔑 Storage Concepts
- **Volume**
  - Basic storage unit attached to a pod.
  - Lifecycle tied to the pod.
  - Can be backed by local disk, cloud storage, or network storage.

- **Persistent Volume (PV)**
  - Cluster-wide storage resource.
  - Represents actual storage (disk, NFS, cloud volume).
  - Managed independently of pods.

- **Persistent Volume Claim (PVC)**
  - Request for storage by a pod.
  - Abstracts underlying storage details.
  - Pods use PVCs to access PVs.

- **StorageClass**
  - Defines types of storage (e.g., SSD, HDD, cloud volumes).
  - Enables **dynamic provisioning** of PVs.
  - Allows administrators to define policies (replication, performance tiers).

---

## 🏗️ Storage Lifecycle
1. **Admin creates PVs** or defines StorageClasses.
2. **Developer creates PVCs** requesting storage.
3. Kubernetes **binds PVCs to PVs**.
4. Pod mounts PVC to use persistent storage.

---

## ⚙️ Types of Volumes
- **emptyDir**: Temporary storage, deleted when pod stops.
- **hostPath**: Maps a file/directory from node filesystem.
- **NFS**: Network File System for shared storage.
- **Cloud Provider Volumes**: AWS EBS, GCP Persistent Disk, Azure Disk.
- **CSI (Container Storage Interface)**: Standardized plugin interface for third-party storage providers.

---

## 🔄 Stateful Workloads
- **StatefulSet** uses PVCs to provide stable storage for each pod.
- Ensures data consistency across pod restarts.
- Commonly used for databases (MySQL, MongoDB, Cassandra).

---

## 🛡️ Storage Security
- **Access Modes**:
  - ReadWriteOnce (RWO): Mounted by a single node.
  - ReadOnlyMany (ROX): Multiple nodes, read-only.
  - ReadWriteMany (RWX): Multiple nodes, read-write.
- **Secrets**: Securely store credentials for accessing storage.
- **Encryption**: Cloud providers often support encryption at rest.

---

## 🎯 Interview-Focused Points
- **Difference between Volume and PV/PVC**: Volumes are pod-scoped; PV/PVC are cluster-scoped and persistent.
- **Dynamic vs. Static Provisioning**: Static requires manual PV creation; dynamic uses StorageClasses.
- **Why StatefulSets need PVCs**: To maintain data consistency across pod restarts.
- **Access Modes**: Important for multi-node workloads.
- **CSI Drivers**: Extend Kubernetes storage capabilities with vendor-specific solutions.

---

## 📝 Summary
Kubernetes storage abstracts away infrastructure complexity, enabling **persistent, portable, and secure data management**. With PVs, PVCs, and StorageClasses, Kubernetes supports both **stateless and stateful applications**, making it suitable for enterprise workloads.
