# PIVORI Studio v2.0 - API Reference

## Base URL

```
Development: http://localhost:3000
Production: https://api.pivori.com
```

## Authentication

All API endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Response Format

All responses are in JSON format:

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Endpoints

### Health Check

#### GET /health
Check server health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-12T10:30:00Z"
}
```

---

## Applications

### List Applications

#### GET /api/applications

Get all applications for the authenticated user.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Max results (default: 50) |
| offset | number | Pagination offset (default: 0) |
| sort | string | Sort field (default: created_at) |
| order | string | Sort order: asc, desc (default: desc) |

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "My App",
    "description": "App description",
    "category": "productivity",
    "icon": "📱",
    "template": "blank",
    "currency": "EUR",
    "users_count": 100,
    "revenue": 1000.00,
    "health": 95,
    "status": "active",
    "created_at": "2024-11-01T00:00:00Z",
    "updated_at": "2024-11-12T10:30:00Z"
  }
]
```

### Create Application

#### POST /api/applications

Create a new application.

**Request Body:**
```json
{
  "name": "My App",
  "description": "App description",
  "category": "productivity",
  "icon": "📱",
  "template": "blank",
  "currency": "EUR"
}
```

**Required Fields:**
- name (string)
- description (string)
- category (string)

**Optional Fields:**
- icon (string, default: 📱)
- template (string, default: blank)
- currency (string, default: EUR)

**Response:** (201 Created)
```json
{
  "id": "uuid",
  "name": "My App",
  "description": "App description",
  "category": "productivity",
  "icon": "📱",
  "template": "blank",
  "currency": "EUR",
  "users_count": 0,
  "revenue": 0,
  "health": 100,
  "status": "active",
  "created_at": "2024-11-12T10:30:00Z",
  "updated_at": "2024-11-12T10:30:00Z"
}
```

### Update Application

#### PUT /api/applications/:id

Update an existing application.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |

**Request Body:**
```json
{
  "name": "Updated App Name",
  "description": "Updated description",
  "currency": "USD",
  "health": 90
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated App Name",
  "description": "Updated description",
  "category": "productivity",
  "icon": "📱",
  "template": "blank",
  "currency": "USD",
  "users_count": 100,
  "revenue": 1000.00,
  "health": 90,
  "status": "active",
  "created_at": "2024-11-01T00:00:00Z",
  "updated_at": "2024-11-12T10:35:00Z"
}
```

### Delete Application

#### DELETE /api/applications/:id

Delete an application.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |

**Response:**
```json
{
  "message": "Application deleted successfully"
}
```

---

## Transactions

### List Transactions

#### GET /api/applications/:id/transactions

Get all transactions for an application.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Max results (default: 50) |
| offset | number | Pagination offset (default: 0) |
| status | string | Filter by status |
| type | string | Filter by type |

**Response:**
```json
[
  {
    "id": "uuid",
    "application_id": "uuid",
    "user_id": "uuid",
    "amount": 99.99,
    "currency": "EUR",
    "status": "completed",
    "type": "payment",
    "description": "Payment for subscription",
    "created_at": "2024-11-12T10:30:00Z",
    "updated_at": "2024-11-12T10:30:00Z"
  }
]
```

### Create Transaction

#### POST /api/applications/:id/transactions

Create a new transaction.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |

**Request Body:**
```json
{
  "amount": 99.99,
  "currency": "EUR",
  "type": "payment",
  "description": "Payment for subscription"
}
```

**Required Fields:**
- amount (number)
- currency (string)

**Optional Fields:**
- type (string, default: payment)
- description (string)

**Response:** (201 Created)
```json
{
  "id": "uuid",
  "application_id": "uuid",
  "user_id": "uuid",
  "amount": 99.99,
  "currency": "EUR",
  "status": "completed",
  "type": "payment",
  "description": "Payment for subscription",
  "created_at": "2024-11-12T10:30:00Z",
  "updated_at": "2024-11-12T10:30:00Z"
}
```

---

## API Keys

### List API Keys

#### GET /api/applications/:id/keys

Get all API keys for an application.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Production Key",
    "key": "sk_live_...",
    "last_used": "2024-11-12T10:30:00Z",
    "created_at": "2024-11-01T00:00:00Z"
  }
]
```

### Create API Key

#### POST /api/applications/:id/keys

Create a new API key.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |

**Request Body:**
```json
{
  "name": "Production Key"
}
```

**Required Fields:**
- name (string)

**Response:** (201 Created)
```json
{
  "id": "uuid",
  "name": "Production Key",
  "key": "sk_live_abc123def456...",
  "last_used": null,
  "created_at": "2024-11-12T10:30:00Z"
}
```

**Note:** The API key is only shown once at creation. Store it securely.

### Delete API Key

#### DELETE /api/applications/:id/keys/:keyId

Delete an API key.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |
| keyId | string | API Key ID |

**Response:**
```json
{
  "message": "API key deleted successfully"
}
```

---

## Connectors

### List Connectors

#### GET /api/applications/:id/connectors

Get all connectors for an application.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |

**Response:**
```json
[
  {
    "id": "uuid",
    "application_id": "uuid",
    "name": "Google Drive",
    "type": "google_drive",
    "config": {
      "client_id": "...",
      "client_secret": "..."
    },
    "status": "active",
    "last_error": null,
    "last_sync": "2024-11-12T10:30:00Z",
    "created_at": "2024-11-01T00:00:00Z",
    "updated_at": "2024-11-12T10:30:00Z"
  }
]
```

### Create Connector

#### POST /api/applications/:id/connectors

Create a new connector.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |

**Request Body:**
```json
{
  "name": "Google Drive",
  "type": "google_drive",
  "config": {
    "client_id": "your-client-id",
    "client_secret": "your-client-secret"
  }
}
```

**Required Fields:**
- name (string)
- type (string)

**Optional Fields:**
- config (object, default: {})

**Response:** (201 Created)
```json
{
  "id": "uuid",
  "application_id": "uuid",
  "name": "Google Drive",
  "type": "google_drive",
  "config": {
    "client_id": "your-client-id",
    "client_secret": "your-client-secret"
  },
  "status": "active",
  "last_error": null,
  "last_sync": null,
  "created_at": "2024-11-12T10:30:00Z",
  "updated_at": "2024-11-12T10:30:00Z"
}
```

### Update Connector

#### PUT /api/applications/:id/connectors/:connectorId

Update a connector.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |
| connectorId | string | Connector ID |

**Request Body:**
```json
{
  "status": "inactive",
  "config": {
    "client_id": "new-client-id"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "application_id": "uuid",
  "name": "Google Drive",
  "type": "google_drive",
  "config": {
    "client_id": "new-client-id",
    "client_secret": "your-client-secret"
  },
  "status": "inactive",
  "last_error": null,
  "last_sync": "2024-11-12T10:30:00Z",
  "created_at": "2024-11-01T00:00:00Z",
  "updated_at": "2024-11-12T10:35:00Z"
}
```

### Delete Connector

#### DELETE /api/applications/:id/connectors/:connectorId

Delete a connector.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |
| connectorId | string | Connector ID |

**Response:**
```json
{
  "message": "Connector deleted successfully"
}
```

---

## Analytics

### Get Application Analytics

#### GET /api/applications/:id/analytics

Get analytics for an application.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Application ID |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| period | string | Time period: day, week, month, year |
| start_date | string | Start date (ISO 8601) |
| end_date | string | End date (ISO 8601) |

**Response:**
```json
{
  "application": {
    "id": "uuid",
    "name": "My App",
    "category": "productivity",
    "status": "active"
  },
  "totalRevenue": 5000.00,
  "transactionCount": 50,
  "transactions": [
    {
      "id": "uuid",
      "amount": 99.99,
      "currency": "EUR",
      "created_at": "2024-11-12T10:30:00Z"
    }
  ]
}
```

---

## Error Handling

### Common Errors

#### 401 Unauthorized
```json
{
  "error": "Access token required",
  "code": "UNAUTHORIZED"
}
```

#### 403 Forbidden
```json
{
  "error": "Invalid token",
  "code": "FORBIDDEN"
}
```

#### 404 Not Found
```json
{
  "error": "Application not found",
  "code": "NOT_FOUND"
}
```

#### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

---

## Rate Limiting

API requests are rate limited to prevent abuse:

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**:
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 50 | Max results per page |
| offset | number | 0 | Number of items to skip |

**Response Headers:**
- `X-Total-Count`: Total number of items
- `X-Page-Count`: Total number of pages

---

## Sorting

List endpoints support sorting:

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| sort | string | created_at | Field to sort by |
| order | string | desc | Sort order: asc, desc |

---

## Examples

### Create Application and Get Analytics

```bash
# 1. Create application
curl -X POST http://localhost:3000/api/applications \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App",
    "description": "My application",
    "category": "productivity",
    "currency": "EUR"
  }'

# 2. Create transaction
curl -X POST http://localhost:3000/api/applications/<app-id>/transactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "currency": "EUR",
    "type": "payment"
  }'

# 3. Get analytics
curl -X GET http://localhost:3000/api/applications/<app-id>/analytics \
  -H "Authorization: Bearer <token>"
```

---

**Last Updated**: November 2024
**Version**: 2.0.0

