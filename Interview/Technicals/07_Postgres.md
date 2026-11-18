
# A. Aggregation pipeline

## 1. What is an Aggregation Pipeline?

An Aggregation Pipeline is a MongoDB feature used to process, transform, filter, and analyze documents through multiple sequential stages.

Each stage performs a specific operation and passes its output to the next stage.

Common aggregation stages:

1. $match - Filters documents based on conditions.
2. $project - Selects or modifies fields.
3. $group - Groups documents and performs calculations.
4. $sort - Sorts documents.
5. $limit - Limits the number of documents.
6. $skip - Skips a specified number of documents.
7. $lookup - Performs a join-like operation between collections.
8. $unwind - Deconstructs an array into individual documents.

```javascript
db.orders.aggregate([
    {
        $match: {
            status: "completed"
        }
    },
    {
        $group: {
            _id: "$customerId",
            totalAmount: {
                $sum: "$amount"
            }
        }
    },
    {
        $sort: {
            totalAmount: -1
        }
    }
]);
```

Here, we filter completed orders, group them by customer, calculate the total order amount, and sort customers by their spending.

## 2. Where have you used the Aggregation Pipeline?

I have worked with MongoDB and Mongoose in backend development.

I use aggregation pipelines when working with complex data retrieval and reporting requirements where we need to filter, group, transform, and calculate data across multiple collections.

For instance, in an application involving users and orders, we can use aggregation to calculate total orders, total spending, and customer-wise statistics.

I would use $match, $group, $project, and $lookup depending on the requirement.

## 3. What is the use of the Aggregation Pipeline?

The main purpose of an Aggregation Pipeline is to perform complex data processing directly within the database instead of retrieving all documents into the application and processing them using JavaScript.

Major use cases:

1. Data Filtering - Retrieve documents based on specific conditions.
2. Data Grouping - Group records based on common fields.
3. Data Analysis - Calculate sum, average, minimum, and maximum values.
4. Data Transformation - Modify the structure of documents.
5. Collection Joining - Combine related data using $lookup.
6. Reporting - Generate dashboards and analytical reports.
7. Pagination - Implement data retrieval using $skip and $limit.

It reduces unnecessary data transfer between the database and application and can improve performance when the pipeline is designed properly.

# B. Database fundamentals

## 4. What is the difference between MySQL and PostgreSQL?

MySQL and PostgreSQL are both relational database management systems (RDBMS), but they differ in their features, extensibility, SQL capabilities, and use cases.

1. MySQL:
   - Known for simplicity and ease of use.
   - Commonly used in web applications.
   - Supports relational database operations.
   - Supports transactions using the InnoDB storage engine.
   - Has a large ecosystem and community.

2. PostgreSQL:
   - An advanced open-source relational database.
   - Supports complex queries and advanced SQL features.
   - Provides strong support for JSON and JSONB.
   - Supports custom data types and extensions.
   - Provides advanced indexing options.
   - Supports complex analytical and transactional workloads.

Comparison:

Feature              MySQL                  PostgreSQL

Type                 RDBMS                  Object-relational DBMS
JSON                 JSON                   JSON and JSONB
Indexing             Multiple types         Advanced indexing options
Extensibility        More limited           Highly extensible
Complex queries      Supported              Extensive SQL capabilities
Transactions         InnoDB                 MVCC-based transactions

I prefer PostgreSQL for enterprise applications where complex queries, relational integrity, advanced indexing, and data consistency are important.

## 5. Why do we have different types of databases?

We have different types of databases because applications have different data storage, access, performance, consistency, and scalability requirements.

A single database technology cannot efficiently satisfy every workload.

Major database categories:

1. Relational Databases (SQL):
   - Store structured data in tables.
   - Support relationships, constraints, and transactions.
   - Examples: PostgreSQL, MySQL, Oracle, SQL Server.

2. Document Databases:
   - Store data in flexible document formats.
   - Useful for semi-structured and evolving data.
   - Examples: MongoDB, CouchDB.

3. Key-Value Databases:
   - Store data as key-value pairs.
   - Useful for caching and fast lookups.
   - Examples: Redis, Amazon DynamoDB.

4. Wide-Column Databases:
   - Store data using column families.
   - Useful for large distributed datasets.
   - Examples: Cassandra, HBase.

5. Graph Databases:
   - Store data as nodes and relationships.
   - Useful for highly connected data.
   - Examples: Neo4j.

6. Time-Series Databases:
   - Optimized for timestamp-based data.
   - Useful for monitoring, metrics, and IoT.
   - Examples: InfluxDB, TimescaleDB.

The database selection depends on data structure, query patterns, transaction requirements, scalability, consistency, and operational cost.

## 6. What are the differences between PostgreSQL, MySQL, MariaDB, Oracle DB, and DB2?

All five are relational database management systems, but they differ in licensing, features, enterprise capabilities, ecosystem, and intended workloads.

1. PostgreSQL:
   - Open-source relational database.
   - Supports advanced SQL queries, JSONB, extensions, and custom data types.
   - Strong support for complex transactions and data integrity.
   - Commonly used in enterprise applications and SaaS platforms.

2. MySQL:
   - Open-source database with commercial offerings.
   - Known for simplicity and broad web application adoption.
   - Supports transactions through the InnoDB engine.
   - Commonly used in web applications and content management systems.

3. MariaDB:
   - Open-source database originally forked from MySQL.
   - Maintains compatibility with many MySQL applications.
   - Provides additional storage engines and features.
   - Commonly used as an alternative to MySQL.

4. Oracle Database:
   - Commercial enterprise database.
   - Provides advanced transaction management, security, partitioning, and high-availability capabilities.
   - Commonly used in large banking, financial, and enterprise systems.
   - Has significant licensing and operational costs.

5. IBM Db2:
   - Enterprise relational database developed by IBM.
   - Designed for high-volume transactional and analytical workloads.
   - Provides enterprise security, scalability, and data management capabilities.
   - Commonly used in large enterprise and IBM ecosystem environments.

Comparison:

Database       Licensing             Common Strength

PostgreSQL     Open-source           Advanced SQL and extensibility
MySQL          Open-source/commercial Web application workloads
MariaDB        Open-source           MySQL compatibility and flexibility
Oracle DB      Commercial            Enterprise database capabilities
IBM Db2        Commercial            Enterprise transactional workloads

The choice depends on application requirements, existing infrastructure, licensing costs, performance needs, and operational expertise.

# C. SQL queries

## 7. Write a SQL query to find the second-highest salary from an Employee table.

We can use a subquery or window functions to find the second-highest distinct salary.

Using a subquery:

```sql
SELECT MAX(salary) AS second_highest_salary
FROM Employee
WHERE salary < (
    SELECT MAX(salary)
    FROM Employee
);
```

Using DENSE_RANK():

```sql
SELECT salary
FROM (
    SELECT
        salary,
        DENSE_RANK() OVER (
            ORDER BY salary DESC
        ) AS salary_rank
    FROM Employee
) AS ranked
WHERE salary_rank = 2;
```

Explanation:

1. The inner query assigns a rank to each salary.
2. DENSE_RANK() assigns the same rank to duplicate salaries.
3. The highest salary receives rank 1.
4. The second-highest distinct salary receives rank 2.
5. The outer query retrieves the salary having rank 2.

I prefer DENSE_RANK() when working with ranking-based queries because it handles duplicate salaries correctly.

## 8. How do you insert multiple rows into a database using a single SQL query?

We can use the INSERT INTO statement with multiple VALUES clauses to insert multiple records in a single query.

```sql
INSERT INTO Employee (
    id,
    name,
    salary,
    department
)
VALUES
    (1, 'Ritik', 60000, 'IT'),
    (2, 'Rahul', 55000, 'HR'),
    (3, 'Amit', 65000, 'Finance'),
    (4, 'Priya', 70000, 'IT');
```

Here, multiple employee records are inserted using a single INSERT statement.

Benefits:

1. Reduces the number of database round trips.
2. Improves insertion efficiency.
3. Reduces application-to-database communication overhead.
4. Can be executed within a transaction for atomicity.

# D. Joins and relationships

## 9. What is a LEFT JOIN?

A LEFT JOIN is used to retrieve all records from the left table and matching records from the right table.

If there is no matching record in the right table, the result contains NULL values for the right table's columns.

Consider two tables:

Employee:

| id | name |
|---|---|
| 1 | Ritik |
| 2 | Rahul |
| 3 | Amit |

Department:

| id | department |
|---|---|
| 1 | IT |
| 2 | HR |

SQL query:

```sql
SELECT
    Employee.name,
    Department.department
FROM Employee
LEFT JOIN Department
ON Employee.id = Department.id;
```

Output:

| name | department |
|---|---|
| Ritik | IT |
| Rahul | HR |
| Amit | NULL |

Here, all employees are returned, even if they do not have a matching department record.

## 10. What is a Primary Key?

A Primary Key is a column or combination of columns that uniquely identifies each record in a database table.

Important characteristics:

1. Every primary key value must be unique.
2. It cannot contain NULL values.
3. A table can have only one primary key constraint.
4. A primary key can consist of multiple columns, known as a composite primary key.
5. It helps maintain entity integrity.

SQL implementation:

```sql
CREATE TABLE Employee (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10, 2)
);
```

Here, id uniquely identifies every employee record.

## 11. What is a Foreign Key?

A Foreign Key is a column or combination of columns in one table that references a candidate key, usually the primary key, in another table.

It establishes relationships between tables and helps maintain referential integrity.

SQL implementation:

```sql
CREATE TABLE Department (
    id INT PRIMARY KEY,
    department_name VARCHAR(100)
);

CREATE TABLE Employee (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT,

    FOREIGN KEY (department_id)
    REFERENCES Department(id)
);
```

Here, department_id in the Employee table references the id column in the Department table.

## 12. What is the purpose of a Foreign Key?

The primary purpose of a Foreign Key is to maintain referential integrity between related database tables.

Major benefits:

1. Relationship Management:
   Establishes relationships between tables.

2. Data Integrity:
   Prevents references to non-existent parent records.

3. Consistency:
   Maintains consistency between related records.

4. Cascading Operations:
   Supports ON DELETE CASCADE and ON UPDATE CASCADE when configured.

5. Prevents Invalid Data:
   Ensures that referenced records exist when inserting or updating foreign key values.

Example:

```sql
CREATE TABLE Department (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE Employee (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT,

    FOREIGN KEY (department_id)
    REFERENCES Department(id)
    ON DELETE CASCADE
);
```

Here, if a department is deleted, all associated employee records are also deleted because ON DELETE CASCADE is configured.

In production, cascading deletes should be used carefully because they can remove multiple dependent records.

# E. Database performance

## 13. What are indexes in a database?

An index is a database data structure that helps retrieve records faster without scanning the entire table.

It works similarly to an index in a book, where we can locate information without reading every page.

For example, if we have millions of employee records and frequently search employees by email, we can create an index on the email column.

```sql
CREATE INDEX idx_employee_email
ON Employee(email);
```

Common types of indexes in PostgreSQL:

1. B-tree:
   Default index type, suitable for equality and range queries.

2. Hash:
   Suitable for equality comparisons.

3. GIN:
   Useful for JSONB, arrays, and full-text search.

4. GiST:
   Useful for geometric and range-based data.

5. BRIN:
   Useful for very large tables where data has a natural physical ordering.

## 14. Why are indexes used?

Indexes are used to improve database query performance by reducing the amount of data the database needs to scan.

Major benefits:

1. Faster Data Retrieval:
   Quickly locate records without performing a full table scan.

2. Efficient Filtering:
   Improve WHERE clause performance.

3. Faster Joins:
   Improve lookup performance on join columns.

4. Sorting:
   Help optimize ORDER BY operations.

5. Uniqueness:
   Unique indexes prevent duplicate values in indexed columns.

However, indexes also have trade-offs:

1. Storage Overhead:
   Indexes consume additional disk space.

2. Write Performance:
   INSERT, UPDATE, and DELETE operations may become slower because indexes must also be maintained.

3. Maintenance:
   Indexes require monitoring and maintenance.

4. Query Planner:
   An index is not guaranteed to be used for every query.

In production, I create indexes based on actual query patterns, frequently filtered columns, join conditions, and query execution plans rather than indexing every column.
