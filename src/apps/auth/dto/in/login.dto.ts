import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { passwordValidation } from 'src/shared/constants';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'mySecurePassword123',
    minLength: 8,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsStrongPassword(passwordValidation, {
    message: 'Senha não atende os critérios de segurança.',
  })
  password: string;
}
