# 🐳 Dockerfile Notes (Interview Cheat Sheet)

A **Dockerfile** is a text file with instructions to build a Docker image.  
Each line defines a step in the image creation process.

---

## 🔑 Core Instructions

### 1. `FROM`
- **Purpose**: Sets the base image.
- **Example**: `FROM ubuntu:20.04`
- **Note**: Always the first instruction. Can be `scratch` for empty base.

---

### 2. `LABEL`
- **Purpose**: Adds metadata (author, version, description).
- **Example**: `LABEL maintainer="ritik@example.com"`
- **Note**: Useful for documentation and automation.

---

### 3. `RUN`
- **Purpose**: Executes commands during build.
- **Example**: `RUN apt-get update && apt-get install -y python3`
- **Note**: Creates a new image layer. Combine commands to reduce layers.

---

### 4. `CMD`
- **Purpose**: Default command when container starts.
- **Example**: `CMD ["python3", "app.py"]`
- **Note**: Can be overridden at runtime (`docker run ...`).

---

### 5. `ENTRYPOINT`
- **Purpose**: Defines fixed executable for container.
- **Example**: `ENTRYPOINT ["python3", "app.py"]`
- **Note**: Works with `CMD` (CMD provides default args).

---

### 6. `COPY`
- **Purpose**: Copies files from host → image.
- **Example**: `COPY ./src /app`
- **Note**: Good for static files.

---

### 7. `ADD`
- **Purpose**: Like `COPY`, but supports remote URLs & auto‑extracts archives.
- **Example**: `ADD app.tar.gz /app`
- **Note**: Use `COPY` unless you need `ADD` features.

---

### 8. `WORKDIR`
- **Purpose**: Sets working directory inside container.
- **Example**: `WORKDIR /app`
- **Note**: Avoid using `cd` in `RUN`.

---

### 9. `ENV`
- **Purpose**: Sets environment variables.
- **Example**: `ENV APP_ENV=production`
- **Note**: Accessible inside container.

---

### 10. `ARG`
- **Purpose**: Defines build‑time variables.
- **Example**: `ARG VERSION=1.0`
- **Note**: Not available at runtime (unlike `ENV`).

---

### 11. `EXPOSE`
- **Purpose**: Documents ports the container listens on.
- **Example**: `EXPOSE 8080`
- **Note**: Doesn’t publish ports; use `-p` in `docker run`.

---

### 12. `VOLUME`
- **Purpose**: Creates mount point for persistent data.
- **Example**: `VOLUME /data`
- **Note**: Helps with data persistence.

---

### 13. `USER`
- **Purpose**: Sets user to run container processes.
- **Example**: `USER appuser`
- **Note**: Avoid running as `root` for security.

---

### 14. `HEALTHCHECK`
- **Purpose**: Defines command to test container health.
- **Example**:  
  `HEALTHCHECK CMD curl --fail http://localhost:8080 || exit 1`
- **Note**: Helps orchestrators (K8s, Swarm) detect unhealthy containers.

---

### 15. `SHELL`
- **Purpose**: Changes default shell used in `RUN`.
- **Example**: `SHELL ["powershell", "-Command"]`
- **Note**: Useful for Windows containers.

---

## 📝 Best Practices (Interview Nuggets)
- Use **small base images** (e.g., `alpine`) for efficiency.
- Combine `RUN` commands to reduce layers.
- Prefer `COPY` over `ADD` unless needed.
- Always set `WORKDIR` instead of `cd`.
- Use `ENTRYPOINT` for fixed commands, `CMD` for defaults.
- Keep images minimal → faster builds, smaller attack surface.

---

