import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RegisterUserDto, UpdateUserDto } from './dto/in';
import { CurrentUser, Roles, UserRole } from 'src/shared';
import type { CurrentUserDto, PaginatedDataDto } from 'src/shared';
import { User } from 'src/apps/user/entities/user.entity';
import { UserResponseDto } from 'src/apps/user/dto/out';
import JwtAuthGuard from 'src/apps/auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async findAll(
    @CurrentUser() user: CurrentUserDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
    @Query('active') active?: boolean,
  ): Promise<PaginatedDataDto<UserResponseDto>> {
    return await this.userService.findAllWithPagination({
      user,
      page,
      limit,
      active,
      role,
      search,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Registrar usuário' })
  async register(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: RegisterUserDto,
  ): Promise<Partial<User>> {
    return this.userService.register(user, dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar usuário' })
  async update(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    await this.userService.update(user, id, dto);

    return;
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Deletar usuário' })
  async delete(@CurrentUser() user: CurrentUserDto, @Param('id') id: string) {
    await this.userService.delete(user, id);

    return;
  }
}
