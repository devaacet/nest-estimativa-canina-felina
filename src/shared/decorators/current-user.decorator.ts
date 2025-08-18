/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CurrentUserDto } from '../dto/current-user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as CurrentUserDto;
  },
);
