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
import { CityService } from './city.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCityDto, UpdateCityDto } from './dto/in';
import { CurrentUser, Roles, UserRole } from 'src/shared';
import { MESSAGES } from 'src/shared/constants/messages';
import type { CurrentUserDto, PaginatedDataDto } from 'src/shared';
import JwtAuthGuard from 'src/apps/auth/guards/jwt-auth.guard';
import {
  CityDetailsResponseDto,
  CityListBasicResponseDto,
  CityResponseDto,
} from 'src/apps/city/dto/out';

@ApiTags('Cidades')
@Controller('city')
@UseGuards(JwtAuthGuard)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Listar todas as cidades' })
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
    description: 'Termo de busca por nome da cidade',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Filtrar por ano da pesquisa',
  })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filtrar por status ativo',
  })
  @ApiResponse({ status: 200, description: 'Cidades recuperadas com sucesso' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('year') year?: number,
    @Query('active') active?: boolean,
  ): Promise<PaginatedDataDto<CityResponseDto>> {
    return await this.cityService.findAllWithPagination({
      page,
      limit,
      search,
      year,
      active,
    });
  }

  @Get('basic')
  @ApiOperation({ summary: 'Listar cidades acessíveis ao usuário atual' })
  @ApiResponse({
    status: 200,
    description: 'Cidades acessíveis ao usuário recuperadas com sucesso',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Termo de busca por nome da cidade',
  })
  async findBasicCities(
    @CurrentUser() user: CurrentUserDto,
    @Query('search') search?: string,
  ): Promise<CityListBasicResponseDto[]> {
    const cities = await this.cityService.findCitiesForUser(user, search);

    return cities;
  }

  @Get(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Obter cidade por ID' })
  @ApiResponse({ status: 200, description: 'Cidade recuperada com sucesso' })
  @ApiResponse({ status: 404, description: 'Cidade não encontrada' })
  async findCityById(@Param('id') id: string): Promise<CityDetailsResponseDto> {
    const city = await this.cityService.getDetailsById(id);

    return city;
  }

  @Post()
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Criar nova cidade' })
  @ApiResponse({ status: 201, description: 'Cidade criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createCity(
    @CurrentUser() user: CurrentUserDto,
    @Body() cityData: CreateCityDto,
  ) {
    const result = await this.cityService.createCity(cityData);
    return {
      success: true,
      data: result,
      messages: [`${MESSAGES.ENTITIES.CITY} ${MESSAGES.SUCCESS.CREATED}`],
    };
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Atualizar cidade' })
  @ApiResponse({ status: 200, description: 'Cidade atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Cidade não encontrada' })
  async updateCity(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: string,
    @Body() cityData: UpdateCityDto,
  ) {
    await this.cityService.updateCity(id, cityData);
    return {
      success: true,
      data: null,
      messages: [`${MESSAGES.ENTITIES.CITY} ${MESSAGES.SUCCESS.UPDATED}`],
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Deletar cidade' })
  @ApiResponse({ status: 200, description: 'Cidade deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Cidade não encontrada' })
  async deleteCity(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: string,
  ) {
    await this.cityService.deleteCity(id);
    return {
      success: true,
      data: null,
      messages: [`${MESSAGES.ENTITIES.CITY} ${MESSAGES.SUCCESS.DELETED}`],
    };
  }

  @Put(':id/toggle-status')
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Alternar status ativo da cidade' })
  @ApiResponse({
    status: 200,
    description: 'Status da cidade atualizado com sucesso',
  })
  async toggleCityStatus(@Param('id') id: string) {
    await this.cityService.toggleCityStatus(id);
    return {
      success: true,
      data: null,
      messages: [
        `${MESSAGES.ENTITIES.CITY} ${MESSAGES.SUCCESS.STATUS_UPDATED}`,
      ],
    };
  }

  // City Questions endpoints
  @Get(':cityId/questions')
  @ApiOperation({ summary: 'Obter todas as perguntas de uma cidade' })
  @ApiResponse({
    status: 200,
    description: 'Perguntas recuperadas com sucesso',
  })
  async getCityQuestions(@Param('cityId') cityId: string) {
    const questions = await this.cityService.findQuestionsByCityId(cityId);

    return questions;
  }
}
