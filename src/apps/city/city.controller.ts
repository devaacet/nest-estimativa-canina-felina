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
import type { CurrentUserDto, PaginatedDataDto } from 'src/shared';
import JwtAuthGuard from 'src/apps/auth/guards/jwt-auth.guard';
import {
  CityDetailsResponseDto,
  CityListBasicResponseDto,
  CityResponseDto,
} from 'src/apps/city/dto/out';

@ApiTags('City')
@Controller('city')
@UseGuards(JwtAuthGuard)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Listar todas as cidades' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Cities retrieved successfully' })
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
    description: 'User accessible cities retrieved successfully',
  })
  @ApiQuery({
    name: 'search',
    required: false,
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
  @ApiOperation({ summary: 'Get city by ID' })
  @ApiResponse({ status: 200, description: 'City retrieved successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async findCityById(@Param('id') id: string): Promise<CityDetailsResponseDto> {
    const city = await this.cityService.getDetailsById(id);

    return city;
  }

  @Post()
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Create new city' })
  @ApiResponse({ status: 201, description: 'City created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async createCity(
    @CurrentUser() user: CurrentUserDto,
    @Body() cityData: CreateCityDto,
  ) {
    await this.cityService.createCity(cityData);
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Update city' })
  @ApiResponse({ status: 200, description: 'City updated successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async updateCity(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: string,
    @Body() cityData: UpdateCityDto,
  ) {
    await this.cityService.updateCity(id, cityData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Delete city' })
  @ApiResponse({ status: 200, description: 'City deleted successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async deleteCity(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: string,
  ) {
    await this.cityService.deleteCity(id);
  }

  @Put(':id/toggle-status')
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Toggle city active status' })
  @ApiResponse({ status: 200, description: 'City status updated successfully' })
  async toggleCityStatus(@Param('id') id: string) {
    await this.cityService.toggleCityStatus(id);
  }

  // City Questions endpoints
  @Get(':cityId/questions')
  @ApiOperation({ summary: 'Get all questions for a city' })
  @ApiResponse({ status: 200, description: 'Questions retrieved successfully' })
  async getCityQuestions(@Param('cityId') cityId: string) {
    const questions = await this.cityService.findQuestionsByCityId(cityId);

    return questions;
  }
}
