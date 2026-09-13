$ErrorActionPreference = 'Stop'

function New-File { param([string]$Path,[string]$Content)
    $dir = Split-Path -Path $Path -Parent
    if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    Set-Content -Path $Path -Value $Content -Encoding UTF8
}
function New-Folder { param([string]$Path)
    if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Force -Path $Path | Out-Null }
}

# ---------- ROOT ----------
New-File "00 - Master Map.md" "               "# Master Map`n`n> The whole landscape. Written first."
New-File "00 - Master Learning Path.md"        "# Master Learning Path`n`nPhase 1 -> Phase 2 -> Phase 3"

# ================================================================
# PHASE 1 - THE STACK
# ================================================================
New-File "PHASE 1 - THE STACK/index.md" @"
# Phase 1 — The Stack

Learn each technology in depth before moving on.

## Order
1. [[01 - Computer Science/index|Computer Science]]
2. [[02 - Software Development/index|Software Development]]
3. [[03 - Languages/index|Languages]] — JavaScript, TypeScript
4. [[04 - Frontend/index|Frontend]] — React, Next.js, Ecosystem
5. [[05 - Backend/index|Backend]] — Node, Express, APIs, Auth, ORMs, Messaging, Caching, Observability
6. [[06 - Databases/index|Databases]] — PostgreSQL, MongoDB, Redis
7. [[07 - DevOps/index|DevOps]] — Git, Docker, Kubernetes, CI/CD, AWS
"@

# 01 Computer Science
New-File "PHASE 1 - THE STACK/01 - Computer Science/index.md" @"
# Computer Science

> Content written when we reach this topic.

## Planned Files (grown as content is written)
- 01 - Fundamentals
- 02 - Branches of Computer Science
- 03 - CS vs Software Engineering
- 04 - Core Mental Models
- 05 - How Software Systems Fit Together
- 06 - Internet and Runtime Landscape
- 07 - Engineering Disciplines Overview
- 08 - Industry and Career
- 09 - Interview Q&A
- 10 - Mastery Checklist
"@

# 02 Software Development
New-File "PHASE 1 - THE STACK/02 - Software Development/index.md" "# Software Development`n`n> Content written when we reach this topic."

# 03 Languages
New-File "PHASE 1 - THE STACK/03 - Languages/index.md" @"
# Languages

- [[JavaScript/index|JavaScript]]
- [[TypeScript/index|TypeScript]]
"@
New-File "PHASE 1 - THE STACK/03 - Languages/JavaScript/index.md" "# JavaScript`n`n> Content written when we reach this topic."
New-File "PHASE 1 - THE STACK/03 - Languages/TypeScript/index.md" "# TypeScript`n`n> Content written when we reach this topic."

# 04 Frontend
New-File "PHASE 1 - THE STACK/04 - Frontend/index.md" @"
# Frontend

- [[React/index|React]]
- [[Next.js/index|Next.js]]
- [[Ecosystem/index|Ecosystem]]
"@
New-File "PHASE 1 - THE STACK/04 - Frontend/React/index.md" "# React`n`n> Content written when we reach this topic."
New-File "PHASE 1 - THE STACK/04 - Frontend/Next.js/index.md" "# Next.js`n`n> Content written when we reach this topic."
New-File "PHASE 1 - THE STACK/04 - Frontend/Ecosystem/index.md" @"
# Frontend Ecosystem

## State Management
- Redux Toolkit
- Zustand
- Jotai

## Forms
- React Hook Form
- Formik
- TanStack Form

## Validation
- Zod
- Yup

## Routing
- React Router DOM
- TanStack Router

## Data Fetching
- TanStack Query
- SWR
- RTK Query

## Tables
- TanStack Table
- AG Grid

## Styling
- Tailwind CSS
- Sass
- CSS Modules
- styled-components

## UI Libraries
- shadcn-ui
- Radix UI
- Material UI
- Chakra UI

## Icons
- react-icons
- lucide-react

## Animation
- Framer Motion
- GSAP

## Charts
- Recharts
- Chart.js

## Virtualization
- TanStack Virtual

## Drag and Drop
- dnd-kit

## Rich Text
- TipTap

## Notifications
- sonner
- react-hot-toast

## i18n
- i18next

## Date
- date-fns
- dayjs

## File Upload
- react-dropzone

## Testing
- Vitest
- Jest
- React Testing Library
- Playwright
- Cypress
- MSW

## Linting
- ESLint
- Prettier
- Biome

## Bundlers
- Vite
- Webpack
- Turbopack

## Monorepo
- Turborepo
- Nx

## Error Tracking
- Sentry

> Each library becomes its own file when written. Not before.
"@

# 05 Backend
New-File "PHASE 1 - THE STACK/05 - Backend/index.md" @"
# Backend

- [[Node.js/index|Node.js]]
- [[Express.js/index|Express.js]]
- [[NestJS/index|NestJS]]
- [[Fastify/index|Fastify]]
- [[APIs/index|APIs]]
- [[Auth/index|Auth]]
- [[ORMs/index|ORMs]]
- [[Messaging/index|Messaging]]
- [[Caching/index|Caching]]
- [[Observability/index|Observability]]
- [[Cross-Cutting/index|Cross-Cutting]]
"@

New-File "PHASE 1 - THE STACK/05 - Backend/Node.js/index.md"    "# Node.js`n`n> Content written when we reach this topic."
New-File "PHASE 1 - THE STACK/05 - Backend/Express.js/index.md" "# Express.js`n`n> Content written when we reach this topic."
New-File "PHASE 1 - THE STACK/05 - Backend/NestJS/index.md"     "# NestJS`n`n> Content written when we reach this topic."
New-File "PHASE 1 - THE STACK/05 - Backend/Fastify/index.md"    "# Fastify`n`n> Content written when we reach this topic."

New-File "PHASE 1 - THE STACK/05 - Backend/APIs/index.md" @"
# APIs

- REST
- GraphQL
- gRPC
- tRPC
- WebSockets
- Server-Sent Events
- Webhooks
- OpenAPI / Swagger
"@

New-File "PHASE 1 - THE STACK/05 - Backend/Auth/index.md" @"
# Auth

- Sessions
- JWT
- OAuth 2.0
- OIDC
- RBAC / ABAC
"@

New-File "PHASE 1 - THE STACK/05 - Backend/ORMs/index.md" @"
# ORMs

- Prisma
- Drizzle
- TypeORM
- Sequelize
- Knex
- Mongoose
"@

New-File "PHASE 1 - THE STACK/05 - Backend/Messaging/index.md" @"
# Messaging

- Kafka
- RabbitMQ
- Redis Pub/Sub
- NATS
- BullMQ
"@

New-File "PHASE 1 - THE STACK/05 - Backend/Caching/index.md" @"
# Caching

- Redis
- Cache Strategies
"@

New-File "PHASE 1 - THE STACK/05 - Backend/Observability/index.md" @"
# Observability

- Winston
- Pino
- Prometheus + Grafana
- OpenTelemetry
- ELK Stack
- Sentry
"@

New-File "PHASE 1 - THE STACK/05 - Backend/Cross-Cutting/index.md" @"
# Cross-Cutting

- Multer (File Upload)
- Nodemailer
- Stripe
- Elasticsearch
- S3 / MinIO
- Rate Limiting
- Circuit Breaker
- Graceful Shutdown
"@

# 06 Databases
New-File "PHASE 1 - THE STACK/06 - Databases/index.md" @"
# Databases

## Deep Topics (own folder)
- [[PostgreSQL/index|PostgreSQL]]
- [[MongoDB/index|MongoDB]]
- [[Redis/index|Redis]]

## Others (single file when written)
- MySQL
- SQLite
- Elasticsearch
- Cassandra
- DynamoDB
- ClickHouse
"@
New-File "PHASE 1 - THE STACK/06 - Databases/PostgreSQL/index.md" "# PostgreSQL`n`n> Content written when we reach this topic."
New-File "PHASE 1 - THE STACK/06 - Databases/MongoDB/index.md"    "# MongoDB`n`n> Content written when we reach this topic."
New-File "PHASE 1 - THE STACK/06 - Databases/Redis/index.md"      "# Redis`n`n> Content written when we reach this topic."

# 07 DevOps
New-File "PHASE 1 - THE STACK/07 - DevOps/index.md" @"
# DevOps

## Deep Topics (own folder)
- [[Git/index|Git]]
- [[Docker/index|Docker]]
- [[Kubernetes/index|Kubernetes]]

## Others (single file when written)
- GitHub Actions
- GitLab CI
- Terraform
- Ansible
- Nginx
- ArgoCD
- Vault
- AWS
- GCP
- Azure
- Serverless
- CDN and Edge
"@
New-File "PHASE 1 - THE STACK/07 - DevOps/Git/index.md"        "# Git`n`n> Content written when we reach this topic."
New-File "PHASE 1 - THE STACK/07 - DevOps/Docker/index.md"     "# Docker`n`n> Content written when we reach this topic."
New-File "PHASE 1 - THE STACK/07 - DevOps/Kubernetes/index.md" "# Kubernetes`n`n> Content written when we reach this topic."

# ================================================================
# PHASE 2 - THE DISCIPLINES
# ================================================================
New-File "PHASE 2 - THE DISCIPLINES/index.md" @"
# Phase 2 — The Disciplines

Principles on top of the stack.

## Order
1. [[01 - DSA/index|DSA]]
2. [[02 - Design Patterns/index|Design Patterns]]
3. [[03 - Architecture Patterns/index|Architecture Patterns]]
4. [[04 - SDLC/index|SDLC]]
5. [[05 - LLD/index|LLD]]
6. [[06 - HLD/index|HLD]]
7. [[07 - System Design/index|System Design]]
"@

New-File "PHASE 2 - THE DISCIPLINES/01 - DSA/index.md"                   "# DSA`n`n> Content written when we reach this topic."
New-File "PHASE 2 - THE DISCIPLINES/02 - Design Patterns/index.md"       "# Design Patterns`n`n> Content written when we reach this topic."
New-File "PHASE 2 - THE DISCIPLINES/03 - Architecture Patterns/index.md" "# Architecture Patterns`n`n> Content written when we reach this topic."
New-File "PHASE 2 - THE DISCIPLINES/04 - SDLC/index.md"                  "# SDLC`n`n> Content written when we reach this topic."
New-File "PHASE 2 - THE DISCIPLINES/05 - LLD/index.md"                   "# LLD`n`n> Content written when we reach this topic."
New-File "PHASE 2 - THE DISCIPLINES/06 - HLD/index.md"                   "# HLD`n`n> Content written when we reach this topic."
New-File "PHASE 2 - THE DISCIPLINES/07 - System Design/index.md"         "# System Design`n`n> Content written when we reach this topic."

# ================================================================
# PHASE 3 - SYNTHESIS
# ================================================================
New-File "PHASE 3 - SYNTHESIS/index.md" @"
# Phase 3 — Synthesis

How everything fits together.

- [[01 - The Full Picture/index|The Full Picture]]
- [[02 - Build an Enterprise/index|Build an Enterprise]]
- [[03 - Interview Readiness/index|Interview Readiness]]
"@

New-File "PHASE 3 - SYNTHESIS/01 - The Full Picture/index.md"      "# The Full Picture`n`n> Content written when we reach this topic."
New-File "PHASE 3 - SYNTHESIS/02 - Build an Enterprise/index.md"   "# Build an Enterprise`n`n> Content written when we reach this topic."
New-File "PHASE 3 - SYNTHESIS/03 - Interview Readiness/index.md"   "# Interview Readiness`n`n> Content written when we reach this topic."

Write-Host ""
Write-Host "Lean scaffold created." -ForegroundColor Green
Write-Host "Open Obsidian -> File -> Open Vault -> select this folder."
Write-Host ""
Write-Host "Files created:" (Get-ChildItem -Recurse -Filter *.md).Count