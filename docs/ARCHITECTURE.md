# Architecture Documentation

## Overview

OWL (Online Web Library) follows a modern, component-based architecture using React with TypeScript for the frontend and AWS Amplify Gen2 for the backend infrastructure.

## Frontend Architecture

### Component Structure

```
src/
├── components/           # UI Components
│   ├── TodoForm.tsx     # Entry creation form
│   └── TodoTable.tsx    # Data table with inline editing
├── hooks/               # Custom React Hooks
│   ├── useTodos.ts      # Todo data management & CRUD operations
│   └── useEditTodo.ts   # Inline editing state management
├── styles/              # Component-specific CSS
│   ├── App.css          # Main application styles
│   ├── TodoForm.css     # Form component styles
│   └── TodoTable.css    # Table component styles
└── App.tsx              # Root component
```

### Design Patterns

#### 1. Custom Hooks Pattern
- **Purpose**: Separate business logic from UI components
- **Benefits**: Reusability, testability, cleaner components
- **Examples**: `useTodos`, `useEditTodo`

#### 2. Component Composition
- **Purpose**: Build complex UI from simple, reusable components
- **Benefits**: Maintainability, modularity, single responsibility
- **Examples**: `TodoForm` + `TodoTable` compose the main interface

#### 3. Props Down, Events Up
- **Purpose**: Unidirectional data flow
- **Implementation**: Parent components pass data down, children emit events up
- **Example**: `App.tsx` manages state, components receive props and emit callbacks

### State Management

#### Local State (React useState)
```typescript
// App.tsx - UI state
const [showForm, setShowForm] = useState(false);

// useEditTodo - Editing state
const [editingId, setEditingId] = useState<string | null>(null);
const [editData, setEditData] = useState({...});
```

#### Server State (AWS Amplify)
```typescript
// useTodos - Real-time data
useEffect(() => {
  client.models.Todo.observeQuery().subscribe({
    next: (data) => setTodos([...data.items]),
  });
}, []);
```

## Backend Architecture

### AWS Amplify Gen2 Stack

```
Backend Infrastructure:
├── Authentication (Amazon Cognito)
│   ├── User Pool
│   ├── Identity Pool
│   └── Email verification
├── API (AWS AppSync)
│   ├── GraphQL Schema
│   ├── Real-time subscriptions
│   └── Authorization rules
├── Database (Amazon DynamoDB)
│   ├── Todo table
│   ├── Owner-based isolation
│   └── Auto-scaling
└── Hosting (AWS Amplify Hosting)
    ├── Global CDN
    ├── SSL certificates
    └── Custom domains
```

### Data Model

```typescript
// amplify/data/resource.ts
const schema = a.schema({
  Todo: a.model({
    name: a.string(),      // Resource title
    type: a.string(),      // Written | Illustrated | Video
    url: a.string(),       // Resource URL
    creator: a.string(),   // Author/creator name
  }).authorization(allow => [allow.owner()]),
});
```

### Authorization Model

#### Owner-based Access Control
- **Principle**: Users can only access their own data
- **Implementation**: `allow.owner()` in schema
- **Security**: Automatic user isolation at database level

#### Authentication Flow
1. User signs up/signs in via Cognito
2. JWT token issued with user identity
3. AppSync validates token on each request
4. DynamoDB queries filtered by owner

## Data Flow

### Create Todo Flow
```
1. User fills form (TodoForm)
2. Form validates input
3. App.tsx calls useTodos.createTodo()
4. GraphQL mutation sent to AppSync
5. DynamoDB record created with owner field
6. Real-time subscription updates all clients
7. UI automatically updates with new data
```

### Real-time Updates Flow
```
1. User A creates/updates/deletes todo
2. DynamoDB change triggers AppSync subscription
3. AppSync pushes update via WebSocket
4. User B's client receives update
5. useTodos hook updates local state
6. Components re-render with new data
```

## Security Architecture

### Authentication
- **Provider**: Amazon Cognito User Pools
- **Flow**: OAuth 2.0 / OpenID Connect
- **Features**: Email verification, password policies, MFA support

### Authorization
- **Level**: GraphQL field-level
- **Rules**: Owner-based access control
- **Implementation**: Automatic user context injection

### Data Protection
- **Transit**: HTTPS/WSS encryption
- **Rest**: DynamoDB encryption at rest
- **Validation**: Client and server-side input validation

## Performance Optimizations

### Frontend
- **Code Splitting**: Vite automatic chunking
- **Lazy Loading**: Dynamic imports for large components
- **Memoization**: React hooks for expensive calculations
- **CSS**: Component-scoped styles, no runtime overhead

### Backend
- **Caching**: DynamoDB DAX, AppSync response caching
- **Real-time**: WebSocket connections for live updates
- **CDN**: CloudFront for static asset delivery
- **Auto-scaling**: DynamoDB on-demand scaling

## Development Workflow

### Local Development
```bash
# Backend (Sandbox)
npx ampx sandbox

# Frontend (Development Server)
npm run dev
```

### Build Process
```bash
# TypeScript compilation
tsc --noEmit

# Vite build
npm run build
# Output: dist/ folder with optimized assets
```

### Deployment Pipeline
```yaml
# amplify.yml
backend:
  phases:
    build:
      commands:
        - npm ci
        - npx ampx pipeline-deploy --branch $AWS_BRANCH

frontend:
  phases:
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
```

## Scaling Considerations

### Horizontal Scaling
- **Frontend**: CDN distribution, multiple edge locations
- **Backend**: AppSync auto-scales, DynamoDB on-demand
- **Database**: Automatic partitioning and replication

### Vertical Scaling
- **Compute**: Lambda functions scale automatically
- **Storage**: DynamoDB handles increased throughput
- **Bandwidth**: CloudFront edge caching reduces origin load

## Testing Strategy

### Unit Tests
- **Components**: React Testing Library
- **Hooks**: React Hooks Testing Library
- **Utils**: Jest for pure functions

### Integration Tests
- **API**: GraphQL query/mutation testing
- **Auth**: Cognito integration tests
- **E2E**: Cypress for full workflow testing

### Performance Tests
- **Load**: Artillery for API load testing
- **Frontend**: Lighthouse for performance metrics
- **Database**: DynamoDB performance monitoring

## Monitoring & Observability

### Metrics
- **Frontend**: Core Web Vitals, error rates
- **Backend**: AppSync request metrics, Lambda performance
- **Database**: DynamoDB read/write capacity, throttling

### Logging
- **Frontend**: Console errors, user actions
- **Backend**: CloudWatch logs from Lambda functions
- **API**: AppSync request/response logging

### Alerting
- **Errors**: CloudWatch alarms for error rates
- **Performance**: Response time degradation alerts
- **Capacity**: DynamoDB throttling notifications

## Future Architecture Considerations

### Microservices
- **Split**: Authentication, Todo management, User preferences
- **Benefits**: Independent scaling, technology diversity
- **Challenges**: Distributed data, transaction complexity

### Event-Driven Architecture
- **Events**: User actions, data changes, system events
- **Benefits**: Loose coupling, better scalability
- **Tools**: EventBridge, SNS/SQS for async processing

### Multi-tenant Architecture
- **Isolation**: Separate DynamoDB tables per tenant
- **Routing**: Subdomain-based tenant identification
- **Benefits**: Better isolation, custom configurations