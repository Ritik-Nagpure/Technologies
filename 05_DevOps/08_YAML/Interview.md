# YAML Interview Questions and Answers

## 1. What is YAML and why is it used?
**Answer:**  
YAML stands for YAML Ain’t Markup Language. It is a human-readable data serialization format commonly used in configuration files for tools like Kubernetes, Docker Compose, Ansible, and CI/CD pipelines. YAML is preferred because it is easy to read, supports comments, and allows advanced features like anchors and aliases.

---

## 2. What are the key features of YAML?
**Answer:**
- Indentation-based hierarchy (spaces only, no tabs)  
- Key-value pairs for mapping data  
- Lists for ordered collections  
- Scalars for primitive values (string, int, bool, float)  
- Comments with #  
- Supports anchors and aliases for reusability  

---

## 3. Show basic YAML syntax with examples.
**Answer:**
```yaml
Key-value:  
name: Copilot  
age: 2  

List:  
fruits:  
  - apple  
  - banana  
  - mango  

Nested dictionary:  
person:  
  name: Alice  
  contact:  
    email: alice@example.com  
    phone: 123456789  
```
---

## 4. What data types does YAML support?
**Answer:**  
- Strings: "hello" or 'hello'  
- Numbers: 42, 3.14  
- Booleans: true, false  
- Null: null or ~  
- Dates: 2026-01-15  

## 5. Explain anchors and aliases in YAML.
**Answer:**  
Anchors (&) define reusable content, and aliases (*) reference it.  

```yaml
default: &default  
  retries: 3  
  timeout: 30  

service1:  
  <<: *default  
  url: http://example.com  
```
---

## 6. How do you represent multiline strings in YAML?
**Answer:**  
- Literal style (|) preserves line breaks:  
```yaml
description: |  
  This is a multiline  
  string with preserved  
  line breaks.  
```
- Folded style (>) converts newlines into spaces:  

```yaml
folded: >  
  This is a folded  
  string (newlines become spaces).  
```
---

## 7. What are common pitfalls in YAML?
**Answer:**  
- Misaligned indentation → parsing errors  
- Using tabs instead of spaces  
- Forgetting quotes around special characters (: or #)  
- Mixing JSON and YAML styles incorrectly  
- Assuming order in mappings (unordered by spec)  

---

## 8. Compare YAML and JSON.
**Answer:**

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

## 9. What are the disadvantages of YAML?
**Answer:**  
- Error-prone indentation (spaces only)  
- Lack of type safety (auto-converts values like yes → true)  
- Complexity with anchors/aliases  
- Security risks if unsafe parsing enabled  
- Slower parsing compared to JSON  
- Harder validation programmatically  

---

## 10. Why does Kubernetes prefer YAML over JSON?
**Answer:**  
Kubernetes uses YAML because it is easier for humans to read and write, supports comments for documentation, and allows reusability with anchors and aliases. JSON is stricter and better for APIs, but YAML is more practical for complex infrastructure configurations.
