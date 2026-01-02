## Parameterised Pipeline

A parameterized pipeline in Jenkins lets you pass values into your pipeline at runtime, so you can customize builds without editing the Jenkinsfile each time. This is especially useful for things like choosing a branch, environment, or version number.

1. Declaration

    ```groovy
    pipeline {
        agent any

        parameters {
            booleanParam(defaultValue : false, description: 'Enable Service ?', name : 'boolin')
        }

        stages {
            stage('Echo Boolean Input') {
                steps{
                    echo "booleanParam is set to ${params.boolin}"
                }
            }
        }
    }
    ```

2. How It Works
    - parameters {} block defines inputs available when you trigger the pipeline.
    - Jenkins UI will show fields for each parameter when you click Build with Parameters.
    - Reference parameters using params.PARAM_NAME inside pipeline.

3. Common Parameter Types
    - **string** → free text input  
        - Example: branch name, version number, environment identifier.  
        - Flexible but single-line only.

    - **text** → multiline text input  
        - Example: JSON/YAML configs, SQL queries, release notes.  
        - Useful when you need multi-line values.

    - **choice** → dropdown list of predefined options  
        - Example: `dev`, `staging`, `prod`.  
        - Ensures controlled input values.

    - **booleanParam** → checkbox for true/false  
        - Example: enable/disable tests, toggle debug mode.  
        - Simple binary decision.

    - **password** → hidden input for sensitive values  
        - Example: API keys, database passwords.  
        - Input is masked for security.

    - **file** → upload a file to the build  
        - Example: configuration file, dataset, certificate.  
        - File is stored and accessible during the job.

    - **run** → select a specific build from another job  
        - Example: deploy based on a particular build.  
        - Useful for chaining jobs.

    - **node** → choose which Jenkins agent/node to run on  
        - Example: run on Linux vs. Windows agent.  
        - Helps control execution environment.

    - Why Parameters Matter:
        - **Flexibility:** Adapt jobs to different inputs without editing code.  
        - **Reusability:** One pipeline can serve multiple environments.  
        - **Security:** Password parameters keep sensitive data hidden.  
        - **Automation:** Parameters streamline CI/CD workflows.  


4. **Notes** :
    - use build with parameters to check and use parameters and change value if needed.
    - use parameters section under build to check which parameter was used while building this pipeline.
    - 