# Jenkins Variables Notes

## 1. Built-in Environment Variables
- Predefined by Jenkins
- Available in all jobs
- Always strings
- Examples:
  - `BUILD_NUMBER` → current build number
  - `JOB_NAME` → job name
  - `WORKSPACE` → workspace path
  - `NODE_NAME` → agent name

## 2. User-defined Environment Variables
- Declared in `environment { }`
- Global to pipeline
- Always strings
- Access via `env.VAR_NAME`
- Convert if needed (`toInteger()`, `toBoolean()`)

- **Notes**:
    - user-defined variables inside the environment { } block are always treated as strings
    - The environment block is designed to set environment variables, which by definition are strings in the underlying OS.
    - Jenkins doesn’t allow type declarations (int, boolean) in environment { }.
    - Even if you write NUM = 10 or BOOL = true, Jenkins will store them as "10" and "true" (strings).

## 3. Local Script Variables
- Declared in `script { }`
- Scoped to stage/step
- Can be typed (`String`, `int`, `boolean`)
- More flexible than environment vars
- Example:
  ```groovy
  script {
      def branch = "develop"
      int retries = 3
      boolean runTests = true
  }
