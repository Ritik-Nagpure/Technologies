

## 🔄 Lifecycle
- **Pod Lifecycle**: Pending → Running → Succeeded/Failed.
- **Init Containers**: Run before main containers.
- **Probes**:
  - Liveness Probe: Checks if container is alive.
  - Readiness Probe: Checks if container is ready to serve traffic.
  - Startup Probe: Checks if container has started.

---

## 🛡️ Security
- **RBAC (Role-Based Access Control)**: Manage permissions.
- **Service Accounts**: Provide identity to pods.
- **Network Policies**: Restrict communication.
- **Secrets**: Store sensitive data securely.
- **Pod Security Standards (PSS)**: Define security levels.

---

## 📊 Monitoring & Logging
- **Metrics Server**: Provides resource usage metrics.
- **kubectl top**: View resource usage.
- **Logging**: stdout/stderr, integrated with tools like Fluentd, ELK, Prometheus, Grafana.

---

## ⚙️ Tools & Ecosystem
- **kubectl**: CLI tool for Kubernetes.
- **Helm**: Package manager for Kubernetes.
- **Kustomize**: Template-free configuration customization.
- **Operators**: Automate complex application management.
- **Dashboard**: Web UI for Kubernetes.

---

## 🔧 Deployment Strategies
- **Rolling Update**: Gradual replacement of pods.
- **Recreate**: Kill all old pods, then create new ones.
- **Blue-Green Deployment**: Two environments, switch traffic.
- **Canary Deployment**: Gradual rollout to subset of users.

---

## ☁️ Cloud & Hybrid
- **Managed Kubernetes Services**:
  - GKE (Google Kubernetes Engine)
  - EKS (Amazon Elastic Kubernetes Service)
  - AKS (Azure Kubernetes Service)
- **On-Prem Solutions**:
  - OpenShift
  - Rancher
  - VMware Tanzu

---

## 📚 Best Practices
- Use namespaces for isolation.
- Apply resource requests and limits.
- Use ConfigMaps and Secrets for configuration.
- Implement health probes.
- Monitor with Prometheus/Grafana.
- Secure with RBAC and Network Policies.
- Automate deployments with CI/CD.

---

## 📝 Common Commands
- `kubectl get pods` – List pods.
- `kubectl describe pod <name>` – Pod details.
- `kubectl apply -f <file>.yaml` – Apply configuration.
- `kubectl delete pod <name>` – Delete pod.
- `kubectl logs <pod>` – View logs.
- `kubectl exec -it <pod> -- /bin/sh` – Access pod shell.

---

## 🧩 YAML Manifest Structure
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mycontainer
    image: nginx
