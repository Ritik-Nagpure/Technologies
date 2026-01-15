# YAML Notes 📝

## 1. Introduction
- YAML = YAML Ain’t Markup Language
- Human-readable data serialization format
- Commonly used in configuration files (Kubernetes, Docker Compose, Ansible, CI/CD pipelines)
- Superset of JSON → any valid JSON is valid YAML

---

## 2. Key Features
- Indentation-based hierarchy (spaces only, no tabs)
- Key-value pairs for mapping data
- Lists for ordered collections
- Scalars for primitive values (string, int, bool, float)
- Comments with #

---

## 3. Basic Syntax Examples

```yaml
# Key-value
name: Copilot
age: 2

# List
fruits:
  - apple
  - banana
  - mango

# Nested dictionary
person:
  name: Alice
  contact:
    email: alice@example.com
    phone: 123456789
```
---

## 4. Data Types
- Strings: "hello" or 'hello' (quotes optional unless special chars)
- Numbers: 42, 3.14
- Booleans: true, false
- Null: null or ~
- Dates: 2026-01-15

---

## 5. Advanced Features
Anchors & Aliases (reusability):
```yaml
default: &default
  retries: 3
  timeout: 30

service1:
  <<: *default
  url: http://example.com
```
Multiline strings:
```yaml
description: |
  This is a multiline
  string with preserved
  line breaks.
```
```yaml
folded: >
  This is a folded
  string (newlines become spaces).
```
Complex keys:
```yaml
? [name, age]
: [Alice, 25]
```
---

## 6. Best Practices
- Always use spaces, not tabs
- Maintain consistent indentation (usually 2 spaces)
- Use anchors for DRY configs
- Validate YAML with tools (yamllint, kubectl apply --dry-run)
- Keep configs modular and readable

---

## 7. Common Pitfalls
- Misaligned indentation → parsing errors
- Using tabs → invalid YAML
- Forgetting quotes around special characters (: or #)
- Mixing JSON and YAML styles incorrectly
- Assuming order in mappings (unordered by spec)

---

## 8. YAML vs JSON

| Feature              | YAML                                | JSON                          |
|----------------------|-------------------------------------|-------------------------------|
| Readability          | Human-friendly, indentation-based   | Machine-friendly, strict      |
| Comments             | Supported (#)                       | Not supported                 |
| Verbosity            | Less verbose                        | More verbose                  |
| Reusability          | Anchors & aliases                   | Not available                 |
| Multiline Strings    | Supported (|, >)                    | Not supported                 |
| Validation           | Harder to validate programmatically | Easy to validate programmatically |
| Usage                | Config files, IaC, DevOps           | APIs, web data exchange       |

---

## 9. Real-World Usage
- Kubernetes: Pods, Deployments, Services defined in YAML
- Docker Compose: Multi-container setups
- CI/CD: GitHub Actions, Azure Pipelines configs
- Ansible: Playbooks

---

## 10. Cons of YAML
- Error-prone indentation (spaces only)
- Lack of type safety (auto-converts values like yes → true)
- Complexity with anchors/aliases
- Security risks if unsafe parsing enabled
- Slower parsing compared to JSON
- Harder validation programmatically
