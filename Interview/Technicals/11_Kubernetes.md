# 7. Kubernetes

## 1. What is Kubernetes?

Kubernetes is an open-source container orchestration platform used to automate the deployment, scaling, networking, and management of containerized applications.

It is commonly used when applications consist of multiple containers running across multiple servers.

Key components:

1. Cluster:
   A collection of machines managed by Kubernetes.

2. Node:
   A machine that runs containerized applications.

3. Pod:
   The smallest deployable unit in Kubernetes. It can contain one or more containers.

4. Deployment:
   Manages application replicas and rolling updates.

5. Service:
   Provides a stable network endpoint to access a group of Pods.

6. ConfigMap:
   Stores non-sensitive application configuration.

7. Secret:
   Stores sensitive configuration data.

8. Ingress:
   Manages external HTTP and HTTPS access to services.

9. kubelet:
   An agent running on each node that communicates with the Kubernetes control plane and manages Pods.

## 2. What is the purpose of Kubernetes?

The primary purpose of Kubernetes is to automate the management of containerized applications across a cluster of machines.

Major benefits:

1. Container Orchestration:
   Automatically manages container deployment and scheduling.

2. Auto Scaling:
   Increases or decreases application replicas based on workload when configured.

3. Self-Healing:
   Restarts failed containers and replaces unhealthy Pods.

4. Load Balancing:
   Distributes traffic across application instances through Kubernetes Services.

5. Rolling Updates:
   Deploys new application versions without requiring a complete application shutdown.

6. Service Discovery:
   Allows applications to communicate with each other using service names.

7. Resource Management:
   Schedules workloads based on available CPU and memory resources.

8. High Availability:
   Helps maintain application availability by distributing workloads across multiple nodes.

For example, consider a Node.js application running in Kubernetes.

If we configure three replicas, Kubernetes maintains three application Pods. If one Pod fails, Kubernetes can create another Pod to maintain the desired replica count.

Docker is primarily used to build and run containers, whereas Kubernetes is used to orchestrate and manage containerized applications at scale.

