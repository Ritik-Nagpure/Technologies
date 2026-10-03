# Jenkins Credentials Notes

## 🔑 Declarative Pipeline (credentials)

- Used inside the `environment {}` block.
- Binds a single secret (string, token, or password) to one environment variable.
- Best suited for simple secrets like API tokens or passwords.
- Secret values are masked in logs if accidentally echoed.
- Scope is **global**: the variable is available across all stages.
- Limitation: does not split username/password automatically; only one variable per credential ID.

---

## 🔑 Scripted Pipeline (withCredentials)

- Used inside a `steps {}` or `script {}` block.
- Temporarily binds credentials to environment variables for the duration of the block.
- Best suited for structured credentials (username/password pairs, secret files, SSH keys).
- You can define multiple variables (e.g., one for username, one for password).
- Scope is **local**: variables exist only inside the block.
- Supports different credential types:
  - Username/Password
  - Secret Text
  - Secret File
  - SSH Private Key

---

## 📊 Comparison Table

| Aspect              | `credentials()` (Declarative) | `withCredentials()` (Scripted) |
|---------------------|--------------------------------|--------------------------------|
| **Location**        | `environment {}` block         | `steps {}` / `script {}` block |
| **Scope**           | Global (all stages)            | Local (inside block only)      |
| **Best for**        | Single secrets (tokens, pwd)   | Structured creds (user/pass, files, SSH) |
| **Variables**       | One variable per credential    | Multiple variables (custom names) |
| **Flexibility**     | Limited                        | High (supports many types)     |
| **Masking**         | Yes                            | Yes                            |

---

## 🚀 Interview Nuggets

- Declarative vs Scripted: `credentials()` is shorthand for simple secrets; `withCredentials()` is flexible for complex bindings.
- Scope difference: Global vs Local.
- Common pitfall: Expecting `credentials()` to split into username/password automatically — it doesn’t.
- Best practice: Never echo secrets directly; use them only in commands.
