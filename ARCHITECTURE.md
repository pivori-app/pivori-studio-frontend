# PIVORI Studio v2.0 - Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PIVORI Studio v2.0                      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼────┐  ┌────▼────┐  ┌───▼────────┐
        │  Frontend   │  │ Backend  │  │ Database   │
        │  (React)    │  │(Express) │  │(Supabase)  │
        └─────────────┘  └──────────┘  └────────────┘
                │             │             │
                └─────────────┼─────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  External Services │
                    │  (OAuth, APIs)     │
                    └────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **State Management**: React Context API
- **Icons**: Lucide React
- **HTTP Client**: Axios / Fetch API

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: JavaScript/TypeScript
- **Authentication**: JWT
- **Database Client**: Supabase JS SDK
- **Validation**: Joi / Zod
- **Logging**: Winston / Pino

### Database
- **Platform**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM (optional)
- **Migrations**: SQL migrations
- **Caching**: Redis (optional)

### DevOps
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel
- **Containerization**: Docker
- **Monitoring**: Vercel Analytics + Sentry

---

## Project Structure

```
pivori-studio-v2/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── contexts/           # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer
│   │   ├── utils/              # Utility functions
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Static assets
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json
│
├── backend/                     # Express backend API
│   ├── routes/                 # API route handlers
│   ├── middleware/             # Express middleware
│   ├── controllers/            # Business logic
│   ├── services/               # Service layer
│   ├── models/                 # Data models
│   ├── utils/                  # Utility functions
│   ├── server.js               # Express server
│   ├── migrations.sql          # Database migrations
│   ├── Dockerfile              # Docker configuration
│   ├── .env.example            # Environment template
│   └── package.json
│
├── .github/
│   └── workflows/              # GitHub Actions workflows
│       └── deploy.yml          # CI/CD pipeline
│
├── docker-compose.yml          # Docker Compose configuration
├── vercel.json                 # Vercel configuration
├── DEPLOYMENT.md               # Deployment guide
├── ARCHITECTURE.md             # This file
└── README.md                   # Project README
```

---

## Data Flow

### 1. User Authentication Flow

```
User Login
    │
    ▼
Frontend (React)
    │
    ├─► Supabase Auth
    │   │
    │   └─► JWT Token
    │
    ▼
Store Token (localStorage)
    │
    ▼
Include in API Requests
    │
    ▼
Backend (Express)
    │
    ├─► Verify JWT
    │
    ▼
Grant Access
```

### 2. Application Data Flow

```
Frontend UI
    │
    ├─► User Action
    │
    ▼
API Request (with JWT)
    │
    ▼
Backend Express Server
    │
    ├─► Authenticate
    ├─► Validate Input
    ├─► Process Business Logic
    │
    ▼
Supabase Database
    │
    ├─► Query/Insert/Update/Delete
    ├─► RLS Policies Check
    │
    ▼
Response Data
    │
    ▼
Frontend UI Update
```

### 3. Real-time Updates (Optional)

```
Database Change
    │
    ▼
Supabase Realtime
    │
    ▼
WebSocket Connection
    │
    ▼
Frontend Listener
    │
    ▼
Update UI
```

---

## API Endpoints

### Applications
```
GET    /api/applications              # List all applications
POST   /api/applications              # Create application
PUT    /api/applications/:id          # Update application
DELETE /api/applications/:id          # Delete application
```

### Transactions
```
GET    /api/applications/:id/transactions      # List transactions
POST   /api/applications/:id/transactions      # Create transaction
```

### API Keys
```
GET    /api/applications/:id/keys              # List API keys
POST   /api/applications/:id/keys              # Create API key
DELETE /api/applications/:id/keys/:keyId       # Delete API key
```

### Connectors
```
GET    /api/applications/:id/connectors        # List connectors
POST   /api/applications/:id/connectors        # Create connector
PUT    /api/applications/:id/connectors/:id    # Update connector
DELETE /api/applications/:id/connectors/:id    # Delete connector
```

### Analytics
```
GET    /api/applications/:id/analytics         # Get analytics
```

---

## Database Schema

### Users Table
```sql
users {
  id: UUID (PK)
  email: TEXT (UNIQUE)
  name: TEXT
  avatar: TEXT
  role: TEXT
  status: TEXT
  preferences: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
  last_login: TIMESTAMP
}
```

### Applications Table
```sql
applications {
  id: UUID (PK)
  user_id: UUID (FK)
  name: TEXT
  description: TEXT
  category: TEXT
  icon: TEXT
  template: TEXT
  currency: TEXT
  users_count: INTEGER
  revenue: NUMERIC
  health: INTEGER
  status: TEXT
  metadata: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### Transactions Table
```sql
transactions {
  id: UUID (PK)
  application_id: UUID (FK)
  user_id: UUID (FK)
  amount: NUMERIC
  currency: TEXT
  status: TEXT
  type: TEXT
  description: TEXT
  metadata: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### API Keys Table
```sql
api_keys {
  id: UUID (PK)
  application_id: UUID (FK)
  key: TEXT (UNIQUE)
  name: TEXT
  last_used: TIMESTAMP
  status: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### Connectors Table
```sql
connectors {
  id: UUID (PK)
  application_id: UUID (FK)
  name: TEXT
  type: TEXT
  config: JSONB
  status: TEXT
  last_error: TEXT
  last_sync: TIMESTAMP
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

---

## Security Architecture

### 1. Authentication
- JWT tokens for API authentication
- Supabase Auth for user management
- OAuth 2.0 for third-party login

### 2. Authorization
- Row Level Security (RLS) in database
- Role-based access control (RBAC)
- API endpoint authorization

### 3. Data Protection
- HTTPS/TLS encryption in transit
- Encrypted sensitive data at rest
- API key rotation policy

### 4. API Security
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention

---

## Deployment Architecture

### Development
```
Local Machine
├── Frontend (npm run dev)
├── Backend (npm run dev)
└── Database (Docker PostgreSQL)
```

### Production
```
GitHub Repository
    │
    ▼
GitHub Actions (CI/CD)
    │
    ├─► Build & Test
    ├─► Security Scan
    │
    ▼
Vercel (Frontend)
├── Build
├── Deploy
└── CDN

Supabase (Backend + Database)
├── API
├── Database
└── Authentication
```

---

## Scaling Strategy

### Horizontal Scaling
1. **Frontend**: Vercel handles auto-scaling
2. **Backend**: Deploy multiple instances with load balancer
3. **Database**: Supabase auto-scaling

### Vertical Scaling
1. Upgrade Supabase plan
2. Increase server resources
3. Optimize database queries

### Caching Strategy
1. **Frontend**: Browser cache + CDN
2. **Backend**: Redis cache for frequently accessed data
3. **Database**: Query result caching

### Database Optimization
1. Add indexes on frequently queried columns
2. Partition large tables
3. Archive old data

---

## Monitoring & Observability

### Application Monitoring
- Vercel Analytics
- Sentry for error tracking
- Custom logging

### Database Monitoring
- Supabase dashboard
- Query performance monitoring
- Connection pool monitoring

### Infrastructure Monitoring
- GitHub Actions logs
- Vercel deployment logs
- Docker container logs

### Alerting
- Email notifications
- Slack integration
- PagerDuty (optional)

---

## Performance Optimization

### Frontend
1. Code splitting with React.lazy()
2. Image optimization (WebP)
3. CSS minification
4. JavaScript minification
5. Gzip compression

### Backend
1. Database query optimization
2. Caching strategy
3. Connection pooling
4. Compression middleware

### Database
1. Proper indexing
2. Query optimization
3. Connection pooling
4. Regular maintenance

---

## Disaster Recovery

### Backup Strategy
- Daily automated Supabase backups
- GitHub repository as code backup
- Environment variables backup

### Recovery Procedure
1. Restore database from backup
2. Redeploy application from GitHub
3. Verify all services
4. Notify users if needed

### RTO/RPO Targets
- Recovery Time Objective (RTO): 1 hour
- Recovery Point Objective (RPO): 24 hours

---

## Future Enhancements

1. **Microservices**: Split backend into microservices
2. **GraphQL**: Add GraphQL API alongside REST
3. **WebSockets**: Real-time updates
4. **Message Queue**: Async job processing (Bull/RabbitMQ)
5. **Search**: Elasticsearch integration
6. **Analytics**: Advanced analytics engine
7. **Machine Learning**: Predictive features
8. **Mobile Apps**: React Native apps

---

## References

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

**Last Updated**: November 2024
**Version**: 2.0.0

