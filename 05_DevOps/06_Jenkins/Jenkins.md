# Jenkins

## 📄 File
Jenkins doesn’t use a special file extension like .xml or .json for its pipelines. Instead, it relies on a plain text file named Jenkinsfile (with no extension).

Key points about the Jenkinsfile
 - **Name** : Always Jenkinsfile (capital J, no extension).
 - **Location** : Typically stored in the root of your project’s repository.
 - **Format** : Written in Groovy-based DSL (Declarative or Scripted Pipeline syntax).
 - **Purpose** : Defines your CI/CD pipeline steps (build, test, deploy).
 - **Version control**: Because it’s part of your repo, Jenkins automatically picks it up when jobs are triggered.


```Groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
```

##  


