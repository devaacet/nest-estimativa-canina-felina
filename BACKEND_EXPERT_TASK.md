# TASK DELEGATION: BACKEND-EXPERT - SERVICES UNIT TESTS

## OVERVIEW
Você é responsável pela criação de testes unitários completos para todos os **SERVICES** do projeto api-pet-research. Foque na lógica de negócio, validações, e tratamento de erros.

## PROJECT CONTEXT
- NestJS + TypeORM + PostgreSQL
- Jest já configurado (ts-jest, coverage enabled)
- 5 domínios: auth, geographic, forms, animals, audit
- DDD architecture com repositories pattern

## SERVICES TO TEST (Priority Order):

### 1. AUTH SERVICE (HIGH PRIORITY)
**File**: `src/apps/auth/auth.service.ts`
**Key Methods**:
- `login(credentials)` - JWT authentication, user validation
- `register(data)` - User creation, password hashing, email check
- `validateUser(email, password)` - bcrypt validation
- `generateTokens(user)` - JWT access/refresh tokens
- `refreshTokens(refreshToken)` - Token refresh logic
- `requestPasswordReset(email)` - Password reset token generation
- `resetPassword(token, newPassword)` - Password reset with token validation

**Test Requirements**:
- Mock UserRepository and PasswordResetRepository
- Mock JwtService and ConfigService
- Mock bcrypt functions
- Test all error scenarios (UnauthorizedException, BadRequestException)
- Test password hashing and validation
- Test JWT token generation and validation
- Test inactive user handling
- Coverage target: 90%+

### 2. FORMS SERVICE (HIGH PRIORITY)
**File**: `src/apps/forms/forms.service.ts`
**Expected Methods** (analyze and test all public methods):
- Form CRUD operations
- 8-step workflow logic
- Form validation logic
- Question response handling
- Form completion validation

### 3. ANIMALS SERVICE (MEDIUM PRIORITY)
**File**: `src/apps/animals/animals.service.ts`
**Expected Methods**:
- Current animals CRUD
- Previous animals CRUD  
- Puppies/kittens CRUD
- Animal absence CRUD
- Business logic validations

### 4. GEOGRAPHIC SERVICE (MEDIUM PRIORITY)
**File**: `src/apps/geographic/geographic.service.ts`
**Expected Methods**:
- Cities CRUD operations
- City questions CRUD
- Geographic validation logic

### 5. AUDIT SERVICE (LOW PRIORITY)
**File**: `src/apps/audit/audit.service.ts`
**Expected Methods**:
- Audit log creation
- Export request handling
- Log filtering and querying

## TESTING STANDARDS

### File Structure
```
src/apps/[domain]/
└── [domain].service.spec.ts
```

### Test Template Structure
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { PasswordResetRepository } from './repositories/password-reset.repository';

// Mock bcrypt
jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordResetRepository: jest.Mocked<PasswordResetRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateLastLogin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: PasswordResetRepository, useValue: mockPasswordResetRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    // ... other services
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Test implementation
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      // Test implementation  
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      // Test implementation
    });
  });

  // More test suites...
});
```

### Required Test Scenarios
For EACH method, test:
1. **Happy Path**: Successful execution with valid data
2. **Error Cases**: All possible exceptions and error conditions
3. **Edge Cases**: Null/undefined inputs, empty data, boundary conditions
4. **Business Logic**: All conditional branches and validations
5. **Repository Interactions**: Verify correct repository method calls
6. **External Dependencies**: Mock and verify JWT, bcrypt, config calls

### Mock Strategy
```typescript
// Repository mocks - return promises
const mockUserRepository = {
  findByEmail: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(mockUser),
  // ... other methods
};

// JWT Service mock
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn().mockReturnValue({ sub: 'user-id' }),
};

// bcrypt mocks
(bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
(bcrypt.compare as jest.Mock).mockResolvedValue(true);
```

### Coverage Requirements
- **Minimum 80% overall coverage** for services
- **90%+ for critical services** (auth, forms)
- **100% branch coverage** for authentication logic
- Use `npm run test:cov` to verify coverage

### Performance Requirements
- All tests must complete in < 5 seconds
- Use proper mocking to avoid database calls
- Clean up mocks between tests

### Error Testing Requirements
Test ALL exception scenarios:
- `UnauthorizedException` - invalid credentials, inactive users
- `BadRequestException` - validation failures, existing emails
- `NotFoundException` - missing resources
- Database connection errors
- External service failures

## DELIVERABLES

1. **Test Files**: One .spec.ts file per service (5 files total)
2. **Coverage Report**: Achieve 80%+ coverage for all services
3. **Mock Utilities**: Shared mock functions in `test/utils/` if needed
4. **Test Documentation**: Comment complex test scenarios

## TESTING COMMANDS
```bash
# Run specific service tests
npm test -- auth.service.spec.ts

# Run all service tests
npm test -- --testPathPattern=service.spec.ts

# Generate coverage report
npm run test:cov

# Watch mode for development
npm run test:watch
```

## INTEGRATION WITH QA-EXPERT
- QA-expert will handle controller tests
- Ensure your service mocks align with QA-expert's controller test mocks
- Share any utility functions that might be useful for controller testing

## TIMELINE
- **Day 1**: Auth and Forms services (critical)
- **Day 2**: Animals and Geographic services  
- **Day 3**: Audit service + coverage optimization + documentation

Start with AuthService as it's the most critical. Focus on comprehensive error testing and edge cases. Let me know if you need clarification on any specific service method or testing approach.