import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CityRepository } from './repositories/city.repository';
import { CityQuestionRepository } from './repositories/city-question.repository';
import { City } from './entities/city.entity';
import { CityQuestion } from './entities/city-question.entity';

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly cityQuestionRepository: CityQuestionRepository,
  ) {}

  // City methods
  async findAllCities(): Promise<City[]> {
    return this.cityRepository.findAll();
  }

  async findCityById(id: string): Promise<City> {
    const city = await this.cityRepository.findById(id);
    if (!city) {
      throw new NotFoundException('Cidade não encontrada');
    }
    return city;
  }

  async createCity(cityData: Partial<City>): Promise<City> {
    // Validate year range
    if (cityData.year && (cityData.year < 2020 || cityData.year > 2050)) {
      throw new BadRequestException('Ano deve estar entre 2020 e 2050');
    }

    return this.cityRepository.create(cityData);
  }

  async updateCity(id: string, cityData: Partial<City>): Promise<City> {
    const existingCity = await this.findCityById(id);

    // Validate year range if provided
    if (cityData.year && (cityData.year < 2020 || cityData.year > 2050)) {
      throw new BadRequestException('Ano deve estar entre 2020 e 2050');
    }

    return this.cityRepository.update(id, cityData);
  }

  async deleteCity(id: string): Promise<void> {
    const city = await this.findCityById(id);
    await this.cityRepository.delete(id);
  }

  async toggleCityStatus(id: string): Promise<City> {
    const city = await this.findCityById(id);
    return this.cityRepository.update(id, { active: !city.active });
  }

  async findCitiesByYear(year: number): Promise<City[]> {
    return this.cityRepository.findByYear(year);
  }

  // City Questions methods
  async findQuestionsByCityId(cityId: string): Promise<CityQuestion[]> {
    await this.findCityById(cityId); // Ensure city exists
    return this.cityQuestionRepository.findByCityId(cityId);
  }

  async findRequiredQuestionsByCityId(cityId: string): Promise<CityQuestion[]> {
    await this.findCityById(cityId); // Ensure city exists
    return this.cityQuestionRepository.findRequiredByCityId(cityId);
  }

  async createCityQuestion(
    cityId: string,
    questionData: Partial<CityQuestion>,
  ): Promise<CityQuestion> {
    await this.findCityById(cityId); // Ensure city exists

    // Get next order number
    const questionOrder =
      await this.cityQuestionRepository.getNextOrder(cityId);

    return this.cityQuestionRepository.create({
      ...questionData,
      city_id: cityId,
      question_order: questionOrder,
    });
  }

  async updateCityQuestion(
    questionId: string,
    questionData: Partial<CityQuestion>,
  ): Promise<CityQuestion> {
    const existingQuestion =
      await this.cityQuestionRepository.findById(questionId);
    if (!existingQuestion) {
      throw new NotFoundException('Pergunta não encontrada');
    }

    return this.cityQuestionRepository.update(questionId, questionData);
  }

  async deleteCityQuestion(questionId: string): Promise<void> {
    const question = await this.cityQuestionRepository.findById(questionId);
    if (!question) {
      throw new NotFoundException('Pergunta não encontrada');
    }

    await this.cityQuestionRepository.delete(questionId);
  }

  async reorderCityQuestions(
    cityId: string,
    questionOrders: { id: string; order: number }[],
  ): Promise<void> {
    await this.findCityById(cityId); // Ensure city exists

    // Verify all questions belong to this city
    for (const { id: questionId } of questionOrders) {
      const question = await this.cityQuestionRepository.findById(questionId);
      if (!question || question.city_id !== cityId) {
        throw new BadRequestException(
          `Pergunta ${questionId} não pertence a esta cidade`,
        );
      }
    }

    await this.cityQuestionRepository.reorderQuestions(cityId, questionOrders);
  }

  async getCityWithQuestions(
    cityId: string,
  ): Promise<City & { questions: CityQuestion[] }> {
    const city = await this.findCityById(cityId);
    const questions = await this.findQuestionsByCityId(cityId);

    return {
      ...city,
      questions,
    };
  }
}
