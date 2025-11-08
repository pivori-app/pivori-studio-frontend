# 🚀 IMPLEMENTATION GUIDE - PHASE 2 (HIGH PRIORITY)

**Status**: Production-Ready Implementation  
**Duration**: 2 weeks  
**Effort**: 23 hours  
**Priority**: 🟠 HIGH  

---

## 📋 Overview

This guide provides step-by-step instructions to implement Phase 2 recommendations:

1. ✅ **HashiCorp Vault** (8h) - Centralized secret management
2. ✅ **Database Backup** (4h) - Velero backup strategy
3. ✅ **Audit Logging** (6h) - Complete audit trail
4. ✅ **SBOM Generation** (2h) - Software Bill of Materials
5. ✅ **Image Signing** (3h) - Cosign image signatures

---

## 1️⃣ HASHICORP VAULT

### 1.1 What is it?

HashiCorp Vault provides centralized secret management, encryption, and access control for all sensitive data.

### 1.2 Installation

#### Step 1: Apply Vault Setup

```bash
# Apply Vault configuration
kubectl apply -f kubernetes/vault-setup.yaml

# Verify installation
kubectl get pods -n vault
kubectl get statefulset -n vault
```

#### Step 2: Initialize Vault

```bash
# Port forward to Vault
kubectl port-forward -n vault svc/vault-ui 8200:8200 &

# Initialize Vault (generates unseal keys and root token)
vault operator init \
  -key-shares=5 \
  -key-threshold=3

# Save the unseal keys and root token securely!
# Store in secure location (encrypted, offline)
```

#### Step 3: Unseal Vault

```bash
# Unseal with 3 of 5 keys
vault operator unseal <KEY_1>
vault operator unseal <KEY_2>
vault operator unseal <KEY_3>

# Verify status
vault status
```

#### Step 4: Configure Auth Methods

```bash
# Login with root token
vault login <ROOT_TOKEN>

# Enable Kubernetes auth
vault auth enable kubernetes

# Configure Kubernetes auth
vault write auth/kubernetes/config \
  kubernetes_host="https://$KUBERNETES_SERVICE_HOST:$KUBERNETES_SERVICE_PORT" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
  token_reviewer_jwt=@/var/run/secrets/kubernetes.io/serviceaccount/token
```

#### Step 5: Create Secrets

```bash
# Enable KV v2 secret engine
vault secrets enable -version=2 kv

# Create database credentials
vault kv put secret/pivori/database \
  username="admin" \
  password="secure-password" \
  host="postgres.default.svc.cluster.local" \
  port="5432" \
  database="pivori"

# Create API keys
vault kv put secret/pivori/api-keys \
  stripe-key="sk_test_..." \
  openai-key="sk-..." \
  github-token="ghp_..."
```

#### Step 6: Create Policies & Roles

```bash
# Create policy for services
vault policy write pivori-policy - <<EOF
path "secret/data/pivori/*" {
  capabilities = ["read", "list"]
}
path "database/creds/pivori-*" {
  capabilities = ["read"]
}
EOF

# Create role for services
vault write auth/kubernetes/role/pivori-role \
  bound_service_account_names=default \
  bound_service_account_namespaces=pivori-production \
  policies=pivori-policy \
  ttl=24h
```

#### Step 7: Use Vault in Deployments

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: geolocation
  namespace: pivori-production
spec:
  template:
    spec:
      serviceAccountName: default
      containers:
        - name: geolocation
          env:
            - name: VAULT_ADDR
              value: "https://vault.vault.svc.cluster.local:8200"
            - name: VAULT_ROLE
              value: "pivori-role"
```

**Success Criteria**:
- ✅ Vault cluster running (3 replicas)
- ✅ Initialized and unsealed
- ✅ Auth methods configured
- ✅ Secrets stored
- ✅ Policies created
- ✅ Deployments using Vault

---

## 2️⃣ DATABASE BACKUP (VELERO)

### 2.1 What is it?

Velero provides backup and disaster recovery for Kubernetes clusters, including persistent volumes and databases.

### 2.2 Installation

#### Step 1: Install Velero CLI

```bash
# macOS
brew install velero

# Linux
wget https://github.com/vmware-tanzu/velero/releases/download/v1.12.0/velero-v1.12.0-linux-amd64.tar.gz
tar xfz velero-v1.12.0-linux-amd64.tar.gz
sudo mv velero-v1.12.0-linux-amd64/velero /usr/local/bin/

# Verify
velero version
```

#### Step 2: Configure AWS S3

```bash
# Create S3 bucket
aws s3 mb s3://pivori-backups --region us-east-1

# Create IAM policy
cat > velero-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObject",
        "s3:AbortMultipartUpload",
        "s3:ListMultipartUploadParts"
      ],
      "Resource": "arn:aws:s3:::pivori-backups/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::pivori-backups"
    }
  ]
}
EOF

# Create IAM user and attach policy
aws iam create-user --user-name velero
aws iam put-user-policy --user-name velero --policy-name velero-policy --policy-document file://velero-policy.json
aws iam create-access-key --user-name velero
```

#### Step 3: Apply Velero Setup

```bash
# Update credentials in velero-backup-setup.yaml
# Then apply
kubectl apply -f kubernetes/velero-backup-setup.yaml

# Verify installation
kubectl get pods -n velero
kubectl get backupstoragelocations -n velero
```

#### Step 4: Create Backups

```bash
# Create on-demand backup
velero backup create manual-backup-$(date +%s)

# Check backup status
velero backup get
velero backup describe manual-backup-<timestamp>

# Check backup logs
velero backup logs manual-backup-<timestamp>
```

#### Step 5: Verify Backups

```bash
# List all backups
velero backup get

# Check backup details
velero backup describe daily-backup --details

# Check backup contents
velero backup logs daily-backup
```

#### Step 6: Test Restore

```bash
# Create a test restore
velero restore create --from-backup daily-backup --wait

# Check restore status
velero restore get
velero restore describe <restore-name>

# Verify restored resources
kubectl get pods -n pivori-production
```

**Success Criteria**:
- ✅ Velero installed
- ✅ S3 bucket configured
- ✅ Backup schedules running
- ✅ Backups stored in S3
- ✅ Restore tested successfully
- ✅ Monitoring alerts configured

---

## 3️⃣ AUDIT LOGGING

### 3.1 What is it?

Audit logging tracks all access to resources, changes to configurations, and security events.

### 3.2 Installation

#### Step 1: Apply Audit Logging Setup

```bash
# Apply audit configuration
kubectl apply -f kubernetes/audit-logging-setup.yaml

# Verify installation
kubectl get pods -n audit-logging
kubectl get daemonset -n audit-logging
```

#### Step 2: Configure Kubernetes API Server

```bash
# Edit API server configuration
sudo vi /etc/kubernetes/manifests/kube-apiserver.yaml

# Add audit policy volume
volumes:
  - name: audit-policy
    configMap:
      name: audit-policy
      namespace: audit-logging

# Add audit policy mount
volumeMounts:
  - name: audit-policy
    mountPath: /etc/kubernetes/audit-policy
    readOnly: true

# Add audit log flag
--audit-policy-file=/etc/kubernetes/audit-policy/audit-policy.yaml
--audit-log-maxage=30
--audit-log-maxbackup=10
--audit-log-maxsize=100
```

#### Step 3: Verify Audit Logs

```bash
# Check audit logs
kubectl logs -n audit-logging deployment/audit-logger

# Query Elasticsearch for audit events
curl -X GET "elasticsearch.monitoring.svc.cluster.local:9200/audit-*/_search?q=verb:delete"
```

#### Step 4: Create Audit Queries

```bash
# Query unauthorized access
curl -X GET "elasticsearch.monitoring.svc.cluster.local:9200/audit-*/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must": [
        { "term": { "status.code": 401 } }
      ]
    }
  }
}'

# Query secret access
curl -X GET "elasticsearch.monitoring.svc.cluster.local:9200/audit-*/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must": [
        { "term": { "objectRef.resource": "secrets" } }
      ]
    }
  }
}'
```

**Success Criteria**:
- ✅ Audit logging deployed
- ✅ Logs collected to Elasticsearch
- ✅ Queries working
- ✅ Alerts configured
- ✅ Retention policy set
- ✅ Dashboard created

---

## 4️⃣ SBOM GENERATION

### 4.1 What is it?

SBOM (Software Bill of Materials) documents all components, dependencies, and vulnerabilities in your images.

### 4.2 Implementation

#### Step 1: Install Syft

```bash
# macOS
brew install syft

# Linux
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin

# Verify
syft version
```

#### Step 2: Generate SBOM

```bash
# Generate SBOM for Docker image
syft ghcr.io/pivori-app/geolocation:latest -o json > geolocation-sbom.json

# Generate SBOM for all services
for service in geolocation routing proximity trading market-data payment iptv audio live game leaderboard reward document-scan watermark security; do
  syft ghcr.io/pivori-app/$service:latest -o json > $service-sbom.json
done
```

#### Step 3: Upload SBOM

```bash
# Store SBOM in artifact repository
curl -X POST "https://artifactory.pivori.app/artifactory/sbom/" \
  -H "X-JFrog-Art-Api:$ARTIFACTORY_TOKEN" \
  -T geolocation-sbom.json

# Or store in S3
aws s3 cp geolocation-sbom.json s3://pivori-sbom/
```

#### Step 4: Integrate in CI/CD

```yaml
# Add to GitHub Actions workflow
- name: Generate SBOM
  run: |
    syft ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.VERSION }} \
      -o json > sbom.json
    syft ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.VERSION }} \
      -o spdx > sbom.spdx
    syft ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.VERSION }} \
      -o cyclonedx > sbom.xml

- name: Upload SBOM
  run: |
    aws s3 cp sbom.json s3://pivori-sbom/
    aws s3 cp sbom.spdx s3://pivori-sbom/
    aws s3 cp sbom.xml s3://pivori-sbom/
```

**Success Criteria**:
- ✅ SBOM generated for all images
- ✅ SBOM stored in artifact repository
- ✅ SBOM integrated in CI/CD
- ✅ Vulnerability scanning enabled
- ✅ SBOM accessible for compliance

---

## 5️⃣ IMAGE SIGNING (COSIGN)

### 5.1 What is it?

Image signing ensures image integrity and authenticity using cryptographic signatures.

### 5.2 Implementation

#### Step 1: Install Cosign

```bash
# macOS
brew install sigstore/tap/cosign

# Linux
wget https://github.com/sigstore/cosign/releases/download/v2.0.0/cosign-linux-amd64
chmod +x cosign-linux-amd64
sudo mv cosign-linux-amd64 /usr/local/bin/cosign

# Verify
cosign version
```

#### Step 2: Generate Keys

```bash
# Generate keypair
cosign generate-key-pair

# This creates:
# - cosign.key (private key)
# - cosign.pub (public key)

# Store private key securely
# Add public key to repository
git add cosign.pub
git commit -m "Add Cosign public key"
```

#### Step 3: Sign Images

```bash
# Sign Docker image
cosign sign --key cosign.key ghcr.io/pivori-app/geolocation:latest

# Sign all services
for service in geolocation routing proximity trading market-data payment iptv audio live game leaderboard reward document-scan watermark security; do
  cosign sign --key cosign.key ghcr.io/pivori-app/$service:latest
done
```

#### Step 4: Verify Signatures

```bash
# Verify image signature
cosign verify --key cosign.pub ghcr.io/pivori-app/geolocation:latest

# Verify all services
for service in geolocation routing proximity trading market-data payment iptv audio live game leaderboard reward document-scan watermark security; do
  cosign verify --key cosign.pub ghcr.io/pivori-app/$service:latest
done
```

#### Step 5: Integrate in CI/CD

```yaml
# Add to GitHub Actions workflow
- name: Sign Image
  run: |
    cosign sign --key ${{ secrets.COSIGN_KEY }} \
      ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.VERSION }}

- name: Verify Signature
  run: |
    cosign verify --key ${{ secrets.COSIGN_KEY }}.pub \
      ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.VERSION }}
```

#### Step 6: Enforce Image Signing in Kubernetes

```yaml
# ClusterPolicy to enforce signed images
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: image-signature-verification
webhooks:
  - name: image-signature-verification.pivori.app
    clientConfig:
      service:
        name: cosign-webhook
        namespace: cosign
        path: "/verify"
      caBundle: LS0tLS1CRUdJTi... # base64 encoded cert
    rules:
      - operations: ["CREATE", "UPDATE"]
        apiGroups: ["apps"]
        apiVersions: ["v1"]
        resources: ["deployments", "daemonsets", "statefulsets"]
```

**Success Criteria**:
- ✅ Keys generated and stored securely
- ✅ All images signed
- ✅ Signatures verified
- ✅ Signing integrated in CI/CD
- ✅ Kubernetes enforces signed images

---

## 📋 IMPLEMENTATION CHECKLIST

### Pre-Implementation

- [ ] Read this guide completely
- [ ] Backup current configuration
- [ ] Create test environment
- [ ] Notify team of changes

### Phase 2 Implementation

- [ ] **HashiCorp Vault** (8h)
  - [ ] Install Vault cluster
  - [ ] Initialize and unseal
  - [ ] Configure auth methods
  - [ ] Create secrets
  - [ ] Create policies
  - [ ] Update deployments

- [ ] **Database Backup** (4h)
  - [ ] Install Velero
  - [ ] Configure S3
  - [ ] Create backup schedules
  - [ ] Test backups
  - [ ] Test restore
  - [ ] Monitor backups

- [ ] **Audit Logging** (6h)
  - [ ] Deploy audit logging
  - [ ] Configure API server
  - [ ] Verify logs collection
  - [ ] Create queries
  - [ ] Setup alerts
  - [ ] Create dashboards

- [ ] **SBOM Generation** (2h)
  - [ ] Install Syft
  - [ ] Generate SBOMs
  - [ ] Upload to repository
  - [ ] Integrate in CI/CD
  - [ ] Setup scanning

- [ ] **Image Signing** (3h)
  - [ ] Install Cosign
  - [ ] Generate keys
  - [ ] Sign images
  - [ ] Verify signatures
  - [ ] Integrate in CI/CD
  - [ ] Enforce in Kubernetes

### Post-Implementation

- [ ] Run full test suite
- [ ] Deploy to staging
- [ ] Monitor for issues
- [ ] Document procedures
- [ ] Train team
- [ ] Update runbooks

---

## 🧪 TESTING PROCEDURES

### Test 1: Vault Access

```bash
# Verify Vault is accessible
vault status

# Test secret retrieval
vault kv get secret/pivori/database
```

### Test 2: Backup & Restore

```bash
# Create backup
velero backup create test-backup

# Wait for completion
velero backup get test-backup

# Create restore
velero restore create --from-backup test-backup

# Verify restore
velero restore get
```

### Test 3: Audit Logging

```bash
# Trigger audit event
kubectl get secrets -n pivori-production

# Check audit logs
kubectl logs -n audit-logging deployment/audit-logger
```

### Test 4: SBOM

```bash
# Generate SBOM
syft ghcr.io/pivori-app/geolocation:latest -o json

# Verify SBOM
cat sbom.json | jq '.artifacts | length'
```

### Test 5: Image Signing

```bash
# Sign image
cosign sign --key cosign.key ghcr.io/pivori-app/geolocation:latest

# Verify signature
cosign verify --key cosign.pub ghcr.io/pivori-app/geolocation:latest
```

---

## 📊 METRICS & MONITORING

### Key Metrics

```
- Vault uptime: >99.9%
- Backup success rate: 100%
- Restore success rate: 100%
- Audit log completeness: 100%
- Image signature verification: 100%
```

---

## ✅ SIGN-OFF

- [ ] Implementation completed
- [ ] All tests passed
- [ ] Team trained
- [ ] Documentation updated
- [ ] Production deployment approved

**Date**: ___________  
**Implemented By**: ___________  
**Reviewed By**: ___________  

---

**Status**: Ready for Production ✅

