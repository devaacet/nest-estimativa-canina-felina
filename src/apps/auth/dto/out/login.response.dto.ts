import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../user/entities/user.entity';

export class LoginResponseDto {
  @ApiProperty({
    description: 'User information',
  })
  user: User;

  @ApiProperty({
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
  })
  refreshToken: string;
}
