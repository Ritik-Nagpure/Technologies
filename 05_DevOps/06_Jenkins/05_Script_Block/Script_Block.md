# Jenkins Pipeline: Script Block Refresher Notes

## 🔑 Script Block Basics

- The `script {}` block allows embedding raw Groovy code inside a Declarative pipeline.
- It is required when using control structures (`if`, `for`, `while`) or defining reusable logic.
- Without `script {}`, Declarative syntax only accepts pipeline steps (`echo`, `sh`, etc.).

## 📌 Conditional Logic

- Conditional checks (`if/else`) must be inside a `script {}` block.
- Useful for branching behavior based on parameter values or runtime conditions.
- Example use cases:
  - Checking if a number is even or odd.
  - Running different steps depending on user input.

```groovy
    stage('Conditional') {
                steps {
                    script {
                        def num = params.innum.toInteger()
                        echo 'Conditional statements Demo starts here ...'

                        if (num % 2 == 0) {
                            echo "${num} is Even"
                        } else {
                            echo "${num} is Odd"
                        }
                    }
                }
            }
```

---

## 📌 Loops

- Groovy loops (`for`, `while`) are supported inside `script {}`.
- **For loop**: iterate over a range or collection.
- **While loop**: repeat until a condition is false.
- Common use cases:
  - Iterating over test cases.
  - Repeating actions a fixed number of times.
  - Processing lists or arrays.

```groovy
    stage('Loops') {
            steps {
                script {
                    echo 'Loops Demo Starts here ...'

                    // For loop
                    for (int i = 1; i <= 5; i++) {
                        echo "Iteration number: ${i}"
                    }

                    // While loop
                    int count = 1
                    while (count <= 5) {
                        echo "Count is: ${count}"
                        count++
                    }
                }
            }
        }
```

---

## 📌 Functions

- Functions (methods or closures) allow reusable logic.
- In Declarative pipelines:
  - **Closures** can be defined inside `script {}`.
  - **Methods** should be defined at the top of the Jenkinsfile (outside `pipeline {}`) for reuse across stages.
- Functions are helpful for:

  - Encapsulating repeated checks (e.g., even/odd logic).
  - Keeping pipeline code clean and DRY (Don’t Repeat Yourself).

- **Methods**

  ```groovy
      def checkEvenOdd(num) {
          if (num % 2 == 0) {
              echo "${num} is Even"
                              } else {
              echo "${num} is Odd"
          }
      }

      stage('Functions') {
              steps {
                  script {
                      echo 'Functions Demo Starts here ...'

                      checkEvenOdd(5)
                      checkEvenOdd(10)
                  }
              }
          }
  ```

- **Closure**

  ```groovy
      stage('Closure Functions Demo') {
          steps {
              script {
                  echo 'Closure demo starts here...'

                  // Define a closure (anonymous function)
                  def checkEvenOdd_closure = { num ->
                      if (num % 2 == 0) {
                          echo "${num} is Even"
                      } else {
                          echo "${num} is Odd"
                      }
                  }

                  // Call the closure
                  checkEvenOdd_closure(5)
                  checkEvenOdd_closure(10)

                  // Another closure example: square a number
                  def square = { x -> x * x }
                  echo "Square of 4 is: ${square(4)}"
              }
          }
      }
  ```

---

## 📌 Stages Overview

- **Conditional Stage**: Demonstrates `if/else` logic.
- **Loops Stage**: Demonstrates `for` and `while` loops.
- **Functions Stage**: Demonstrates calling a reusable function for repeated logic.

---

## 🚀 Interview Nuggets

- **Declarative vs Scripted**: Declarative is structured; Scripted (`script {}`) gives full Groovy flexibility.
- **When to use `script {}`**: Any time you need Groovy logic beyond simple pipeline steps.
- **Best practice**: Keep Groovy logic inside `script {}` blocks, but define reusable methods at the top level for clarity.
- **Common pitfalls**:
  - Defining methods directly inside `steps {}` → compilation error.
  - Forgetting to wrap control structures in `script {}` → pipeline fails.
