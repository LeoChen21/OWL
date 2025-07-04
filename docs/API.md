# API Documentation

## Overview

OWL uses AWS AppSync GraphQL API for all data operations. The API provides real-time capabilities through subscriptions and secure access through AWS Cognito authentication.

## Authentication

All API requests require authentication via AWS Cognito User Pool JWT tokens.

### Authentication Headers
```
Authorization: Bearer <JWT_TOKEN>
```

### Authentication Flow
1. User signs in via Cognito
2. Receive JWT access token
3. Include token in all API requests
4. Token automatically handled by Amplify client

## GraphQL Schema

### Todo Model

```graphql
type Todo {
  id: ID!
  name: String!
  type: String!
  url: String!
  creator: String!
  owner: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

#### Field Descriptions

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | ID | Unique identifier | Auto-generated |
| `name` | String | Resource title/name | Yes |
| `type` | String | Resource type (Written, Illustrated, Video) | Yes |
| `url` | String | Resource URL | Yes |
| `creator` | String | Author/creator name | Yes |
| `owner` | String | User who owns this entry | Auto-set |
| `createdAt` | AWSDateTime | Creation timestamp | Auto-generated |
| `updatedAt` | AWSDateTime | Last update timestamp | Auto-generated |

## Operations

### Queries

#### List Todos
```graphql
query ListTodos {
  listTodos {
    items {
      id
      name
      type
      url
      creator
      createdAt
      updatedAt
    }
    nextToken
  }
}
```

**Response:**
```json
{
  "data": {
    "listTodos": {
      "items": [
        {
          "id": "abc123",
          "name": "React Documentation",
          "type": "Written",
          "url": "https://react.dev",
          "creator": "React Team",
          "createdAt": "2024-01-01T10:00:00Z",
          "updatedAt": "2024-01-01T10:00:00Z"
        }
      ],
      "nextToken": null
    }
  }
}
```

#### Get Todo by ID
```graphql
query GetTodo($id: ID!) {
  getTodo(id: $id) {
    id
    name
    type
    url
    creator
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "abc123"
}
```

### Mutations

#### Create Todo
```graphql
mutation CreateTodo($input: CreateTodoInput!) {
  createTodo(input: $input) {
    id
    name
    type
    url
    creator
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "TypeScript Handbook",
    "type": "Written",
    "url": "https://www.typescriptlang.org/docs/",
    "creator": "Microsoft"
  }
}
```

**Response:**
```json
{
  "data": {
    "createTodo": {
      "id": "def456",
      "name": "TypeScript Handbook",
      "type": "Written",
      "url": "https://www.typescriptlang.org/docs/",
      "creator": "Microsoft",
      "createdAt": "2024-01-01T11:00:00Z",
      "updatedAt": "2024-01-01T11:00:00Z"
    }
  }
}
```

#### Update Todo
```graphql
mutation UpdateTodo($input: UpdateTodoInput!) {
  updateTodo(input: $input) {
    id
    name
    type
    url
    creator
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "abc123",
    "name": "React Documentation (Updated)",
    "type": "Written",
    "url": "https://react.dev/learn",
    "creator": "React Team"
  }
}
```

#### Delete Todo
```graphql
mutation DeleteTodo($input: DeleteTodoInput!) {
  deleteTodo(input: $input) {
    id
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "abc123"
  }
}
```

### Subscriptions

#### Subscribe to Todo Changes
```graphql
subscription OnCreateTodo($owner: String!) {
  onCreateTodo(owner: $owner) {
    id
    name
    type
    url
    creator
    createdAt
  }
}
```

```graphql
subscription OnUpdateTodo($owner: String!) {
  onUpdateTodo(owner: $owner) {
    id
    name
    type
    url
    creator
    updatedAt
  }
}
```

```graphql
subscription OnDeleteTodo($owner: String!) {
  onDeleteTodo(owner: $owner) {
    id
  }
}
```

## Client Usage

### JavaScript/TypeScript (Amplify Client)

#### Setup
```typescript
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();
```

#### Create Todo
```typescript
const createTodo = async (todoData: {
  name: string;
  type: string;
  url: string;
  creator: string;
}) => {
  try {
    const result = await client.models.Todo.create(todoData);
    console.log('Created todo:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};
```

#### List Todos
```typescript
const listTodos = async () => {
  try {
    const result = await client.models.Todo.list();
    console.log('Todos:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error listing todos:', error);
    throw error;
  }
};
```

#### Update Todo
```typescript
const updateTodo = async (id: string, updates: Partial<{
  name: string;
  type: string;
  url: string;
  creator: string;
}>) => {
  try {
    const result = await client.models.Todo.update({
      id,
      ...updates
    });
    console.log('Updated todo:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};
```

#### Delete Todo
```typescript
const deleteTodo = async (id: string) => {
  try {
    const result = await client.models.Todo.delete({ id });
    console.log('Deleted todo:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};
```

#### Real-time Subscription
```typescript
const subscribeToTodos = () => {
  const subscription = client.models.Todo.observeQuery().subscribe({
    next: (data) => {
      console.log('Todos updated:', data.items);
      setTodos([...data.items]);
    },
    error: (error) => {
      console.error('Subscription error:', error);
    }
  });

  // Cleanup function
  return () => subscription.unsubscribe();
};
```

## Error Handling

### Common Error Types

#### Validation Errors
```json
{
  "errors": [
    {
      "message": "Variable '$input' of required type 'CreateTodoInput!' was not provided.",
      "locations": [{"line": 1, "column": 23}],
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED"
      }
    }
  ]
}
```

#### Authorization Errors
```json
{
  "errors": [
    {
      "message": "Not Authorized to access deleteTodo on type Mutation",
      "locations": [{"line": 2, "column": 3}],
      "path": ["deleteTodo"],
      "extensions": {
        "code": "UNAUTHORIZED"
      }
    }
  ]
}
```

#### Not Found Errors
```json
{
  "data": {
    "getTodo": null
  },
  "errors": [
    {
      "message": "Item not found",
      "locations": [{"line": 2, "column": 3}],
      "path": ["getTodo"]
    }
  ]
}
```

### Error Handling Best Practices

```typescript
const handleApiError = (error: any) => {
  if (error.errors) {
    // GraphQL errors
    error.errors.forEach((gqlError: any) => {
      switch (gqlError.extensions?.code) {
        case 'UNAUTHORIZED':
          // Redirect to login
          break;
        case 'GRAPHQL_VALIDATION_FAILED':
          // Show validation error
          break;
        default:
          // Generic error handling
          console.error('GraphQL error:', gqlError.message);
      }
    });
  } else {
    // Network or other errors
    console.error('Network error:', error.message);
  }
};
```

## Rate Limits

### Default Limits
- **Queries**: 1000 requests/second
- **Mutations**: 500 requests/second
- **Subscriptions**: 100 concurrent connections

### Best Practices
- Implement exponential backoff for retries
- Use pagination for large datasets
- Cache frequently accessed data
- Batch operations when possible

## Pagination

### List Operations
```typescript
const listTodosWithPagination = async (limit = 10, nextToken?: string) => {
  const result = await client.models.Todo.list({
    limit,
    nextToken
  });
  
  return {
    items: result.data,
    nextToken: result.nextToken,
    hasMore: !!result.nextToken
  };
};
```

### Infinite Scroll Implementation
```typescript
const useInfiniteTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [nextToken, setNextToken] = useState<string>();
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const result = await listTodosWithPagination(10, nextToken);
      setTodos(prev => [...prev, ...result.items]);
      setNextToken(result.nextToken);
    } finally {
      setLoading(false);
    }
  };

  return { todos, loadMore, hasMore: !!nextToken, loading };
};
```

## Security

### Owner-based Authorization
- Users can only access their own todos
- Automatic filtering by owner field
- No additional authorization logic needed

### Input Validation
- Server-side validation for all fields
- URL format validation
- String length limits
- Required field enforcement

### Best Practices
- Always validate input on client and server
- Use HTTPS for all requests
- Implement proper error handling
- Log security events for monitoring