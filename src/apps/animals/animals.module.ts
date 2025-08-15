import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { CurrentAnimal } from './entities/current-animal.entity';
import { PreviousAnimal } from './entities/previous-animal.entity';
import { PuppiesKittens } from './entities/puppies-kittens.entity';
import { AnimalAbsence } from './entities/animal-absence.entity';
import { CurrentAnimalRepository } from './repositories/current-animal.repository';
import { PreviousAnimalRepository } from './repositories/previous-animal.repository';
import { PuppiesKittensRepository } from './repositories/puppies-kittens.repository';
import { AnimalAbsenceRepository } from './repositories/animal-absence.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CurrentAnimal,
      PreviousAnimal,
      PuppiesKittens,
      AnimalAbsence,
    ]),
  ],
  controllers: [AnimalsController],
  providers: [
    AnimalsService,
    CurrentAnimalRepository,
    PreviousAnimalRepository,
    PuppiesKittensRepository,
    AnimalAbsenceRepository,
  ],
  exports: [
    AnimalsService,
    CurrentAnimalRepository,
    PreviousAnimalRepository,
    PuppiesKittensRepository,
    AnimalAbsenceRepository,
    TypeOrmModule,
  ],
})
export class AnimalsModule {}
