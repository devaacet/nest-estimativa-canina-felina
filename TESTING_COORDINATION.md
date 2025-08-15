# COORDENAÇÃO DE TESTES UNITÁRIOS - PET RESEARCH API

## RESUMO EXECUTIVO

Coordenação completa da criação de testes unitários para o projeto api-pet-research, delegando responsabilidades específicas para **backend-expert** (services) e **qa-expert** (controllers), com configuração otimizada do ambiente Jest.

## ESTRUTURA DO PROJETO MAPEADA

### Controllers (5 domínios) - Responsabilidade: QA-EXPERT
```
src/apps/
├── auth/auth.controller.ts          → 6 endpoints (login, register, refresh, logout, forgot-password, reset-password)
├── geographic/geographic.controller.ts → endpoints para cidades e city-questions  
├── forms/forms.controller.ts        → 8-step workflow, CRUD, validações
├── animals/animals.controller.ts    → CRUD para current/previous/puppies/absence
└── audit/audit.controller.ts        → logs, export requests
```

### Services (5 domínios) - Responsabilidade: BACKEND-EXPERT
```
src/apps/
├── auth/auth.service.ts            → JWT, bcrypt, validação, password reset
├── geographic/geographic.service.ts → lógica de cidades e questões
├── forms/forms.service.ts          → workflow 8-step, validações
├── animals/animals.service.ts      → lógica de negócio para animais
└── audit/audit.service.ts          → audit logging, export generation
```

## CONFIGURAÇÃO JEST OTIMIZADA

### Arquivo de Configuração Atualizado
✅ **package.json**: Configuração Jest com:
- Coverage threshold: 80% global, 90% auth, 85% forms
- Setup file para mocks globais
- Scripts customizados por domínio
- Coverage reports (text, lcov, html)

### Setup Global de Testes
✅ **test/setup.ts**: 
- Mock global do bcryptjs
- Configuração de environment variables
- Custom matchers (JWT, email, cookies)
- Timeout e cleanup automáticos

### Utilities Compartilhadas  
✅ **test/utils/test-helpers.ts**:
- Mock factories para repositories, JWT, Config
- Dados de teste padronizados
- Helpers para HTTP, cookies, async testing
- Funções de assertion customizadas

## SCRIPTS DE TESTE DISPONÍVEIS

```bash
# Testes gerais
npm test                    # Todos os testes
npm run test:watch         # Watch mode
npm run test:cov           # Coverage report
npm run test:ci            # CI mode (sem watch)

# Testes por tipo
npm run test:services      # Apenas services (.service.spec.ts)
npm run test:controllers   # Apenas controllers (.controller.spec.ts)

# Testes por domínio
npm run test:auth         # Domínio auth (critical)
npm run test:forms        # Domínio forms (high priority)
npm run test:animals      # Domínio animals
npm run test:geographic   # Domínio geographic
npm run test:audit        # Domínio audit

# Coverage
npm run test:coverage-report  # Gera e abre relatório HTML
```

## DELEGAÇÃO DETALHADA

### BACKEND-EXPERT: SERVICES TESTING
📋 **Documento**: `BACKEND_EXPERT_TASK.md`

**Responsabilidades**:
- Testes unitários para 5 services
- Mocking de repositories (TypeORM)
- Mocking de JWT, Config, bcrypt
- Lógica de negócio e validações
- Error handling completo
- **Meta**: 80% coverage geral, 90% auth

**Prioridades**:
1. **AuthService** (CRITICAL) - JWT, bcrypt, validações
2. **FormsService** (HIGH) - 8-step workflow
3. **AnimalsService** (MEDIUM) - CRUD + business logic
4. **GeographicService** (MEDIUM) - cidades e questões
5. **AuditService** (LOW) - logging e exports

### QA-EXPERT: CONTROLLERS TESTING  
📋 **Documento**: `QA_EXPERT_TASK.md`

**Responsabilidades**:
- Testes HTTP para 5 controllers
- Supertest para endpoints
- DTO validation testing
- Authentication e authorization
- Cookie handling (httpOnly, secure)
- HTTP status codes e responses
- **Meta**: 80% coverage geral, 90% auth

**Prioridades**:
1. **AuthController** (CRITICAL) - login, register, cookies
2. **FormsController** (HIGH) - 8-step workflow HTTP
3. **AnimalsController** (MEDIUM) - CRUD endpoints
4. **GeographicController** (MEDIUM) - cities endpoints
5. **AuditController** (LOW) - logs e exports

## PADRÕES E STANDARDS

### Estrutura de Arquivos
```
src/apps/[domain]/
├── [domain].controller.spec.ts    # QA-Expert
├── [domain].service.spec.ts       # Backend-Expert
└── entities/
    └── [entity].spec.ts          # Se necessário
```

### Naming Conventions
- **Test files**: `*.spec.ts`
- **Test suites**: `describe('[ClassName]', () => {})`
- **Test cases**: `it('should [behavior] when [condition]', () => {})`
- **Mock objects**: `mock[ServiceName]`, `mock[RepositoryName]`

### Coverage Requirements
| Domínio | Services | Controllers | Justificativa |
|---------|----------|-------------|---------------|
| **auth** | 90% | 90% | Critical - authentication/security |
| **forms** | 85% | 85% | High - core business logic |
| **animals** | 80% | 80% | Medium - data management |
| **geographic** | 80% | 80% | Medium - support functionality |
| **audit** | 75% | 75% | Low - logging/reporting |

### Cenários de Teste Obrigatórios

#### Para SERVICES (Backend-Expert):
- ✅ **Happy Path**: Casos de sucesso
- ✅ **Error Handling**: Todas as exceptions
- ✅ **Edge Cases**: Null, undefined, empty data
- ✅ **Business Logic**: Todas as condições e validações
- ✅ **Repository Calls**: Verificar chamadas corretas
- ✅ **External Dependencies**: Mock JWT, bcrypt, config

#### Para CONTROLLERS (QA-Expert):
- ✅ **HTTP Methods**: GET, POST, PUT, DELETE, PATCH
- ✅ **Status Codes**: 200, 201, 400, 401, 403, 404, 422, 500
- ✅ **Request Validation**: DTOs, parâmetros, body
- ✅ **Response Structure**: Format consistency
- ✅ **Authentication**: JWT cookies, permissions
- ✅ **Error Responses**: Proper error format

## TIMELINE DE EXECUÇÃO

### Semana 1: Setup + Auth Domain (CRITICAL)
**Day 1**:
- ✅ Backend-Expert: AuthService testes
- ✅ QA-Expert: AuthController testes + HTTP utilities

**Day 2**:
- Coverage verification para auth domain (90%+)
- Integration testing entre service/controller mocks
- Bug fixes e refinamentos

### Semana 2: Forms + Animals Domains
**Day 3-4**:
- Backend-Expert: FormsService + AnimalsService
- QA-Expert: FormsController + AnimalsController

**Day 5**:
- Coverage verification (85%+ forms, 80%+ animals)
- Cross-domain integration testing

### Semana 3: Geographic + Audit + Final
**Day 6-7**:
- Backend-Expert: GeographicService + AuditService
- QA-Expert: GeographicController + AuditController

**Day 8-9**:
- Final coverage optimization (80%+ all domains)
- Performance testing (< 10s total execution)
- Documentation e cleanup
- CI/CD integration validation

## INTEGRAÇÃO E SINCRONIZAÇÃO

### Shared Resources
- ✅ **test/utils/test-helpers.ts**: Mock factories, test data
- ✅ **test/setup.ts**: Global mocks, environment setup
- ✅ **package.json**: Jest config, scripts, coverage thresholds

### Communication Protocol
1. **Daily Sync**: Progress, blockers, integration points
2. **Mock Alignment**: Service mocks ↔ Controller mocks
3. **Utility Sharing**: Helpers, factories, assertion functions
4. **Coverage Tracking**: Real-time dashboard monitoring

### Quality Gates
- ✅ **Unit Tests**: 80%+ coverage per domain
- ✅ **Performance**: < 10s execution time
- ✅ **Standards**: Consistent naming, structure
- ✅ **Documentation**: Self-documenting test cases
- ✅ **CI Ready**: No environment dependencies

## MONITORING E VALIDAÇÃO

### Real-time Metrics
```bash
# Coverage monitoring
npm run test:cov

# Performance monitoring  
npm test -- --verbose --detectOpenHandles

# Domain-specific validation
npm run test:auth && echo "Auth domain validated ✅"
```

### Success Criteria Checklist
- [ ] 5 Service test files created (backend-expert)
- [ ] 5 Controller test files created (qa-expert)
- [ ] Coverage thresholds met (80%+ global, 90%+ auth)
- [ ] All tests pass in < 10 seconds
- [ ] No flaky tests or external dependencies
- [ ] Proper error scenario coverage
- [ ] Authentication flow fully tested
- [ ] HTTP endpoints fully tested
- [ ] CI/CD ready (npm run test:ci)

## PRÓXIMOS PASSOS

### Para Backend-Expert
1. Revisar `BACKEND_EXPERT_TASK.md`
2. Começar com `auth.service.spec.ts` (CRITICAL)
3. Usar `test/utils/test-helpers.ts` para mocks
4. Executar `npm run test:services` para validar

### Para QA-Expert  
1. Revisar `QA_EXPERT_TASK.md`
2. Começar com `auth.controller.spec.ts` (CRITICAL)
3. Usar `test/utils/test-helpers.ts` para utilities
4. Executar `npm run test:controllers` para validar

### Coordenação Contínua
- Monitorar progresso via coverage reports
- Sincronizar mocks entre especialistas
- Validar integração de resultados
- Otimizar performance e coverage
- Preparar documentação final

---

**Status**: 🚀 READY TO START - Ambiente configurado, tarefas delegadas, especialistas podem iniciar trabalho imediatamente.

**Localização do Projeto**: `C:\Users\renan\aacet\pet-research\api-pet-research\`