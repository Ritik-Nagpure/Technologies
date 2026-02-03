# Networking in Kubernetes

## 🌐 Why Networking is Important
- Containers and pods need to communicate with each other, with services, and with external clients.
- Kubernetes provides a **flat network model**: every pod gets its own IP address.
- Networking ensures **service discovery, load balancing, and secure communication**.

---

## 🔑 Core Networking Principles
- **Pod-to-Pod Communication**
  - Each pod has a unique IP.
  - Pods can communicate directly across nodes without NAT.
- **Pod-to-Service Communication**
  - Services provide stable endpoints for pods.
  - Load balances traffic across multiple pod replicas.
- **External-to-Service Communication**
  - Services can be exposed outside the cluster using NodePort, LoadBalancer, or Ingress.

---

## ⚙️ Service Types
- **ClusterIP**
  - Default service type.
  - Exposes service internally within the cluster.
- **NodePort**
  - Exposes service on a static port across all nodes.
  - Accessible externally via `<NodeIP>:<NodePort>`.
- **LoadBalancer**
  - Integrates with cloud provider load balancers.
  - Provides external access with automatic traffic distribution.
- **ExternalName**
  - Maps a service to an external DNS name.

---

## 🚪 Ingress
- **Definition**: API object that manages external HTTP/HTTPS access.
- Provides routing rules, SSL termination, and host/path-based routing.
- Works with Ingress Controllers (NGINX, Traefik, HAProxy).

---

## 🛡️ Network Policies
- Define rules for how pods communicate with each other and with external endpoints.
- Control traffic at the IP and port level.
- Used for **security isolation** between namespaces or applications.

---

## 🔄 DNS in Kubernetes
- Every service gets a DNS entry (`<service-name>.<namespace>.svc.cluster.local`).
- Pods use DNS for service discovery.
- CoreDNS is the default DNS server in Kubernetes.

---

## 📊 Networking Components
- **Kube Proxy**
  - Maintains network rules on nodes.
  - Handles service IPs and load balancing.
- **CNI (Container Network Interface) Plugins**
  - Provide networking implementation.
  - Examples: Flannel, Calico, Weave Net, Cilium.

---

## 🎯 Interview-Focused Points
- **Difference between ClusterIP, NodePort, and LoadBalancer**: ClusterIP is internal, NodePort exposes on node IP, LoadBalancer integrates with cloud.
- **Why Ingress over NodePort?**: Ingress provides advanced routing, SSL, and scalability.
- **Role of Kube Proxy**: Manages service networking and load balancing.
- **Network Policies**: Enforce security by restricting pod communication.
- **CNI Plugins**: Extend Kubernetes networking with features like overlay networks, encryption, and policy enforcement.

---

## 📝 Summary
Kubernetes networking ensures **seamless communication** between pods, services, and external clients. With service types, Ingress, DNS, and network policies, Kubernetes provides a flexible and secure networking model suitable for both simple and complex applications.
