# 🚀 Pivori Studio - 15 Microservices

Production-ready microservices architecture for Pivori Studio.

## 📦 Services

### Geolocation Group (8010-8030)
- **Geolocation Service** (8010) - Real-time location tracking
- **Routing Service** (8020) - Route optimization and navigation
- **Proximity Service** (8030) - Proximity detection and alerts

### Finance & Trading Group (8040-8060)
- **Trading Bot Service** (8040) - Automated trading execution
- **Market Data Service** (8050) - Real-time market data and indicators
- **Payment Service** (8060) - Payment processing and transactions

### Media & Streaming Group (8070-8090)
- **IPTV Service** (8070) - Video streaming (HLS/DASH)
- **Audio Service** (8080) - Audio streaming and processing
- **Live Service** (8090) - Live streaming and real-time chat

### Gaming Group (8100-8120)
- **Game Service** (8100) - Game logic and anti-cheat
- **Leaderboard Service** (8110) - Real-time rankings
- **Reward Service** (8120) - Gamification and rewards

### Documents & Security Group (8130-8150)
- **Document Scan Service** (8130) - OCR and document processing
- **Watermark Service** (8140) - Image and document watermarking
- **Security Service** (8150) - Encryption and security

## 🏗️ Structure

Each service includes:
```
service-name/
├── app/
│   ├── main.py              # FastAPI application
│   ├── services/            # Business logic
│   └── middleware/          # Custom middleware
├── tests/
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
├── config/
│   └── settings.py          # Configuration
├── Dockerfile               # Container image
├── requirements.txt         # Python dependencies
└── helm/                    # Kubernetes Helm chart
```

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
pip install -r geolocation/requirements.txt

# Run service
python -m uvicorn geolocation.app.main:app --reload --port 8010
```

### Docker
```bash
# Build image
docker build -t pivori/geolocation:1.0.0 geolocation/

# Run container
docker run -p 8010:8000 pivori/geolocation:1.0.0
```

### Kubernetes
```bash
# Deploy with Helm
helm install geolocation geolocation/helm/ -n pivori-production

# Verify deployment
kubectl get pods -n pivori-production
```

## 📊 Health Checks

All services expose health endpoints:
```bash
curl http://localhost:8010/health
```

Response:
```json
{
  "status": "healthy",
  "service": "geolocation"
}
```

## 📈 Metrics

Prometheus metrics available at:
```bash
curl http://localhost:8010/metrics
```

## 🔗 API Documentation

Swagger UI available at:
- http://localhost:8010/docs
- http://localhost:8020/docs
- etc.

## 🧪 Testing

```bash
# Run all tests
pytest geolocation/tests/

# Unit tests only
pytest geolocation/tests/unit/

# Integration tests
pytest geolocation/tests/integration/

# With coverage
pytest --cov=geolocation geolocation/tests/
```

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🔐 Security

All services follow security best practices:
- JWT authentication
- Input validation
- Rate limiting
- Encrypted communication
- Audit logging

See [SECURITY_PRIORITY_1.md](../docs/SECURITY_PRIORITY_1.md) for details.

## 📚 Documentation

- [Architecture](../docs/AUDIT_REPORT.md)
- [Deployment](../docs/DEPLOYMENT_GUIDE.md)
- [API Documentation](../docs/API_DOCUMENTATION.md)
- [Security](../docs/SECURITY_PRIORITY_1.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## 📞 Support

- Slack: #services
- Email: services@pivori.app
- Issues: GitHub Issues

---

**Status:** Production-Ready ✅
