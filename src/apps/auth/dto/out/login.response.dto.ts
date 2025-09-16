import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDataDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  name: string;
}

export class LoginResponseDataDto {
  @ApiProperty({
    description: 'Informações do usuário retornadas no login',
    type: LoginUserDataDto,
  })
  user: LoginUserDataDto;
}
