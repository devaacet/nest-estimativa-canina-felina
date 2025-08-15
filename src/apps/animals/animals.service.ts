import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CurrentAnimalRepository } from './repositories/current-animal.repository';
import { PreviousAnimalRepository } from './repositories/previous-animal.repository';
import { PuppiesKittensRepository } from './repositories/puppies-kittens.repository';
import { AnimalAbsenceRepository } from './repositories/animal-absence.repository';
import { CurrentAnimal } from './entities/current-animal.entity';
import { PreviousAnimal } from './entities/previous-animal.entity';
import { PuppiesKittens } from './entities/puppies-kittens.entity';
import { AnimalAbsence } from './entities/animal-absence.entity';

@Injectable()
export class AnimalsService {
  constructor(
    private readonly currentAnimalRepository: CurrentAnimalRepository,
    private readonly previousAnimalRepository: PreviousAnimalRepository,
    private readonly puppiesKittensRepository: PuppiesKittensRepository,
    private readonly animalAbsenceRepository: AnimalAbsenceRepository,
  ) {}

  // Current Animals
  async findCurrentAnimalsByFormId(formId: string): Promise<CurrentAnimal[]> {
    return this.currentAnimalRepository.findByFormId(formId);
  }

  async findCurrentAnimalById(id: string): Promise<CurrentAnimal> {
    const animal = await this.currentAnimalRepository.findById(id);
    if (!animal) {
      throw new NotFoundException('Animal atual não encontrado');
    }
    return animal;
  }

  async createCurrentAnimal(
    animalData: Partial<CurrentAnimal>,
  ): Promise<CurrentAnimal> {
    return this.currentAnimalRepository.create(animalData);
  }

  async updateCurrentAnimal(
    id: string,
    animalData: Partial<CurrentAnimal>,
  ): Promise<CurrentAnimal> {
    await this.findCurrentAnimalById(id);
    return this.currentAnimalRepository.update(id, animalData);
  }

  async deleteCurrentAnimal(id: string): Promise<void> {
    await this.findCurrentAnimalById(id);
    await this.currentAnimalRepository.delete(id);
  }

  // Previous Animals
  async findPreviousAnimalsByFormId(formId: string): Promise<PreviousAnimal[]> {
    return this.previousAnimalRepository.findByFormId(formId);
  }

  async findPreviousAnimalById(id: string): Promise<PreviousAnimal> {
    const animal = await this.previousAnimalRepository.findById(id);
    if (!animal) {
      throw new NotFoundException('Animal anterior não encontrado');
    }
    return animal;
  }

  async createPreviousAnimal(
    animalData: Partial<PreviousAnimal>,
  ): Promise<PreviousAnimal> {
    return this.previousAnimalRepository.create(animalData);
  }

  async updatePreviousAnimal(
    id: string,
    animalData: Partial<PreviousAnimal>,
  ): Promise<PreviousAnimal> {
    await this.findPreviousAnimalById(id);
    return this.previousAnimalRepository.update(id, animalData);
  }

  async deletePreviousAnimal(id: string): Promise<void> {
    await this.findPreviousAnimalById(id);
    await this.previousAnimalRepository.delete(id);
  }

  // Puppies/Kittens
  async findPuppiesKittensByFormId(formId: string): Promise<PuppiesKittens[]> {
    return this.puppiesKittensRepository.findByFormId(formId);
  }

  async findPuppiesKittensById(id: string): Promise<PuppiesKittens> {
    const puppies = await this.puppiesKittensRepository.findById(id);
    if (!puppies) {
      throw new NotFoundException('Informações de filhotes não encontradas');
    }
    return puppies;
  }

  async createPuppiesKittens(
    puppiesData: Partial<PuppiesKittens>,
  ): Promise<PuppiesKittens> {
    return this.puppiesKittensRepository.create(puppiesData);
  }

  async updatePuppiesKittens(
    id: string,
    puppiesData: Partial<PuppiesKittens>,
  ): Promise<PuppiesKittens> {
    await this.findPuppiesKittensById(id);
    return this.puppiesKittensRepository.update(id, puppiesData);
  }

  async deletePuppiesKittens(id: string): Promise<void> {
    await this.findPuppiesKittensById(id);
    await this.puppiesKittensRepository.delete(id);
  }

  // Animal Absence
  async findAnimalAbsenceByFormId(
    formId: string,
  ): Promise<AnimalAbsence | null> {
    return this.animalAbsenceRepository.findByFormId(formId);
  }

  async findAnimalAbsenceById(id: string): Promise<AnimalAbsence> {
    const absence = await this.animalAbsenceRepository.findById(id);
    if (!absence) {
      throw new NotFoundException(
        'Informações de ausência de animais não encontradas',
      );
    }
    return absence;
  }

  async createAnimalAbsence(
    absenceData: Partial<AnimalAbsence>,
  ): Promise<AnimalAbsence> {
    return this.animalAbsenceRepository.create(absenceData);
  }

  async updateAnimalAbsence(
    id: string,
    absenceData: Partial<AnimalAbsence>,
  ): Promise<AnimalAbsence> {
    await this.findAnimalAbsenceById(id);
    return this.animalAbsenceRepository.update(id, absenceData);
  }

  async upsertAnimalAbsence(
    formId: string,
    absenceData: Partial<AnimalAbsence>,
  ): Promise<AnimalAbsence> {
    return this.animalAbsenceRepository.upsertByFormId(formId, absenceData);
  }

  async deleteAnimalAbsence(id: string): Promise<void> {
    await this.findAnimalAbsenceById(id);
    await this.animalAbsenceRepository.delete(id);
  }

  // Statistics
  async getAnimalStatistics(): Promise<any> {
    const currentStats =
      await this.currentAnimalRepository.getAnimalStatistics();
    const previousCount = await this.previousAnimalRepository.count();
    const totalPuppies =
      await this.puppiesKittensRepository.getTotalPuppyCount();
    const absenceCount = await this.animalAbsenceRepository.count();

    return {
      currentAnimals: currentStats,
      previousAnimalsCount: previousCount,
      totalPuppiesCount: totalPuppies,
      formsWithoutAnimals: absenceCount,
    };
  }

  // Bulk operations
  async bulkCreateCurrentAnimals(
    formId: string,
    animalsData: Partial<CurrentAnimal>[],
  ): Promise<CurrentAnimal[]> {
    return this.currentAnimalRepository.bulkCreate(formId, animalsData);
  }

  async reorderCurrentAnimals(
    formId: string,
    animalOrders: { id: string; order: number }[],
  ): Promise<void> {
    await this.currentAnimalRepository.reorderAnimals(formId, animalOrders);
  }

  // Form-specific operations
  async getFormAnimalsOverview(formId: string): Promise<{
    currentAnimals: CurrentAnimal[];
    previousAnimals: PreviousAnimal[];
    puppiesKittens: PuppiesKittens[];
    animalAbsence: AnimalAbsence | null;
  }> {
    const [currentAnimals, previousAnimals, puppiesKittens, animalAbsence] =
      await Promise.all([
        this.findCurrentAnimalsByFormId(formId),
        this.findPreviousAnimalsByFormId(formId),
        this.findPuppiesKittensByFormId(formId),
        this.findAnimalAbsenceByFormId(formId),
      ]);

    return {
      currentAnimals,
      previousAnimals,
      puppiesKittens,
      animalAbsence,
    };
  }

  async deleteAllFormAnimals(formId: string): Promise<void> {
    await this.currentAnimalRepository.deleteByFormId(formId);
    await this.animalAbsenceRepository.deleteByFormId(formId);
  }

  // Validation helpers
  async validateCurrentAnimalData(
    animalData: Partial<CurrentAnimal>,
  ): Promise<void> {
    if (!animalData.animal_species) {
      throw new BadRequestException('Espécie do animal é obrigatória');
    }

    if (animalData.age_months !== null && animalData.age_years !== null) {
      throw new BadRequestException(
        'Informe apenas idade em meses OU em anos, não ambos',
      );
    }

    if (!animalData.age_months && !animalData.age_years) {
      throw new BadRequestException('Idade do animal é obrigatória');
    }

    if (
      animalData.age_months &&
      (animalData.age_months < 0 || animalData.age_months >= 12)
    ) {
      throw new BadRequestException('Idade em meses deve ser entre 0 e 11');
    }

    if (
      animalData.age_years &&
      (animalData.age_years < 1 || animalData.age_years > 30)
    ) {
      throw new BadRequestException('Idade em anos deve ser entre 1 e 30');
    }
  }

  // UI State helpers
  async toggleAnimalCardMinimized(id: string): Promise<CurrentAnimal> {
    await this.findCurrentAnimalById(id);
    return this.currentAnimalRepository.toggleCardMinimized(id);
  }
}
