import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { passwordValidation } from 'src/shared/constants';

export class LoginDto {
  @ApiProperty({
    description: 'Endereço de email do usuário',
    example: 'usuario@exemplo.com',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'minhaSenhaSegura123',
    minLength: 8,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsStrongPassword(passwordValidation, {
    message: 'Senha não atende os critérios de segurança.',
  })
  password: string;
}
