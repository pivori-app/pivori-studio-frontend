# 🏗️ PIVORI STUDIO - BACKEND ARCHITECTURE OVERVIEW

**Version**: 1.0.0  
**Date**: 2025-11-09  
**Status**: Production-Ready ✅

---

## 📍 GitHub Repository

**Main Repository**: https://github.com/pivori-app/Pivori-studio

### Direct Links to Backend Code

#### Main Backend (back-end-v2)

- **Main Application**: https://github.com/pivori-app/Pivori-studio/blob/main/back-end-v2/app/main.py
- **Database Models**: https://github.com/pivori-app/Pivori-studio/blob/main/back-end-v2/app/models.py
- **Schemas**: https://github.com/pivori-app/Pivori-studio/blob/main/back-end-v2/app/schemas.py
- **Database Config**: https://github.com/pivori-app/Pivori-studio/blob/main/back-end-v2/app/database.py
- **LLM Providers**: https://github.com/pivori-app/Pivori-studio/blob/main/back-end-v2/app/llm_providers.py
- **Validators**: https://github.com/pivori-app/Pivori-studio/blob/main/back-end-v2/app/validators.py

#### Microservices (15 Services)

**Geolocation Group**:
- Geolocation Service (Port 8010): https://github.com/pivori-app/Pivori-studio/tree/main/services/geolocation
- Routing Service (Port 8020): https://github.com/pivori-app/Pivori-studio/tree/main/services/routing
- Proximity Service (Port 8030): https://github.com/pivori-app/Pivori-studio/tree/main/services/proximity

**Finance & Trading Group**:
- Trading Bot Service (Port 8040): https://github.com/pivori-app/Pivori-studio/tree/main/services/trading
- Market Data Service (Port 8050): https://github.com/pivori-app/Pivori-studio/tree/main/services/market-data
- Payment Service (Port 8060): https://github.com/pivori-app/Pivori-studio/tree/main/services/payment

**Media & Streaming Group**:
- IPTV Service (Port 8070): https://github.com/pivori-app/Pivori-studio/tree/main/services/iptv
- Audio Service (Port 8080): https://github.com/pivori-app/Pivori-studio/tree/main/services/audio
- Live Service (Port 8090): https://github.com/pivori-app/Pivori-studio/tree/main/services/live

**Gaming Group**:
- Game Service (Port 8100): https://github.com/pivori-app/Pivori-studio/tree/main/services/game
- Leaderboard Service (Port 8110): https://github.com/pivori-app/Pivori-studio/tree/main/services/leaderboard
- Reward Service (Port 8120): https://github.com/pivori-app/Pivori-studio/tree/main/services/reward

**Documents & Security Group**:
- Document Scan Service (Port 8130): https://github.com/pivori-app/Pivori-studio/tree/main/services/document-scan
- Watermark Service (Port 8140): https://github.com/pivori-app/Pivori-studio/tree/main/services/watermark
- Security Service (Port 8150): https://github.com/pivori-app/Pivori-studio/tree/main/services/security

---

## 🔧 API ENDPOINTS

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user account |
| POST | `/api/v1/auth/login` | Login and get JWT token |
| GET | `/api/v1/auth/me` | Get current user information |

### Specialties Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/specialties` | List all specialties (paginated) |
| POST | `/api/v1/specialties` | Create new specialty |
| GET | `/api/v1/specialties/{specialty_id}` | Get specialty details |

### Sub-Specialties Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/sub-specialties` | List sub-specialties (paginated) |
| POST | `/api/v1/sub-specialties` | Create new sub-specialty |
| GET | `/api/v1/sub-specialties/{sub_specialty_id}` | Get sub-specialty details |

### Expert Prompts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/expert-prompts` | List expert prompts (paginated) |
| POST | `/api/v1/expert-prompts` | Create new expert prompt |
| GET | `/api/v1/expert-prompts/{prompt_id}` | Get prompt details |
| POST | `/api/v1/execute-prompt/{prompt_id}` | Execute prompt with variables |

### Microservice Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{service}/health` | Health check for service |
| GET | `/{service}/metrics` | Prometheus metrics |

---

## 📊 Database Models

### User Model

Represents application users with authentication credentials.

```python
- id: UUID (Primary Key)
- email: String (Unique, Indexed)
- username: String
- hashed_password: String (bcrypt)
- created_at: DateTime
- updated_at: DateTime
- is_active: Boolean
```

### Specialty Model

Represents major specialties or categories.

```python
- id: Integer (Primary Key)
- name: String (Unique)
- description: Text
- icon_url: String (Optional)
- created_at: DateTime
- updated_at: DateTime
```

### SubSpecialty Model

Represents sub-categories within specialties.

```python
- id: Integer (Primary Key)
- specialty_id: ForeignKey (Specialty)
- name: String
- description: Text
- created_at: DateTime
- updated_at: DateTime
```

### ExpertPrompt Model

Represents expert-crafted prompts for LLM execution.

```python
- id: Integer (Primary Key)
- sub_specialty_id: ForeignKey (SubSpecialty)
- title: String
- content: Text (Prompt template)
- variables: JSON (Variable definitions)
- llm_provider: String (openai, anthropic, etc.)
- model: String (gpt-4, claude-3, etc.)
- created_at: DateTime
- updated_at: DateTime
- is_public: Boolean
```

### PromptExecution Model

Records each prompt execution with results and metrics.

```python
- id: Integer (Primary Key)
- prompt_id: ForeignKey (ExpertPrompt)
- user_id: ForeignKey (User)
- variables: JSON (Input variables)
- result: Text (LLM response)
- tokens_used: Integer
- cost: Float (USD)
- execution_time: Float (seconds)
- status: String (success, error, timeout)
- created_at: DateTime
```

---

## 🔌 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | FastAPI (Python 3.11) |
| **Web Server** | Uvicorn |
| **Database** | PostgreSQL 14+ |
| **ORM** | SQLAlchemy |
| **Authentication** | JWT + OAuth2 |
| **Password Hashing** | bcrypt |
| **Monitoring** | Prometheus |
| **Containerization** | Docker |
| **Orchestration** | Kubernetes |
| **Service Mesh** | Istio |
| **API Gateway** | Kong/Traefik |
| **LLM Integration** | OpenAI, Anthropic, etc. |

---

## 📈 Key Features

### Authentication & Security

✅ **JWT Token-based Authentication** with 30-minute expiration  
✅ **Password Hashing** using bcrypt with salt  
✅ **OAuth2 Integration** for third-party authentication  
✅ **CORS Configuration** for cross-origin requests  
✅ **Rate Limiting** to prevent abuse  
✅ **HTTPS/TLS Support** for encrypted communication  

### API Features

✅ **RESTful API Design** following best practices  
✅ **Pagination Support** for list endpoints  
✅ **Input Validation** using Pydantic schemas  
✅ **Error Handling** with proper HTTP status codes  
✅ **Request/Response Logging** for debugging  
✅ **API Documentation** via Swagger UI and ReDoc  

### Monitoring & Observability

✅ **Prometheus Metrics** for all endpoints  
✅ **Structured Logging** with JSON format  
✅ **Distributed Tracing** via Jaeger  
✅ **Health Check Endpoints** for all services  
✅ **Performance Metrics** (latency, throughput, errors)  

### Data Management

✅ **Database Connection Pooling** for performance  
✅ **Transaction Management** for data consistency  
✅ **Data Validation** at API layer  
✅ **Backup & Recovery** procedures  
✅ **Migration Support** via Alembic  

---

## 🚀 Running the Backend

### Local Development

```bash
# Clone repository
git clone https://github.com/pivori-app/Pivori-studio.git
cd Pivori-studio

# Install dependencies
cd back-end-v2
pip install -r requirements.txt

# Set environment variables
cp env.example .env
# Edit .env with your configuration

# Run development server
python -m uvicorn app.main:app --reload --port 8000
```

### Docker

```bash
# Build image
docker build -t pivori-backend:latest .

# Run container
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://user:password@db:5432/pivori" \
  -e JWT_SECRET="your-secret-key" \
  pivori-backend:latest
```

### Kubernetes

```bash
# Deploy to cluster
kubectl apply -f kubernetes/backend-deployment.yaml

# Verify deployment
kubectl get pods -n production
kubectl logs -n production -l app=backend

# Access service
kubectl port-forward -n production svc/backend 8000:8000
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

---

## 📚 API Documentation

### Swagger UI
Access interactive API documentation at: `http://localhost:8000/docs`

Features:
- Try out API endpoints directly
- View request/response schemas
- See parameter descriptions
- Test authentication

### ReDoc
Access alternative documentation at: `http://localhost:8000/redoc`

Features:
- Clean, readable API documentation
- Search functionality
- Organized by tags
- Schema definitions

### OpenAPI Schema
Download OpenAPI specification: `http://localhost:8000/openapi.json`

---

## 🔐 Security Features

### Authentication

The backend implements comprehensive authentication mechanisms:

**JWT Tokens**: Stateless authentication using JSON Web Tokens with HS256 algorithm. Tokens expire after 30 minutes and include user ID and expiration timestamp.

**Password Security**: User passwords are hashed using bcrypt with automatic salt generation. Plain text passwords are never stored in the database.

**Bearer Token**: API requests include JWT in Authorization header: `Authorization: Bearer {token}`

### Authorization

Role-based access control (RBAC) restricts operations based on user permissions. Protected endpoints require valid JWT tokens and appropriate user roles.

### Data Protection

**SQL Injection Prevention**: SQLAlchemy ORM parameterizes all queries, preventing SQL injection attacks.

**CORS Protection**: Cross-origin requests are validated and restricted to configured origins.

**Rate Limiting**: API endpoints implement rate limiting to prevent abuse and DDoS attacks.

**HTTPS/TLS**: All production traffic uses HTTPS with TLS 1.3 for encryption.

---

## 📊 Prometheus Metrics

The backend exposes the following metrics for monitoring:

### Request Metrics

```
http_requests_total{method, endpoint, status}
http_request_duration_seconds{method, endpoint}
http_request_size_bytes{method, endpoint}
http_response_size_bytes{method, endpoint}
```

### Execution Metrics

```
prompt_executions_total{prompt_id, llm_provider, status}
prompt_execution_duration_seconds{prompt_id, llm_provider}
llm_tokens_used_total{llm_provider, model}
llm_cost_total_usd{llm_provider, model}
active_executions
```

### Database Metrics

```
database_connections_active
database_query_duration_seconds
database_errors_total
```

---

## 🛠️ Development

### Project Structure

```
Pivori-studio/
├── back-end-v2/                    # Main backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application
│   │   ├── models.py               # SQLAlchemy models
│   │   ├── schemas.py              # Pydantic schemas
│   │   ├── database.py             # Database configuration
│   │   ├── llm_providers.py        # LLM integration
│   │   ├── validators.py           # Input validators
│   │   └── suggestions_implementations.py
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
├── services/                       # 15 Microservices
│   ├── geolocation/
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── models.py
│   │   │   └── services/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   ├── routing/
│   ├── trading/
│   ├── market-data/
│   ├── iptv/
│   ├── audio/
│   ├── live/
│   ├── game/
│   ├── leaderboard/
│   ├── reward/
│   ├── document-scan/
│   ├── watermark/
│   ├── security/
│   ├── payment/
│   └── proximity/
├── kubernetes/                     # Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── services-deployment.yaml
│   ├── ingress.yaml
│   └── configmaps/
├── frontend/                       # React frontend
├── docker-compose.yml
└── docs/                          # Documentation
```

### Code Standards

**Python Version**: 3.11+  
**Code Style**: PEP 8 with Black formatter  
**Type Hints**: Mandatory for all functions  
**Testing**: Pytest with minimum 70% coverage  
**Linting**: Pylint and Flake8  

### Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_auth.py

# Run integration tests
pytest tests/integration/
```

---

## 📈 Performance Optimization

### Database Optimization

- Connection pooling with SQLAlchemy
- Query optimization with proper indexing
- N+1 query prevention using eager loading
- Caching with Redis for frequently accessed data

### API Optimization

- Response compression with gzip
- Pagination for large result sets
- Async/await for non-blocking I/O
- Connection keep-alive for HTTP/1.1

### Caching Strategy

- Redis cache for user sessions
- Database query result caching
- API response caching for read-only endpoints
- Cache invalidation on data updates

---

## 🔄 Deployment Pipeline

### CI/CD Workflow

1. **Code Push**: Developer pushes code to GitHub
2. **Tests**: GitHub Actions runs unit and integration tests
3. **Build**: Docker image is built and pushed to registry
4. **Security Scan**: Trivy scans image for vulnerabilities
5. **Deploy**: Image is deployed to Kubernetes cluster
6. **Verify**: Health checks confirm successful deployment

### Rollback Procedure

```bash
# View deployment history
kubectl rollout history deployment/backend -n production

# Rollback to previous version
kubectl rollout undo deployment/backend -n production

# Rollback to specific revision
kubectl rollout undo deployment/backend --to-revision=2 -n production
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Database Connection Error**
- Verify PostgreSQL is running
- Check DATABASE_URL environment variable
- Verify network connectivity to database host

**Authentication Failures**
- Verify JWT_SECRET is set correctly
- Check token expiration time
- Verify Authorization header format

**High Latency**
- Check database query performance
- Verify resource allocation
- Check network connectivity
- Review application logs for bottlenecks

### Useful Commands

```bash
# Check backend health
curl http://localhost:8000/health

# View API documentation
curl http://localhost:8000/openapi.json

# Check Prometheus metrics
curl http://localhost:8000/metrics

# View logs
kubectl logs -n production -l app=backend -f

# Execute database query
kubectl exec -it postgres-0 -n production -- psql -U postgres
```

### Support Channels

- **GitHub Issues**: https://github.com/pivori-app/Pivori-studio/issues
- **Email**: backend-team@pivori.app
- **Slack**: #backend-support
- **Documentation**: See /docs folder

---

## 📋 Checklist for New Developers

- [ ] Clone repository
- [ ] Install Python 3.11+
- [ ] Create virtual environment
- [ ] Install dependencies
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Run tests
- [ ] Start development server
- [ ] Access API documentation at http://localhost:8000/docs

---

## 🏆 Summary

The Pivori Studio backend is a production-ready, enterprise-grade microservices platform built with FastAPI. It provides comprehensive API endpoints for user management, specialty management, and expert prompt execution with full monitoring, security, and scalability features.

**Key Strengths**:
- ✅ Modern Python framework (FastAPI)
- ✅ Comprehensive API documentation
- ✅ Enterprise-grade security
- ✅ Full monitoring and observability
- ✅ Kubernetes-native deployment
- ✅ 15 independent microservices
- ✅ High availability and scalability

---

**Last Updated**: 2025-11-09  
**Version**: 1.0.0  
**Status**: Production-Ready ✅  
**Repository**: https://github.com/pivori-app/Pivori-studio

