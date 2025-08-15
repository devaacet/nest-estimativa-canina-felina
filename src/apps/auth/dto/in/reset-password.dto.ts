import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, IsUUID } from 'class-validator';
import { passwordValidation } from 'src/shared/constants';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token',
    example: 'abc123-def456-ghi789',
  })
  @IsUUID('6', { message: 'Token inválido' })
  token: string;

  @ApiProperty({
    description: 'New password',
    example: 'myNewSecurePassword123',
    minLength: 6,
  })
  @IsString({ message: 'Nova senha deve ser uma string' })
  @IsStrongPassword(passwordValidation, {
    message: 'Senha não atende os critérios de segurança.',
  })
  newPassword: string;
}
