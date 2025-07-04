# Deployment Documentation

## Overview

OWL uses AWS Amplify Gen2 for seamless deployment of both frontend and backend infrastructure. This document covers local development, staging, and production deployment strategies.

## Deployment Environments

### Local Development (Sandbox)
- **Purpose**: Development and testing
- **Infrastructure**: Temporary AWS resources
- **Data**: Isolated per developer
- **Cost**: Minimal (pay-per-use)

### Staging/Preview
- **Purpose**: Pre-production testing
- **Infrastructure**: Persistent AWS resources
- **Data**: Shared test data
- **Cost**: Moderate (always-on resources)

### Production
- **Purpose**: Live application
- **Infrastructure**: Optimized AWS resources
- **Data**: Real user data
- **Cost**: Varies with usage

## Local Development Setup

### Prerequisites
```bash
# Required software
node --version    # v18 or higher
npm --version     # v8 or higher
aws --version     # AWS CLI (optional)
```

### Initial Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd OWL

# 2. Install dependencies
npm install

# 3. Configure AWS credentials (if not using default profile)
aws configure

# 4. Start sandbox environment
npx ampx sandbox
```

### Development Workflow
```bash
# Terminal 1: Backend (Sandbox)
npx ampx sandbox

# Terminal 2: Frontend (Dev Server)
npm run dev

# Access application
open http://localhost:5173
```

### Sandbox Management
```bash
# Start with specific profile
npx ampx sandbox --profile my-aws-profile

# Deploy once (no file watching)
npx ampx sandbox --once

# Clean up resources
npx ampx sandbox delete
```

## Production Deployment

### Method 1: Git-based Deployment (Recommended)

#### Step 1: Repository Setup
```bash
# Push code to Git repository
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: AWS Amplify Console Setup
1. **Navigate to AWS Amplify Console**
   ```
   https://console.aws.amazon.com/amplify
   ```

2. **Create New App**
   - Click "New app" → "Host web app"
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Select repository and branch

3. **Configure Build Settings**
   ```yaml
   # amplify.yml (auto-detected)
   version: 1
   backend:
     phases:
       build:
         commands:
           - npm ci --cache .npm --prefer-offline
           - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
   frontend:
     phases:
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - .npm/**/*
         - node_modules/**/*
   ```

4. **Environment Variables** (if needed)
   ```
   NODE_ENV=production
   VITE_API_ENDPOINT=auto-generated
   ```

5. **Deploy**
   - Review settings
   - Click "Save and deploy"
   - Monitor build progress

#### Step 3: Domain Configuration (Optional)
```bash
# Custom domain setup
1. Add domain in Amplify Console
2. Configure DNS records
3. SSL certificate auto-provisioned
```

### Method 2: Manual Deployment

#### Backend Deployment
```bash
# Deploy backend to specific branch
npx ampx pipeline-deploy --branch production

# Deploy with specific app ID
npx ampx pipeline-deploy --branch main --app-id <app-id>
```

#### Frontend Deployment
```bash
# Build for production
npm run build

# Output directory: dist/
# Upload to any static hosting service
```

## CI/CD Pipeline

### Automatic Deployment Triggers
- **Push to main**: Triggers production deployment
- **Pull Request**: Creates preview deployment
- **Branch push**: Creates branch-specific deployment

### Build Process
```yaml
# Build phases
1. Install dependencies (npm ci)
2. Backend deployment (ampx pipeline-deploy)
3. Frontend build (npm run build)
4. Asset optimization
5. CDN cache invalidation
6. Health checks
```

### Build Configuration

#### Custom Build Commands
```yaml
# amplify.yml - Custom configuration
version: 1
backend:
  phases:
    preBuild:
      commands:
        - echo "Backend pre-build"
    build:
      commands:
        - npm ci
        - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
    postBuild:
      commands:
        - echo "Backend post-build"

frontend:
  phases:
    preBuild:
      commands:
        - echo "Frontend pre-build"
        - npm ci
    build:
      commands:
        - npm run build
    postBuild:
      commands:
        - echo "Frontend post-build"
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .npm/**/*
```

#### Environment-specific Configuration
```yaml
# Different configs per branch
version: 1
backend:
  phases:
    build:
      commands:
        - |
          if [ "$AWS_BRANCH" = "main" ]; then
            echo "Production build"
            npx ampx pipeline-deploy --branch main --app-id $AWS_APP_ID
          else
            echo "Development build"
            npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
          fi
```

## Infrastructure as Code

### AWS Resources Created
```yaml
Resources:
  # Authentication
  UserPool: AWS::Cognito::UserPool
  UserPoolClient: AWS::Cognito::UserPoolClient
  IdentityPool: AWS::Cognito::IdentityPool
  
  # API
  GraphQLApi: AWS::AppSync::GraphQLApi
  GraphQLSchema: AWS::AppSync::GraphQLSchema
  DataSource: AWS::AppSync::DataSource
  
  # Database
  TodoTable: AWS::DynamoDB::Table
  
  # Storage
  S3Bucket: AWS::S3::Bucket
  
  # CDN
  CloudFrontDistribution: AWS::CloudFront::Distribution
```

### Resource Naming Convention
```
amplify-{app-name}-{env}-{resource-type}-{unique-id}

Examples:
- amplify-owl-main-userpool-abc123
- amplify-owl-dev-table-def456
- amplify-owl-main-bucket-ghi789
```

## Environment Management

### Environment Variables
```bash
# Local (.env.local)
VITE_APP_NAME="OWL Development"
VITE_DEBUG=true

# Staging
VITE_APP_NAME="OWL Staging"
VITE_DEBUG=false

# Production
VITE_APP_NAME="OWL"
VITE_DEBUG=false
```

### Feature Flags
```typescript
// Feature flag configuration
const features = {
  enableExport: process.env.NODE_ENV === 'production',
  enableBulkOperations: false,
  maxEntriesPerUser: 1000,
};
```

### Database Migrations
```bash
# Schema changes deployment
1. Update amplify/data/resource.ts
2. Push to Git
3. Amplify automatically handles schema migration
4. Zero-downtime deployment
```

## Monitoring & Logging

### CloudWatch Integration
```yaml
Metrics:
  - Frontend: Page views, error rates, performance
  - Backend: API requests, error rates, latency
  - Database: Read/write capacity, throttles

Logs:
  - Lambda function logs
  - AppSync request/response logs
  - CloudFront access logs
```

### Custom Monitoring
```typescript
// Frontend error tracking
window.addEventListener('error', (event) => {
  console.error('Frontend error:', event.error);
  // Send to monitoring service
});

// API error tracking
client.models.Todo.create(data).catch((error) => {
  console.error('API error:', error);
  // Send to monitoring service
});
```

## Security Considerations

### Build Security
```yaml
Security Measures:
  - Dependencies vulnerability scanning
  - Code quality checks (ESLint, TypeScript)
  - Secrets management via environment variables
  - No sensitive data in build artifacts
```

### Deployment Security
```yaml
Access Control:
  - IAM roles for deployment permissions
  - Branch-based access control
  - Environment isolation
  - Resource tagging for governance
```

## Rollback Procedures

### Automatic Rollback
```yaml
Conditions:
  - Build failure
  - Health check failure
  - Error rate threshold exceeded

Process:
  1. Stop deployment
  2. Restore previous version
  3. Invalidate CDN cache
  4. Send notifications
```

### Manual Rollback
```bash
# Via Amplify Console
1. Go to Amplify Console
2. Select app and branch
3. Click on previous deployment
4. Click "Redeploy this version"

# Via CLI
npx ampx pipeline-deploy --branch main --commit-id <previous-commit>
```

## Performance Optimization

### Build Optimization
```yaml
Techniques:
  - Tree shaking (Vite)
  - Code splitting
  - Asset compression
  - Image optimization
  - CSS minification
```

### CDN Configuration
```yaml
CloudFront Settings:
  - Global edge locations
  - Gzip compression
  - Browser caching headers
  - Origin shield (optional)
```

## Cost Optimization

### Development
```yaml
Strategies:
  - Use sandbox for development
  - Auto-cleanup unused resources
  - Delete preview environments after PR merge
```

### Production
```yaml
Strategies:
  - DynamoDB on-demand pricing
  - CloudFront with appropriate cache policies
  - Lambda provisioned concurrency (if needed)
  - S3 intelligent tiering
```

## Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Check build logs
1. Open Amplify Console
2. Go to failed build
3. Expand build phases
4. Check error messages

# Common fixes
- Update Node.js version in build settings
- Clear cache and rebuild
- Check environment variables
```

#### Permission Issues
```bash
# IAM permissions
1. Check Amplify service role
2. Verify resource permissions
3. Update IAM policies if needed

# Common permissions needed
- DynamoDB: Read/Write
- AppSync: Full access
- S3: Read/Write
- CloudFormation: Stack operations
```

#### Resource Conflicts
```bash
# Resource naming conflicts
1. Check existing resources
2. Update resource names
3. Delete conflicting resources

# Clean up commands
aws cloudformation delete-stack --stack-name <stack-name>
aws s3 rb s3://<bucket-name> --force
```

### Health Checks
```bash
# Frontend health check
curl -I https://your-app.amplifyapp.com

# API health check
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { listTodos { items { id } } }"}' \
  https://your-api.appsync-api.region.amazonaws.com/graphql
```

## Disaster Recovery

### Backup Strategy
```yaml
Automated Backups:
  - DynamoDB point-in-time recovery
  - S3 versioning enabled
  - CloudFormation stack templates
  - Git repository as source of truth
```

### Recovery Procedures
```bash
# Complete environment recreation
1. Deploy from Git repository
2. Amplify recreates all resources
3. DynamoDB restores from backup
4. Test all functionality

# Data recovery
1. Use DynamoDB point-in-time recovery
2. Export/import data if needed
3. Validate data integrity
```