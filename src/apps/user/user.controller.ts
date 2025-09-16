import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto, UpdateUserDto } from './dto/in';
import { CurrentUser, Roles, UserRole } from 'src/shared';
import { MESSAGES } from 'src/shared/constants/messages';
import type { CurrentUserDto, PaginatedDataDto } from 'src/shared';
import { UserResponseDto } from 'src/apps/user/dto/out';
import JwtAuthGuard from 'src/apps/auth/guards/jwt-auth.guard';

@ApiTags('Usuários')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de itens por página',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Termo de busca por nome ou email',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserRole,
    description: 'Filtrar por função do usuário',
  })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filtrar por status ativo',
  })
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
  ) {
    const result = await this.userService.register(user, dto);
    return {
      success: true,
      data: result,
      messages: [`${MESSAGES.ENTITIES.USER} ${MESSAGES.SUCCESS.CREATED}`],
    };
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
    return {
      success: true,
      data: null,
      messages: [`${MESSAGES.ENTITIES.USER} ${MESSAGES.SUCCESS.UPDATED}`],
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Deletar usuário' })
  async delete(@CurrentUser() user: CurrentUserDto, @Param('id') id: string) {
    await this.userService.delete(user, id);
    return {
      success: true,
      data: null,
      messages: [`${MESSAGES.ENTITIES.USER} ${MESSAGES.SUCCESS.DELETED}`],
    };
  }

  @Patch(':id/toggle-status')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Alternar status ativo/inativo do usuário' })
  async toggleStatus(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: string,
  ) {
    await this.userService.toggleStatus(user, id);
    return {
      success: true,
      data: null,
      messages: [
        `${MESSAGES.ENTITIES.USER} ${MESSAGES.SUCCESS.STATUS_UPDATED}`,
      ],
    };
  }
}
