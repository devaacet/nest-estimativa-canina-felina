import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDataDto {
  @ApiProperty({
    description: 'User name',
    example: 'João Silva',
  })
  name: string;
}

export class LoginResponseDataDto {
  @ApiProperty({
    description: 'User information returned in login',
    type: LoginUserDataDto,
  })
  user: LoginUserDataDto;
}
