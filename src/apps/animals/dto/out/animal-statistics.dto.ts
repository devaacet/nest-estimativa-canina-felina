import { ApiProperty } from '@nestjs/swagger';

export class AnimalStatisticsDto {
  @ApiProperty({
    description: 'Total current animals',
    example: 150,
  })
  totalCurrentAnimals: number;

  @ApiProperty({
    description: 'Total previous animals',
    example: 75,
  })
  totalPreviousAnimals: number;

  @ApiProperty({
    description: 'Total puppies/kittens records',
    example: 25,
  })
  totalPuppiesKittens: number;

  @ApiProperty({
    description: 'Total absence records',
    example: 10,
  })
  totalAbsenceRecords: number;

  @ApiProperty({
    description: 'Animals by species distribution',
    example: { dogs: 85, cats: 40, others: 25 },
  })
  bySpecies: Record<string, number>;

  @ApiProperty({
    description: 'Castration statistics',
    example: { castrated: 95, notCastrated: 55 },
  })
  castrationStats: {
    castrated: number;
    notCastrated: number;
  };

  @ApiProperty({
    description: 'Vaccination statistics',
    example: { vaccinated: 120, notVaccinated: 30 },
  })
  vaccinationStats: {
    vaccinated: number;
    notVaccinated: number;
  };

  @ApiProperty({
    description: 'Animals by health status',
    example: { healthy: 140, sick: 5, recovering: 5 },
  })
  healthStatusDistribution: Record<string, number>;

  @ApiProperty({
    description: 'Average age of animals',
    example: 4.2,
  })
  averageAge: number;

  @ApiProperty({
    description: 'Average weight of animals in kg',
    example: 18.5,
  })
  averageWeight: number;
}

export class FormAnimalsOverviewDto {
  @ApiProperty({
    description: 'Current animals count',
    example: 3,
  })
  currentAnimalsCount: number;

  @ApiProperty({
    description: 'Previous animals count',
    example: 2,
  })
  previousAnimalsCount: number;

  @ApiProperty({
    description: 'Puppies/kittens records count',
    example: 1,
  })
  puppiesKittensCount: number;

  @ApiProperty({
    description: 'Has absence record',
    example: false,
  })
  hasAbsenceRecord: boolean;

  @ApiProperty({
    description: 'Current animals summary',
    example: ['Rex (Cachorro)', 'Mia (Gato)'],
  })
  currentAnimalsSummary: string[];

  @ApiProperty({
    description: 'Previous animals summary',
    example: ['Buddy (Gato)', 'Max (Cachorro)'],
  })
  previousAnimalsSummary: string[];

  @ApiProperty({
    description: 'Total animals managed',
    example: 5,
  })
  totalAnimals: number;
}
