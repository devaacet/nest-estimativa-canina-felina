# Sistema de Response Padronizado - Guia de Uso

## Implementação Concluída ✅

O sistema de response padronizado foi implementado com sucesso e inclui:

### 1. **Formato Padrão de Response**
Todas as respostas da API agora seguem o formato:
```typescript
{
  success: boolean,
  data: T,
  messages: string[],
  metadata?: {
    timestamp: string,
    requestId: string,
    version: string,
    executionTime: number
  }
}
```

### 2. **Componentes Implementados**

#### **Tipos TypeScript** (`src/shared/types/`)
- ✅ `api-response.interface.ts` - Interfaces principais
- ✅ `response-utils.types.ts` - Utilitários e type guards

#### **DTOs com Swagger** (`src/shared/dto/`)
- ✅ `standard-response.dto.ts` - Classes base com decoradores @ApiProperty
- ✅ Suporte completo ao Swagger/OpenAPI
- ✅ Validação com class-validator

#### **Infraestrutura Global** (`src/shared/`)
- ✅ `interceptors/response.interceptor.ts` - Transforma todas as responses automaticamente
- ✅ `filters/global-exception.filter.ts` - Trata todas as exceções de forma padronizada
- ✅ `utils/response-builder.util.ts` - Utilities para criar responses facilmente

#### **Response DTOs por Domínio**
- ✅ `src/apps/auth/dto/out/auth-standard-response.dto.ts` - Responses específicas do domínio auth

### 3. **Configuração Global**
- ✅ Interceptor e filter registrados globalmente no `app.module.ts`
- ✅ Zero breaking changes - código existente continua funcionando
- ✅ Build passando sem erros

## Como Usar

### 1. **Automático (Recomendado)**
O interceptor global transformará automaticamente todas as responses:

```typescript
// Controller (código atual não precisa mudar)
@Get()
async getUsers() {
  return await this.userService.findAll(); // Array de users
}

// Response automática será:
{
  "success": true,
  "data": [/* array of users */],
  "messages": ["Data retrieved successfully"],
  "metadata": {
    "timestamp": "2024-08-16T10:30:00.000Z",
    "requestId": "req-12345-abcde",
    "version": "v1.0.0",
    "executionTime": 150
  }
}
```

### 2. **Usando ResponseBuilder (Controle Manual)**
```typescript
import { ResponseBuilder } from '../../../shared';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    
    // Resposta de sucesso customizada
    return ResponseBuilder.success(
      result, 
      ['Login realizado com sucesso']
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    
    // Resposta vazia com mensagem customizada
    return ResponseBuilder.empty(
      'E-mail de recuperação enviado'
    );
  }
}
```

### 3. **Usando DTOs Específicos do Domínio**
```typescript
import { LoginStandardResponseDto } from './dto/out';

@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful', 
    type: LoginStandardResponseDto 
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginStandardResponseDto> {
    const result = await this.authService.login(loginDto);
    return new LoginStandardResponseDto(result);
  }
}
```

## Tratamento de Erros

### Automático
Todas as exceções são capturadas e formatadas automaticamente:

```typescript
// Se ocorrer um erro
throw new NotFoundException('User not found');

// Response automática será:
{
  "success": false,
  "data": null,
  "messages": ["User not found"],
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  },
  "metadata": { /* ... */ }
}
```

### Manual com ResponseBuilder
```typescript
// Erro customizado
return ResponseBuilder.notFound('User', userId);

// Erro de validação
return ResponseBuilder.validationError([
  { field: 'email', message: 'Email is required' }
]);
```

## Recursos Implementados

### ✅ **Suporte Completo ao Swagger**
- Todas as classes têm decoradores @ApiProperty
- Documentação automática no Swagger UI
- Exemplos e descrições detalhadas

### ✅ **Type Safety Completo**
- Interfaces TypeScript para todos os tipos
- Type guards para verificação em runtime
- Generics para type safety

### ✅ **Compatibilidade com DDD**
- Response DTOs organizados por domínio
- Estrutura mantém arquitetura existente

### ✅ **Tratamento de Erros Robusto**
- Captura todos os tipos de exceção
- Formatação consistente de erros
- Logs estruturados

### ✅ **Performance e Metadata**
- Tempo de execução rastreado
- Request IDs para tracing
- Metadata opcional configurável

## Próximos Passos

1. **Migrar controllers existentes** para usar ResponseBuilder quando necessário
2. **Criar response DTOs** para outros domínios (animals, forms, etc.)
3. **Configurar monitoring** usando metadata de requests
4. **Implementar testes** para verificar formato das responses

## Exemplos de Response por Cenário

### Sucesso com dados
```json
{
  "success": true,
  "data": { "id": "123", "name": "João" },
  "messages": ["User retrieved successfully"]
}
```

### Sucesso sem dados (delete)
```json
{
  "success": true,
  "data": null,
  "messages": ["User deleted successfully"]
}
```

### Erro de validação
```json
{
  "success": false,
  "data": null,
  "messages": ["Validation failed"],
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more validation errors occurred",
    "validationErrors": [
      {
        "field": "email",
        "message": "Email must be a valid email address",
        "constraints": ["isEmail"]
      }
    ]
  }
}
```

### Dados paginados
```json
{
  "success": true,
  "data": {
    "items": [/* array of items */],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrevious": false
    }
  },
  "messages": ["Data retrieved successfully"]
}
```