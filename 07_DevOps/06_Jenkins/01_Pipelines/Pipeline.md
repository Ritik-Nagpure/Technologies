# Pipelines

A pipeline in Jenkins is a set of automated steps (build, test, deploy, etc.) defined in code (usually a Jenkinsfile). It’s the backbone of CI/CD in Jenkins.
- Automated process for CI/CD
- Defines build, test, deploy stages
- Written in `Jenkinsfile` (Groovy syntax)



## Types of Pipelines

1. Declarative Pipeline

    - Easier syntax, structured with pipeline { }.
    - Basic Node.js Jenkinsfile Example

    ```groovy
        pipeline {
            agent any
            stages {
                stage('Clean Up') {
                    steps {
                        deleteDir()
                    }
                }
                stage('Clone Repo') {
                    steps {
                        sh 'git clone https://github.com/Ritik-Nagpure/tests.git'
                    }
                }
                stage('Build') {
                    steps {
                        dir('tests') {
                            sh 'node -v'
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
                stage('Test') {
                    steps {
                        dir('tests') {
                            sh 'npm run test'
                        }
                    }
                }
            }

            post {
                success {
                    echo 'Pipeline executed successfully!'
                }
                failure {
                    echo 'Pipeline failed!'
                }
            }
        }
    ```

2. Scripted Pipeline
    - More flexible, written in Groovy.

    ```groovy
    node {
        stage('Build') {
            sh 'npm install'
        }
        stage('Test') {
            sh 'npm test'
        }
    }
    ```

## Blocks of a Jenkins Pipeline

## 1. Agent Block

- What is Agent?

  - Defines **where** the pipeline runs
  - Specifies environment (Node.js, Docker, Linux, Windows)
  - Can be global (for entire pipeline) or local (per stage)

- Types of Agent

  - **any** → Runs on any available Jenkins node
  - **kubernetes** → Runs inside Kubernetes pods ```groovy
  - **dockerfile** → Builds and runs from a Dockerfile in repo
  - **none** → No global agent; each stage must define its own
  - **docker** → Runs inside a Docker container
  - **label** → Runs on nodes with a specific label

  ```groovy
  agent any
  agent none
  agent { label 'linux' }
  agent { docker { image 'node:18' } }
  agent { dockerfile true }
  agent { kubernetes { yaml 'pod.yaml' } }
  ```

## 2. Stages Block

- Defines a **major step** in the pipeline
- Groups related tasks (build, test, deploy)
- Helps visualize progress in Jenkins UI
- Each stage contains **steps** (actual commands)

```groovy
stages {
    stage('Build') {
        steps {
            sh 'npm install'
        }
    }
}
```

## 3. Steps Block

- Defines the **actual commands** to run inside a stage
- Executes shell commands, scripts, or Jenkins plugins
- Smallest unit of work in a pipeline

```groovy
steps {
    sh 'npm test'
}
```

## 4. Post Block

- Defines actions that run **after the pipeline or stage finishes**
- Used for notifications, cleanup, or logging
- Can handle **success**, **failure**, or **always** conditions

```groovy
post {
    success { echo 'Pipeline executed successfully!' }
    failure { echo 'Pipeline failed!' }
    always  { echo 'Pipeline finished!' }
}
```

## 5. Environment Block (Optional)

- Used to define **environment variables** for the pipeline
- Variables can be global (for entire pipeline) or local (per stage)
- Helps manage secrets, configuration, and runtime settings

```groovy
environment {
    NODE_ENV = 'production'
}
```

## 6. Tools Block (Optional)

- Defines **build tools** required for the pipeline
- Jenkins automatically installs and configures these tools
- Useful for Node.js, Maven, JDK, Gradle,

```groovy
tools {
    nodejs 'NodeJS_18'
}
```

## Pipeline Triggers

Triggers in Jenkins define **when and how** a pipeline should start automatically. They eliminate the need for manual builds and are essential for continuous integration and delivery.

- Types of Triggers

  - **SCM Trigger**
    Runs pipeline when code changes are pushed to the repository.

    ```groovy
    triggers {
        pollSCM('* * * * *')   // checks repo every minute
    }
    ```

  - **Cron/Scheduled Trigger**
    Runs pipeline at specific times using cron syntax.

    ```groovy
    triggers {
        cron('H 2 * * 1-5')   // run at 2 AM, Mon-Fri
    }
    ```

  - **Upstream Trigger**
    Runs pipeline after another job completes.

    ```groovy
    triggers {
        upstream('OtherJob', 'SUCCESS')
    }
    ```

  - **GitHub Push Trigger**
    Runs pipeline when a GitHub repository receives a push event.

    ```groovy
    triggers {
        githubPush()
    }
    ```

  - **Bitbucket Trigger**
    Runs pipeline when a Bitbucket repository receives changes.

            ```groovy
            triggers {
                bitbucketPush()
            }
            ```

    - Best Practices

      - Use **SCM triggers** for continuous integration on code commits.
      - Use **cron triggers** for nightly builds or scheduled jobs.
      - Use **upstream triggers** for dependent pipelines.
      - Integrate **GitHub/Bitbucket triggers** for repo event-driven automation.
