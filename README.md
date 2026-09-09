# 🛒 FLASHSTORE

### Scalable Cloud-Native E-Commerce Platform

**FlashStore** is a production-oriented e-commerce platform built as a **TypeScript Nx monorepo** using a distributed microservices architecture.

The platform demonstrates modern software engineering and DevOps practices including **event-driven architecture, Kafka messaging, containerization, Kubernetes orchestration, automated CI/CD, GitOps, observability, autoscaling, and infrastructure automation**.

> 🚀 Built to demonstrate how a modern e-commerce platform can be designed, deployed, monitored, and operated as a cloud-native system.

---

## ✨ Highlights

* 🧩 **Microservices architecture**
* 📦 **Nx monorepo**
* ⚡ **Apache Kafka event-driven communication**
* 🗄️ **MongoDB** for persistent data
* ⚡ **Redis** for caching
* 🔎 **Elasticsearch** for search
* 🐳 **Docker** containerization
* ☸️ **Kubernetes** orchestration
* 📦 **Kustomize** configuration management
* 📈 **Horizontal Pod Autoscaling (HPA)**
* 🛡️ **Pod Disruption Budgets (PDB)**
* 🌐 **NGINX Ingress**
* 🔄 **GitHub Actions CI/CD**
* 🚀 **Docker Hub image publishing**
* 🔁 **Argo CD GitOps deployment**
* 📊 **Prometheus + Grafana monitoring**
* 📝 **Loki + Alloy log aggregation**
* 🔎 **OpenTelemetry + Tempo distributed tracing**
* 🏗️ **Helm and Terraform infrastructure roadmap**

---

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │       Clients       │
                         │  Web / Mobile Apps  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    NGINX Ingress    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     API Gateway     │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
        User Service          Catalog Service        Cart Service
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
        Order Service         Payment Service       Inventory Service
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                                    ▼
                              Apache Kafka
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
         Notification          Analytics             Search
            Service             Service              Service

                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
             MongoDB              Redis            Elasticsearch
```

---

## 🔧 Technology Stack

### Backend

| Technology        | Purpose                    |
| ----------------- | -------------------------- |
| **Node.js**       | Backend runtime            |
| **TypeScript**    | Application language       |
| **Express.js**    | HTTP APIs                  |
| **Nx**            | Monorepo management        |
| **Kafka**         | Event-driven communication |
| **MongoDB**       | Primary database           |
| **Redis**         | Caching                    |
| **Elasticsearch** | Search                     |

### DevOps & Cloud Native

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| **Docker**         | Containerization                |
| **Kubernetes**     | Container orchestration         |
| **Kustomize**      | Kubernetes configuration        |
| **NGINX Ingress**  | Traffic routing                 |
| **HPA**            | Automatic scaling               |
| **PDB**            | Availability during disruptions |
| **GitHub Actions** | CI/CD                           |
| **Docker Hub**     | Container image registry        |
| **Argo CD**        | GitOps continuous delivery      |

### Observability

| Technology        | Purpose               |
| ----------------- | --------------------- |
| **Prometheus**    | Metrics               |
| **Grafana**       | Visualization         |
| **Loki**          | Log aggregation       |
| **Alloy**         | Telemetry collection  |
| **OpenTelemetry** | Distributed telemetry |
| **Tempo**         | Distributed tracing   |

---

## 🧩 Microservices

FlashStore is structured around independently deployable services:

```text
apps/
├── api-gateway/
├── user-service/
├── catalog-service/
├── cart-service/
├── order-service/
├── payment-service/
├── inventory-service/
├── notification-service/
├── analytics-service/
└── search-service/
```

Shared functionality is organized into reusable Nx libraries:

```text
libs/
├── shared-auth/
├── shared-config/
├── shared-db/
├── shared-kafka/
├── shared-logger/
├── shared-types/
└── shared-utils/
```

This allows services to remain independently organized while sharing common infrastructure and domain contracts.

---

## ⚡ Event-Driven Architecture

Services communicate asynchronously through **Kafka events**.

Example:

```text
Customer
   │
   ▼
Order Service
   │
   ├── order.created
   │
   ▼
Kafka
   │
   ├──────────────► Inventory Service
   │
   ├──────────────► Payment Service
   │
   ├──────────────► Notification Service
   │
   └──────────────► Analytics Service
```

This architecture reduces tight coupling between services and allows consumers to process events independently.

The platform also uses patterns such as:

* Event producers
* Event consumers
* Topic-based communication
* Idempotent event processing
* Retry handling
* Dead-letter queues
* Outbox-based event publishing

---

## ☸️ Kubernetes

FlashStore is deployed to Kubernetes using declarative manifests managed through Kustomize.

The Kubernetes platform includes:

* Deployments
* Services
* ConfigMaps
* Secrets
* Ingress
* HPA
* PDB
* StatefulSets
* PersistentVolumes
* NetworkPolicies
* RBAC

Example deployment flow:

```text
GitHub
   │
   ▼
GitHub Actions
   │
   ├── Test
   ├── Lint
   ├── Build
   ├── Security Scan
   └── Docker Build
           │
           ▼
       Docker Hub
           │
           ▼
        Argo CD
           │
           ▼
       Kubernetes
```

---

## 📈 Autoscaling

FlashStore uses Kubernetes **Horizontal Pod Autoscaling** based on CPU and memory utilization.

```text
                 Traffic
                    │
                    ▼
                  HPA
              ┌─────┴─────┐
              │            │
           CPU ↑        Memory ↑
              │            │
              └─────┬──────┘
                    ▼
              Scale Replicas
```

This allows services to automatically increase or decrease their replica count based on workload.

---

## 📊 Observability

FlashStore implements the three major pillars of observability:

```text
                 Grafana
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
     Metrics       Logs       Traces
        │           │           │
   Prometheus      Loki        Tempo
                                ▲
                                │
                         OpenTelemetry
```

### Metrics

**Prometheus** collects application and infrastructure metrics which are visualized through Grafana dashboards.

### Logs

**Alloy** collects logs and forwards them to **Loki** for centralized log aggregation.

### Traces

**OpenTelemetry** provides distributed tracing across services, with **Tempo** storing and serving trace data to Grafana.

This makes it possible to follow a request across multiple services and correlate:

```text
Request
   │
   ├── Metrics
   ├── Logs
   └── Trace
```

---

## 🔄 CI/CD

GitHub Actions automates the software delivery pipeline.

```text
Push / Pull Request
        │
        ▼
   GitHub Actions
        │
        ├── Format
        ├── Lint
        ├── Test
        ├── Build
        ├── Security Scan
        │
        ▼
   Docker Images
        │
        ▼
     Docker Hub
        │
        ▼
      Argo CD
        │
        ▼
    Kubernetes
```

The goal is to keep deployments reproducible, automated, and Git-driven.

---

## 📁 Project Structure

```text
FLASHSTORE/
│
├── apps/
│   ├── api-gateway/
│   ├── user-service/
│   ├── catalog-service/
│   ├── cart-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── inventory-service/
│   ├── notification-service/
│   ├── analytics-service/
│   └── search-service/
│
├── libs/
│   ├── shared-auth/
│   ├── shared-config/
│   ├── shared-db/
│   ├── shared-kafka/
│   ├── shared-logger/
│   ├── shared-types/
│   └── shared-utils/
│
├── infrastructure/
│   ├── docker/
│   └── kubernetes/
│
├── .github/
│   └── workflows/
│
├── nx.json
├── package.json
├── tsconfig.base.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Docker Desktop
* Kubernetes
* kubectl
* Git

### Clone the repository

```bash
git clone https://github.com/flashmnisi/FLASHSTORE.git

cd FLASHSTORE
```

### Install dependencies

```bash
npm install
```

### Explore the Nx workspace

```bash
npx nx graph
```

### Run Nx tasks

```bash
npx nx <target> <project-name>
```

---

## 🐳 Docker

FlashStore services are containerized using Docker.

Build an individual service:

```bash
docker build \
  -f infrastructure/docker/<service>.Dockerfile \
  -t flashmnisi/flashstore-<service>:latest .
```

---

## ☸️ Deploy to Kubernetes

The Kubernetes resources are organized using Kustomize.

```bash
kubectl apply -k infrastructure/kubernetes
```

Verify the workloads:

```bash
kubectl get pods -n flashstore
```

Check services:

```bash
kubectl get svc -n flashstore
```

Check ingress:

```bash
kubectl get ingress -n flashstore
```

---

## 📈 Monitoring

Access Grafana to explore:

* Application metrics
* Kubernetes metrics
* Infrastructure metrics
* Service health
* Logs
* Distributed traces
* HPA activity

---

## 🛣️ Roadmap

### Completed

* [x] Nx monorepo
* [x] Microservices architecture
* [x] Kafka event-driven architecture
* [x] MongoDB
* [x] Redis
* [x] Elasticsearch
* [x] Docker
* [x] Kubernetes
* [x] Kustomize
* [x] HPA
* [x] PDB
* [x] NGINX Ingress
* [x] GitHub Actions CI/CD
* [x] Docker Hub
* [x] Prometheus
* [x] Grafana
* [x] Grafana dashboards
* [x] Loki
* [x] Alloy
* [x] OpenTelemetry
* [x] Tempo
* [x] Argo CD / GitOps

### Next

* [ ] Helm
* [ ] Terraform
* [ ] Cloud deployment
* [ ] Production hardening
* [ ] Additional automated testing

---

## 🎯 Project Goals

FlashStore was built to demonstrate practical experience with:

* Distributed systems
* Microservices
* Event-driven architecture
* Cloud-native development
* Kubernetes
* DevOps
* CI/CD
* GitOps
* Observability
* Infrastructure automation
* Scalable application architecture

---

## 👨‍💻 Author

**Flash Mnisi**

Full-Stack / React Native Developer focused on building scalable applications with modern JavaScript/TypeScript technologies.

---

## ⭐ Support

If you find the project useful or interesting, consider giving the repository a ⭐.

**Built with TypeScript, Node.js, Nx, Kafka, Kubernetes, and a lot of debugging. 🚀**
