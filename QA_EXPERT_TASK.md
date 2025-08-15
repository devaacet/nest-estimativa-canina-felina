# TASK DELEGATION: QA-EXPERT - CONTROLLERS UNIT TESTS

## OVERVIEW
Você é responsável pela criação de testes unitários completos para todos os **CONTROLLERS** do projeto api-pet-research. Foque em endpoints HTTP, DTOs, autenticação, validações de entrada e responses.

## PROJECT CONTEXT
- NestJS + TypeORM + PostgreSQL  
- Jest + Supertest para testes HTTP
- Authentication com JWT via cookies
- Swagger API documentation
- 5 domínios DDD: auth, geographic, forms, animals, audit

## CONTROLLERS TO TEST (Priority Order):

### 1. AUTH CONTROLLER (CRITICAL PRIORITY)
**File**: `src/apps/auth/auth.controller.ts`
**Endpoints to Test**:
- `POST /auth/login` - Login com credentials, set cookies
- `POST /auth/register` - User registration  
- `POST /auth/refresh` - Refresh access token via cookie
- `POST /auth/logout` - Logout and clear cookies
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

**Key Testing Focus**:
- HTTP status codes (200, 201, 400, 401)
- Cookie setting/clearing (httpOnly, secure, sameSite)
- Request/response body validation
- Error responses format
- JWT token handling
- Input DTO validation

### 2. FORMS CONTROLLER (HIGH PRIORITY)
**File**: `src/apps/forms/forms.controller.ts`
**Expected Endpoints** (analyze and test all):
- Form CRUD operations
- Step-by-step form workflow
- Form validation endpoints
- Question response endpoints
- Form completion handling

### 3. ANIMALS CONTROLLER (MEDIUM PRIORITY)  
**File**: `src/apps/animals/animals.controller.ts`
**Expected Endpoints**:
- Current animals CRUD
- Previous animals CRUD
- Puppies/kittens CRUD  
- Animal absence CRUD
- Bulk operations if any

### 4. GEOGRAPHIC CONTROLLER (MEDIUM PRIORITY)
**File**: `src/apps/geographic/geographic.controller.ts`  
**Expected Endpoints**:
- Cities CRUD operations
- City questions CRUD
- Geographic data filtering

### 5. AUDIT CONTROLLER (LOW PRIORITY)
**File**: `src/apps/audit/audit.controller.ts`
**Expected Endpoints**:
- Audit logs retrieval
- Export request handling
- Log filtering and pagination

## TESTING STANDARDS

### File Structure
```
src/apps/[domain]/
└── [domain].controller.spec.ts
```

### Controller Test Template
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),  
      refreshTokens: jest.fn(),
      requestPasswordReset: jest.fn(),
      resetPassword: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    authService = moduleFixture.get(AuthService);
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should login successfully and set cookies', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const mockResult = {
        user: { id: '1', email: 'test@example.com', role: 'pesquisador' },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      authService.login.mockResolvedValue(mockResult);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          user: expect.objectContaining({
            id: '1',
            email: 'test@example.com',
            role: 'pesquisador',
          }),
          permissions: expect.any(Array),
        },
      });

      // Verify cookies are set
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'].some(cookie => 
        cookie.includes('access_token='))).toBe(true);
      expect(response.headers['set-cookie'].some(cookie => 
        cookie.includes('refresh_token='))).toBe(true);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = { email: 'test@example.com', password: 'wrong' };
      
      authService.login.mockRejectedValue(
        new UnauthorizedException('Credenciais inválidas')
      );

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Credenciais inválidas',
      });
    });

    it('should validate required fields', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({}) // Empty body
        .expect(400);

      await request(app.getHttpServer())
        .post('/auth/login')  
        .send({ email: 'invalid-email' }) // Missing password
        .expect(400);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout and clear cookies', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: { loggedOut: true },
      });

      // Verify cookies are cleared
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'].some(cookie => 
        cookie.includes('access_token=;'))).toBe(true);
    });
  });

  // More endpoint tests...
});
```

### HTTP Testing Requirements

#### Status Codes to Test
- **200**: Successful GET/POST/PUT operations  
- **201**: Successful resource creation
- **400**: Bad request (validation errors, malformed data)
- **401**: Unauthorized (missing/invalid auth)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found (invalid resource ID)
- **422**: Unprocessable entity (business logic errors)
- **500**: Internal server error (unexpected errors)

#### Request/Response Testing
```typescript
// Test request body validation
it('should validate request body schema', async () => {
  const invalidData = { /* invalid structure */ };
  
  await request(app.getHttpServer())
    .post('/endpoint')
    .send(invalidData)
    .expect(400)
    .expect(res => {
      expect(res.body.message).toContain('validation failed');
    });
});

// Test response structure
it('should return correct response structure', async () => {
  const response = await request(app.getHttpServer())
    .get('/endpoint')
    .expect(200);

  expect(response.body).toMatchObject({
    success: true,
    data: expect.any(Object),
    // timestamp, etc.
  });
});
```

#### Authentication Testing
```typescript
describe('Authentication', () => {
  it('should require valid JWT token', async () => {
    await request(app.getHttpServer())
      .get('/protected-endpoint')
      .expect(401);
  });

  it('should accept valid JWT in cookie', async () => {
    const validToken = 'valid-jwt-token';
    
    await request(app.getHttpServer())
      .get('/protected-endpoint')
      .set('Cookie', [`access_token=${validToken}`])
      .expect(200);
  });

  it('should check user permissions', async () => {
    const limitedUserToken = 'token-for-limited-user';
    
    await request(app.getHttpServer())
      .post('/admin-only-endpoint')
      .set('Cookie', [`access_token=${limitedUserToken}`])
      .expect(403);
  });
});
```

#### Cookie Testing
```typescript
it('should set secure cookies in production', async () => {
  process.env.NODE_ENV = 'production';
  
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send(validCredentials);

  const cookies = response.headers['set-cookie'];
  expect(cookies.some(cookie => 
    cookie.includes('Secure') && cookie.includes('HttpOnly')
  )).toBe(true);
  
  delete process.env.NODE_ENV;
});
```

### DTO Validation Testing
```typescript
describe('DTO Validation', () => {
  it('should validate email format', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'invalid-email', password: 'pass123' })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('email must be a valid email');
      });
  });

  it('should validate password strength', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@test.com', password: '123' })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('password too short');
      });
  });
});
```

### Service Mocking Strategy
```typescript
const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  refreshTokens: jest.fn(),
  // Mock ALL service methods used by controller
};

// In tests:
authService.login.mockResolvedValue(successResult);
authService.login.mockRejectedValue(new UnauthorizedException());
```

## TESTING APPROACH BY CONTROLLER

### AUTH CONTROLLER Testing Focus
- **Login**: Credentials validation, cookie setting, user permissions
- **Register**: User creation, email validation, password hashing
- **Refresh**: Token validation, new token generation
- **Logout**: Cookie clearing, session termination  
- **Password Reset**: Token generation, email sending, password update

### FORMS CONTROLLER Testing Focus  
- **Form Workflow**: 8-step progression, validation at each step
- **CRUD Operations**: Create, read, update, delete forms
- **Question Responses**: Answer submission and validation
- **Form Completion**: Final validation and submission

### Other Controllers
- **Animals**: CRUD for all animal types, data validation
- **Geographic**: City management, custom questions
- **Audit**: Log retrieval, export functionality, filtering

## COVERAGE & PERFORMANCE

### Coverage Requirements
- **Minimum 80% overall coverage** for controllers
- **90%+ for critical controllers** (auth, forms)  
- **100% endpoint coverage** (every route tested)
- Use `npm run test:cov` to verify

### Performance Requirements
- Tests must complete in < 10 seconds total
- Use proper service mocking (no real HTTP calls)
- Parallel test execution where possible

## INTEGRATION WITH BACKEND-EXPERT

- Backend-expert handles service layer tests
- Your controller tests should mock all services  
- Share test utilities and mock factories
- Coordinate on shared interfaces and DTOs

## DELIVERABLES

1. **Test Files**: One .spec.ts file per controller (5 files total)
2. **Coverage Report**: Achieve 80%+ coverage for all controllers  
3. **HTTP Test Utilities**: Shared utilities in `test/utils/`
4. **Mock Factories**: Reusable mock data generators
5. **Test Documentation**: Document complex test scenarios

## TESTING COMMANDS
```bash
# Run specific controller tests
npm test -- auth.controller.spec.ts

# Run all controller tests  
npm test -- --testPathPattern=controller.spec.ts

# Generate coverage report
npm run test:cov

# Watch mode for development
npm run test:watch
```

## TIMELINE
- **Day 1**: Auth controller (critical) + test setup utilities
- **Day 2**: Forms and Animals controllers
- **Day 3**: Geographic and Audit controllers + coverage optimization

Start with AuthController as it's the foundation for authentication in other controllers. Focus on comprehensive HTTP scenario testing and proper cookie handling.

Let me know if you need clarification on any endpoint testing approach or authentication flow testing.