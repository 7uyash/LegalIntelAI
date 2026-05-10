# Deployment Guide - NyayaViveka AI Investigator

Complete guide for deploying to production environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Docker Deployment](#docker-deployment)
3. [Vercel (Frontend)](#vercel-frontend)
4. [Railway (Backend)](#railway-backend)
5. [Superplane Integration](#superplane-integration)
6. [Environment Configuration](#environment-configuration)
7. [Monitoring & Logging](#monitoring-and-logging)
8. [Scaling & Performance](#scaling-and-performance)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing: `npm test` (frontend), `pytest` (backend)
- [ ] No console errors or warnings
- [ ] No hardcoded credentials
- [ ] Environment variables externalized
- [ ] Code reviewed and approved

### Security
- [ ] All dependencies up to date
- [ ] No vulnerable packages: `npm audit`, `pip audit`
- [ ] CORS properly configured
- [ ] API rate limiting enabled
- [ ] HTTPS enforced
- [ ] Database credentials secured

### Performance
- [ ] Frontend bundle size optimized
- [ ] Backend endpoints tested for latency
- [ ] Database queries optimized
- [ ] API response times < 2s
- [ ] Load testing completed

### Documentation
- [ ] README updated
- [ ] API documentation current
- [ ] Deployment instructions clear
- [ ] Environment variables documented
- [ ] Rollback procedures documented

---

## Docker Deployment

### Building Images

#### Build Backend Image
```bash
cd backend
docker build -t legalintel-backend:1.0.0 .
docker tag legalintel-backend:1.0.0 legalintel-backend:latest
```

#### Build Frontend Image
```bash
cd frontend
docker build -t legalintel-frontend:1.0.0 .
docker tag legalintel-frontend:1.0.0 legalintel-frontend:latest
```

### Docker Compose for Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: legalintel-backend:latest
    container_name: legalintel-backend
    ports:
      - "8001:8001"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - APIFY_API_KEY=${APIFY_API_KEY}
      - ZYND_API_KEY=${ZYND_API_KEY}
      - DEBUG=false
      - HOST=0.0.0.0
      - PORT=8001
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - legalintel-network

  frontend:
    image: legalintel-frontend:latest
    container_name: legalintel-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8001
      - NODE_ENV=production
    restart: unless-stopped
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - legalintel-network

  # Optional: nginx reverse proxy
  nginx:
    image: nginx:latest
    container_name: legalintel-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - legalintel-network

networks:
  legalintel-network:
    driver: bridge

volumes:
  backend-uploads:
  backend-logs:
```

### Deploy with Docker Compose

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

---

## Vercel (Frontend)

### Setup

#### Step 1: Connect Repository

1. Go to https://vercel.com/
2. Click "Import Project"
3. Connect GitHub account
4. Select repository

#### Step 2: Configure Project

In Vercel dashboard:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### Step 3: Environment Variables

In Vercel project settings, add:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_ENV=production
```

#### Step 4: Deploy

```bash
# Automatic deployment
git push origin main

# Or manual deployment
vercel --prod
```

### Custom Domain

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed
5. Enable SSL/TLS certificate

### Monitoring

- **Analytics**: View page performance metrics
- **Deployments**: Track deployment history
- **Logs**: Access real-time logs
- **Errors**: Monitor error rates

---

## Railway (Backend)

### Setup

#### Step 1: Connect Repository

1. Go to https://railway.app/
2. Create account or sign in
3. Click "Create New Project"
4. Select "GitHub Repo"
5. Connect and authorize

#### Step 2: Configure Backend

Create `railway.toml`:

```toml
[build]
builder = "nixpacks"
buildCommand = "pip install -r requirements.txt"

[deploy]
startCommand = "python main.py"
numReplicas = 1
healthcheckPath = "/health"
healthcheckInterval = 30

[[services]]
name = "backend"
image = "python:3.12"
root = "backend"
```

#### Step 3: Set Environment Variables

In Railway project settings:
```env
OPENAI_API_KEY=<your-key>
APIFY_API_KEY=<your-key>
ZYND_API_KEY=<your-key>
DEBUG=false
HOST=0.0.0.0
PORT=8001
```

#### Step 4: Deploy

```bash
# Railway auto-deploys on push
git push origin main

# Or deploy manually
railway up
```

### Custom Domain

1. Go to Railway project settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS CNAME record
5. Wait for SSL certificate

### Scaling

```toml
# Scale in railway.toml
[deploy]
numReplicas = 3  # 3 instances

# Or in dashboard:
# Project Settings > Deploy > Replicas
```

---

## Superplane Integration

### Docker Registry Setup

```bash
# Login to Docker registry
docker login

# Tag images with registry
docker tag legalintel-backend:latest <registry>/legalintel-backend:latest
docker tag legalintel-frontend:latest <registry>/legalintel-frontend:latest

# Push to registry
docker push <registry>/legalintel-backend:latest
docker push <registry>/legalintel-frontend:latest
```

### Superplane Configuration

```yaml
# superplane.yml

version: "1.0"
project: "legalintel"

infrastructure:
  cloud: "aws"
  region: "us-east-1"
  environment: "production"

services:
  backend:
    image: "<registry>/legalintel-backend:latest"
    replicas: 2
    port: 8001
    environment:
      OPENAI_API_KEY: "${OPENAI_API_KEY}"
      APIFY_API_KEY: "${APIFY_API_KEY}"
      ZYND_API_KEY: "${ZYND_API_KEY}"
      DEBUG: "false"
    resources:
      cpu: "1000m"
      memory: "2048Mi"
    healthcheck:
      path: "/health"
      interval: 30s
      timeout: 10s
    
  frontend:
    image: "<registry>/legalintel-frontend:latest"
    replicas: 1
    port: 3000
    environment:
      NEXT_PUBLIC_API_URL: "https://api.yourdomain.com"
    resources:
      cpu: "500m"
      memory: "1024Mi"

autoscaling:
  enabled: true
  backend:
    min_replicas: 2
    max_replicas: 5
    target_cpu: 70%
    target_memory: 80%
  frontend:
    min_replicas: 1
    max_replicas: 3
    target_cpu: 70%

monitoring:
  enabled: true
  prometheus: true
  datadog: false
  alerts:
    - metric: "cpu_usage"
      threshold: 85%
      duration: 5m
    - metric: "error_rate"
      threshold: 5%
      duration: 1m

backup:
  enabled: true
  frequency: "daily"
  retention: 30
```

### Deploy to Superplane

```bash
# Login
superplane login

# Deploy
superplane deploy

# View status
superplane status

# View logs
superplane logs backend
superplane logs frontend

# Scale
superplane scale backend --replicas 3
```

---

## Environment Configuration

### Production .env

```env
# ===== OpenAI Configuration =====
OPENAI_API_KEY=sk-prod-key-here
OPENAI_MODEL=gpt-4

# ===== Apify Configuration =====
APIFY_API_KEY=prod-apify-key-here
APIFY_ENABLED=true

# ===== Zynd AI Configuration =====
ZYND_API_KEY=prod-zynd-key-here

# ===== Server Configuration =====
DEBUG=false
HOST=0.0.0.0
PORT=8001
WORKERS=4  # Number of worker processes

# ===== CORS Configuration =====
CORS_ORIGINS=["https://yourdomain.com","https://api.yourdomain.com"]

# ===== Database Configuration =====
DATABASE_URL=postgresql://user:pass@host:5432/db  # For production DB

# ===== File Handling =====
UPLOAD_DIR=/var/uploads
MAX_FILE_SIZE=52428800  # 50MB

# ===== Security =====
SECRET_KEY=your-secret-key-here-change-in-production
API_RATE_LIMIT=100/minute
JWT_SECRET=your-jwt-secret-here

# ===== Logging =====
LOG_LEVEL=INFO
LOG_FILE=/var/logs/backend.log

# ===== Monitoring =====
SENTRY_DSN=https://your-sentry-key-here
DATADOG_API_KEY=your-datadog-key-here
```

### Secrets Management

Use environment-specific secret management:

**AWS Secrets Manager**:
```bash
aws secretsmanager create-secret \
  --name legalintel/prod/openai-key \
  --secret-string "sk-prod-key-here"
```

**GitHub Secrets** (for CI/CD):
1. Go to repository Settings
2. Click "Secrets and variables"
3. Add secrets for production

**Vercel Secrets**:
```bash
vercel env add OPENAI_API_KEY
```

---

## Monitoring and Logging

### Sentry (Error Tracking)

```python
# backend/app/main.py

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    integrations=[
        FastApiIntegration(),
    ],
    traces_sample_rate=1.0,
    environment="production"
)
```

### Datadog (Monitoring)

```python
# backend/app/main.py

from datadog import initialize, api

options = {
    'api_key': settings.DATADOG_API_KEY,
    'app_key': settings.DATADOG_APP_KEY
}

initialize(**options)
```

### CloudWatch (AWS)

```bash
# Install CloudWatch agent
pip install watchtower

# Configure logging
import logging
import watchtower

logger = logging.getLogger(__name__)
logger.addHandler(watchtower.CloudWatchLogHandler())
```

### Log Aggregation

```yaml
# docker-compose.prod.yml logging configuration

services:
  backend:
    logging:
      driver: "splunk"
      options:
        splunk-token: "${SPLUNK_TOKEN}"
        splunk-url: "https://your-splunk-instance:8088"
        tag: "{{.Name}}/{{.ID}}"
```

---

## Scaling & Performance

### Horizontal Scaling

```yaml
# Scale backend services
backend:
  replicas: 3  # 3 instances behind load balancer

# Load balancer configuration (nginx)
upstream backend {
  server backend:8001;
  server backend-2:8001;
  server backend-3:8001;
}
```

### Database Optimization

For production, migrate from in-memory to persistent database:

```python
# Use PostgreSQL for production
DATABASE_URL = "postgresql://user:password@host:5432/legalintel"

# Create indexes for performance
CREATE INDEX idx_file_id ON documents(file_id);
CREATE INDEX idx_analysis_status ON analyses(status);
```

### Caching Strategy

```python
# Redis caching for frequently accessed data
import redis

cache = redis.Redis(host='redis', port=6379, db=0)

# Cache legal analysis results
cache.set(f"analysis:{file_id}", analysis_data, ex=3600)
```

### CDN for Frontend

Use Vercel's automatic CDN or configure Cloudflare:

```yaml
# Cloudflare configuration
caching:
  default_ttl: 3600  # 1 hour
  static_assets_ttl: 86400  # 1 day
  api_ttl: 0  # No cache for API
```

---

## Disaster Recovery

### Backup Strategy

```bash
# Daily database backups
pg_dump legalintel > /backups/legalintel-$(date +%Y%m%d).sql

# S3 upload
aws s3 cp /backups/legalintel-$(date +%Y%m%d).sql \
  s3://backup-bucket/database/

# Retention policy
aws s3 expire-objects --days 30
```

### Rollback Procedure

```bash
# Revert to previous container image
docker-compose down
docker pull <registry>/legalintel-backend:previous-tag
docker-compose up -d

# Database rollback
pg_restore /backups/legalintel-20260509.sql
```

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time | < 2s | TBD |
| Frontend Load Time | < 3s | TBD |
| 99th Percentile Latency | < 5s | TBD |
| Error Rate | < 1% | TBD |
| Uptime | > 99.9% | TBD |
| Concurrent Users | 1000+ | TBD |

### Load Testing

```bash
# Use Apache Bench
ab -n 1000 -c 100 http://localhost:3000/

# Use wrk
wrk -t4 -c100 -d30s http://localhost:8001/health
```

---

**Last Updated**: May 10, 2026  
**Version**: 1.0.0
