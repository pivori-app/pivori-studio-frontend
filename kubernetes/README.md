# 🚀 Pivori Studio - Kubernetes Infrastructure

Production-ready Kubernetes infrastructure for Pivori Studio microservices.

## 📦 Components

### Helm Charts
- 15 service charts (geolocation, routing, trading, etc.)
- Monitoring stack (Prometheus, Grafana, Jaeger)
- Istio service mesh
- Ingress controller

### Kubernetes Manifests
- Deployments (15 services)
- Services (ClusterIP, LoadBalancer)
- Ingress (HTTPS)
- ConfigMaps & Secrets
- PersistentVolumes & PersistentVolumeClaims
- StatefulSets (databases)

### Istio Service Mesh
- VirtualServices
- DestinationRules
- Gateways
- PeerAuthentication (mTLS)
- AuthorizationPolicies

### Monitoring
- Prometheus (metrics collection)
- Grafana (dashboards)
- Jaeger (distributed tracing)
- Loki (log aggregation)

### Security
- NetworkPolicies
- RBAC (ServiceAccounts, Roles, RoleBindings)
- Pod Security Policies
- Secrets management

## 🚀 Quick Start

### Prerequisites
- Kubernetes 1.24+
- Helm 3.0+
- kubectl configured
- Docker (for local development)

### Local Development (Docker Compose)
```bash
docker-compose up -d
```

### Kubernetes Deployment

#### 1. Create Namespace
```bash
kubectl create namespace pivori-production
```

#### 2. Install Istio
```bash
istioctl install --set profile=production
kubectl label namespace pivori-production istio-injection=enabled
```

#### 3. Deploy Services
```bash
helm install geolocation ./helm/geolocation -n pivori-production
helm install routing ./helm/routing -n pivori-production
# ... repeat for all 15 services
```

#### 4. Deploy Monitoring
```bash
helm install prometheus ./helm/prometheus -n pivori-production
helm install grafana ./helm/grafana -n pivori-production
helm install jaeger ./helm/jaeger -n pivori-production
```

#### 5. Verify Deployment
```bash
kubectl get pods -n pivori-production
kubectl get svc -n pivori-production
kubectl get ingress -n pivori-production
```

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Istio Service Mesh                      │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │         15 Microservices (Pods)               │  │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │  │   │
│  │  │  │Geoloc    │  │Routing   │  │Trading   │ ...│  │   │
│  │  │  └──────────┘  └──────────┘  └──────────┘    │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                        │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │    Monitoring Stack                           │  │   │
│  │  │  Prometheus │ Grafana │ Jaeger │ Loki        │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Persistent Storage                          │   │
│  │  PostgreSQL │ Redis │ Elasticsearch                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Security Features

- **mTLS**: Mutual TLS between services via Istio
- **RBAC**: Role-based access control
- **NetworkPolicies**: Restrict traffic between pods
- **Secrets**: Encrypted configuration management
- **Pod Security**: Security contexts and policies

## 📈 Monitoring & Observability

- **Metrics**: Prometheus (CPU, memory, requests, latency)
- **Dashboards**: Grafana (service health, performance)
- **Tracing**: Jaeger (distributed tracing)
- **Logging**: Loki (log aggregation)
- **Alerting**: Prometheus AlertManager

## 🔄 CI/CD Integration

GitHub Actions pipeline:
1. Build Docker images
2. Push to registry
3. Run tests
4. Deploy to staging
5. Run smoke tests
6. Deploy to production

## 📚 Documentation

- [Helm Charts](./helm/README.md)
- [Istio Configuration](./istio/README.md)
- [Monitoring Setup](./monitoring/README.md)
- [Security Policies](./rbac/README.md)

## 🤝 Contributing

1. Update Helm charts
2. Test locally with Docker Compose
3. Deploy to staging Kubernetes
4. Run tests
5. Deploy to production

## 📞 Support

- Slack: #kubernetes
- Email: k8s@pivori.app
- Issues: GitHub Issues

---

**Status:** Production-Ready ✅
