import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CityRepository } from './repositories/city.repository';
import { City } from './entities/city.entity';
import { CityQuestion } from './entities/city-question.entity';
import { CurrentUserDto, PaginatedDataDto, UserRole } from 'src/shared';
import {
  CityDetailsResponseDto,
  CityListBasicResponseDto,
} from 'src/apps/city/dto/out';
import { CreateCityDto, UpdateCityDto } from './dto/in';

@Injectable()
export class CityService {
  constructor(private readonly cityRepository: CityRepository) {}

  // City methods
  async findAllCities(): Promise<City[]> {
    return this.cityRepository.findAll();
  }

  async findAllWithPagination({
    page = 1,
    limit = 10,
    search,
    year,
    active,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    year?: number;
    active?: boolean;
  }): Promise<PaginatedDataDto<City>> {
    const { cities, total } = await this.cityRepository.findAllWithPagination({
      page,
      limit,
      search,
      year,
      active,
    });

    return new PaginatedDataDto(cities, total, limit, page);
  }

  async findCityById(id: string): Promise<City> {
    const city = await this.cityRepository.findById(id);
    if (!city) {
      throw new NotFoundException('Cidade não encontrada');
    }
    return city;
  }

  async getDetailsById(id: string): Promise<CityDetailsResponseDto> {
    const city = await this.cityRepository.findById(id);
    if (!city) {
      throw new NotFoundException('Cidade não encontrada');
    }
    return {
      active: city.active,
      createdAt: city.createdAt,
      id: city.id,
      name: city.name,
      year: city.year,
      questions: city.cityQuestions.map((question) => ({
        id: question.id,
        displayOrder: question.questionOrder,
        questionText: question.questionText,
        isRequired: question.required,
      })),
    };
  }

  checkIfValidYear(year: number): void {
    if (!year || year < new Date().getFullYear()) {
      throw new BadRequestException('Ano não pode ser anterior ao atual');
    }
  }

  async checkIfCityNameAndYearAlreadyExists(
    name: string,
    year: number,
    id?: string,
  ): Promise<void> {
    const existingCity = await this.cityRepository.findByNameAndYear(
      name,
      year,
    );

    if (existingCity && !(id && existingCity?.id)) {
      throw new BadRequestException('Cidade com esse nome e ano já existe');
    }
  }

  async createCity(dto: CreateCityDto): Promise<void> {
    this.checkIfValidYear(dto.year);
    await this.checkIfCityNameAndYearAlreadyExists(dto.name, dto.year);

    await this.cityRepository.create({
      name: dto.name,
      year: dto.year,
      active: dto.active ?? true,
      cityQuestions: dto.questions.map(
        (question) =>
          ({
            questionText: question.questionText,
            questionOrder: question.questionOrder,
            required: question.required ?? false,
          }) as CityQuestion,
      ),
    } as City);

    return;
  }

  async updateCity(id: string, dto: UpdateCityDto): Promise<void> {
    this.checkIfValidYear(dto.year);
    await this.checkIfCityNameAndYearAlreadyExists(dto.name, dto.year, id);

    const city = await this.findCityById(id);

    await this.cityRepository.save({
      ...city,
      name: dto.name,
      year: dto.year,
      active: dto.active ?? true,
      cityQuestions: dto.questions.map(
        (question) =>
          ({
            questionText: question.questionText,
            questionOrder: question.questionOrder,
            required: question.required ?? false,
          }) as CityQuestion,
      ),
    });
  }

  async deleteCity(id: string): Promise<void> {
    const city = await this.findCityById(id);
    await this.cityRepository.remove(city);
  }

  async toggleCityStatus(id: string): Promise<City> {
    const city = await this.findCityById(id);
    return this.cityRepository.update(id, { active: !city.active });
  }

  async findCitiesByYear(year: number): Promise<City[]> {
    return this.cityRepository.findByYear(year);
  }

  async findCitiesForUser(
    user: CurrentUserDto,
    search?: string,
  ): Promise<CityListBasicResponseDto[]> {
    let cities: City[] = [];
    if (user.role === UserRole.ADMINISTRATOR)
      cities = await this.cityRepository.findActiveCities();
    else cities = await this.cityRepository.findCitiesForUser(user.id, search);

    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      year: city.year,
    }));
  }

  // City Questions methods
  async findQuestionsByCityId(cityId: string): Promise<CityQuestion[]> {
    const { cityQuestions } = await this.findCityById(cityId); // Ensure city exists
    return cityQuestions;
  }
}
