import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CityService } from './city.service';
import {
  CreateCityDto,
  CreateCityQuestionDto,
  ReorderQuestionsDto,
  UpdateCityDto,
  UpdateCityQuestionDto,
} from './dto/in';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('City')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cities with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Cities retrieved successfully' })
  async findAllCities(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('year') year?: number,
    @Query('active') active?: boolean,
  ) {
    const cities = await this.cityService.findAllCities();

    return {
      success: true,
      data: { cities },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get city by ID' })
  @ApiResponse({ status: 200, description: 'City retrieved successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async findCityById(@Param('id') id: string) {
    const city = await this.cityService.findCityById(id);

    return {
      success: true,
      data: { city },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new city' })
  @ApiResponse({ status: 201, description: 'City created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async createCity(@Body() cityData: CreateCityDto) {
    const city = await this.cityService.createCity(cityData);

    return {
      success: true,
      data: { city },
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update city' })
  @ApiResponse({ status: 200, description: 'City updated successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async updateCity(@Param('id') id: string, @Body() cityData: UpdateCityDto) {
    const city = await this.cityService.updateCity(id, cityData);

    return {
      success: true,
      data: { city },
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete city' })
  @ApiResponse({ status: 200, description: 'City deleted successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async deleteCity(@Param('id') id: string) {
    await this.cityService.deleteCity(id);

    return {
      success: true,
      data: { message: 'Cidade excluída com sucesso' },
    };
  }

  @Put(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle city active status' })
  @ApiResponse({ status: 200, description: 'City status updated successfully' })
  async toggleCityStatus(@Param('id') id: string) {
    const city = await this.cityService.toggleCityStatus(id);

    return {
      success: true,
      data: {
        city,
        message: `Cidade ${city.active ? 'ativada' : 'desativada'} com sucesso`,
      },
    };
  }

  @Get('year/:year')
  @ApiOperation({ summary: 'Get cities by year' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Cities retrieved successfully' })
  async findCitiesByYear(
    @Param('year') year: number,
    @Query('activeOnly') activeOnly?: boolean,
  ) {
    const cities = await this.cityService.findCitiesByYear(+year);

    return {
      success: true,
      data: { cities },
    };
  }

  // City Questions endpoints
  @Get(':cityId/questions')
  @ApiOperation({ summary: 'Get all questions for a city' })
  @ApiResponse({ status: 200, description: 'Questions retrieved successfully' })
  async getCityQuestions(@Param('cityId') cityId: string) {
    const questions = await this.cityService.findQuestionsByCityId(cityId);

    return {
      success: true,
      data: { questions },
    };
  }

  @Get(':cityId/questions/required')
  @ApiOperation({ summary: 'Get required questions for a city' })
  @ApiResponse({
    status: 200,
    description: 'Required questions retrieved successfully',
  })
  async getRequiredCityQuestions(@Param('cityId') cityId: string) {
    const questions =
      await this.cityService.findRequiredQuestionsByCityId(cityId);

    return {
      success: true,
      data: { questions },
    };
  }

  @Post(':cityId/questions')
  @ApiOperation({ summary: 'Create new question for city' })
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  async createCityQuestion(
    @Param('cityId') cityId: string,
    @Body() questionData: CreateCityQuestionDto,
  ) {
    const question = await this.cityService.createCityQuestion(
      cityId,
      questionData,
    );

    return {
      success: true,
      data: { question },
    };
  }

  @Put('questions/:questionId')
  @ApiOperation({ summary: 'Update city question' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  async updateCityQuestion(
    @Param('questionId') questionId: string,
    @Body() questionData: UpdateCityQuestionDto,
  ) {
    const question = await this.cityService.updateCityQuestion(
      questionId,
      questionData,
    );

    return {
      success: true,
      data: { question },
    };
  }

  @Delete('questions/:questionId')
  @ApiOperation({ summary: 'Delete city question' })
  @ApiResponse({ status: 200, description: 'Question deleted successfully' })
  async deleteCityQuestion(@Param('questionId') questionId: string) {
    await this.cityService.deleteCityQuestion(questionId);

    return {
      success: true,
      data: { message: 'Pergunta excluída com sucesso' },
    };
  }

  @Put('/:cityId/questions/reorder')
  @ApiOperation({ summary: 'Reorder city questions' })
  @ApiResponse({ status: 200, description: 'Questions reordered successfully' })
  async reorderCityQuestions(
    @Param('cityId') cityId: string,
    @Body() reorderData: ReorderQuestionsDto,
  ) {
    await this.cityService.reorderCityQuestions(
      cityId,
      reorderData.questionOrders,
    );

    return {
      success: true,
      data: { message: 'Perguntas reordenadas com sucesso' },
    };
  }

  @Get('/:cityId/with-questions')
  @ApiOperation({ summary: 'Get city with all questions' })
  @ApiResponse({
    status: 200,
    description: 'City with questions retrieved successfully',
  })
  async getCityWithQuestions(@Param('cityId') cityId: string) {
    const cityWithQuestions =
      await this.cityService.getCityWithQuestions(cityId);

    return {
      success: true,
      data: cityWithQuestions,
    };
  }
}
