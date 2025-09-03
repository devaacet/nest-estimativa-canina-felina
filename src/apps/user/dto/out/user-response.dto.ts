import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/enums';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'João Silva',
  })
  name: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: UserRole,
    example: UserRole.RESEARCHER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User institution',
    example: 'Universidade Federal de São Paulo',
    nullable: true,
  })
  institution?: string;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Whether the user email is verified',
    example: false,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Last login timestamp',
    example: '2024-01-15T10:30:00Z',
    nullable: true,
  })
  lastLoginAt?: Date;

  @ApiProperty({
    nullable: true,
  })
  cityNames?: string[];
}
