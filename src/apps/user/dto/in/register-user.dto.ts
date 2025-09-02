import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { UserRole } from 'src/shared';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Endereço de e-mail do usuário',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiPropertyOptional({
    description: 'Telefone do usuário',
    example: '+55 11 99999-9999',
  })
  @IsPhoneNumber('BR', { message: 'Telefone deve ter um formato válido' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description:
      'Instituição, obrigatória apenas se o tipo do usuário for cliente',
    example: 'Universidade Federal',
    required: false,
  })
  @IsString({ message: 'Instituição deve ser uma string' })
  @ValidateIf((o: RegisterUserDto) => o.role === UserRole.CLIENT, {
    message: 'Instituição é obrigatória para usuários do tipo cliente',
  })
  institution?: string;

  @ApiPropertyOptional({
    description: 'Tipo do usuário',
    enum: UserRole,
  })
  @IsEnum(UserRole, { message: 'Papel deve ser um valor válido' })
  role: UserRole;

  @ApiProperty({
    description: 'Ids das cidades que usuário terá acesso',
    isArray: true,
    minItems: 1,
  })
  @IsArray({ message: 'Ids de cidade devem ser um array' })
  @ArrayMinSize(1, { message: 'Usuário deve ter pelo menos uma cidade' })
  cityIds: string[];
}
