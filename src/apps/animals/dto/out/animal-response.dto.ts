import { ApiProperty } from '@nestjs/swagger';

export class CurrentAnimalResponseDto {
  @ApiProperty({
    description: 'Animal ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Form ID that this animal belongs to',
    example: 'uuid-string',
  })
  form_id: string;

  @ApiProperty({
    description: 'Animal name',
    example: 'Rex',
  })
  name: string;

  @ApiProperty({
    description: 'Animal species',
    example: 'Cachorro',
  })
  species: string;

  @ApiProperty({
    description: 'Animal breed',
    example: 'Labrador',
    required: false,
  })
  breed?: string;

  @ApiProperty({
    description: 'Animal sex',
    example: 'M',
  })
  sex: string;

  @ApiProperty({
    description: 'Animal age',
    example: 3,
    required: false,
  })
  age?: number;

  @ApiProperty({
    description: 'Animal age unit',
    example: 'anos',
    required: false,
  })
  age_unit?: string;

  @ApiProperty({
    description: 'Animal weight in kg',
    example: 25.5,
    required: false,
  })
  weight_kg?: number;

  @ApiProperty({
    description: 'Animal castration status',
    example: true,
    required: false,
  })
  is_castrated?: boolean;

  @ApiProperty({
    description: 'Animal vaccination status',
    example: true,
    required: false,
  })
  is_vaccinated?: boolean;

  @ApiProperty({
    description: 'Last vaccination date',
    example: '2024-01-01',
    required: false,
  })
  last_vaccination_date?: string;

  @ApiProperty({
    description: 'Animal health status',
    example: 'Saudável',
    required: false,
  })
  health_status?: string;

  @ApiProperty({
    description: 'Animal temperament',
    example: 'Dócil',
    required: false,
  })
  temperament?: string;

  @ApiProperty({
    description: 'Animal physical description',
    example: 'Pelagem dourada, porte médio',
    required: false,
  })
  physical_description?: string;

  @ApiProperty({
    description: 'Additional observations',
    example: 'Animal muito carinhoso',
    required: false,
  })
  observations?: string;

  @ApiProperty({
    description: 'Display order',
    example: 1,
    required: false,
  })
  display_order?: number;

  @ApiProperty({
    description: 'Card minimized state',
    example: false,
    required: false,
  })
  is_card_minimized?: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}

export class PreviousAnimalResponseDto {
  @ApiProperty({
    description: 'Animal ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Form ID that this animal belongs to',
    example: 'uuid-string',
  })
  form_id: string;

  @ApiProperty({
    description: 'Animal name',
    example: 'Buddy',
  })
  name: string;

  @ApiProperty({
    description: 'Animal species',
    example: 'Gato',
  })
  species: string;

  @ApiProperty({
    description: 'Animal breed',
    example: 'Siamês',
    required: false,
  })
  breed?: string;

  @ApiProperty({
    description: 'Animal sex',
    example: 'F',
  })
  sex: string;

  @ApiProperty({
    description: 'Animal acquisition date',
    example: '2020-01-01',
    required: false,
  })
  acquisition_date?: string;

  @ApiProperty({
    description: 'Animal loss date',
    example: '2023-01-01',
    required: false,
  })
  loss_date?: string;

  @ApiProperty({
    description: 'Reason for animal loss',
    example: 'Natural death',
    required: false,
  })
  loss_reason?: string;

  @ApiProperty({
    description: 'Animal lifespan in years',
    example: 3,
    required: false,
  })
  lifespan_years?: number;

  @ApiProperty({
    description: 'Animal castration status',
    example: true,
    required: false,
  })
  was_castrated?: boolean;

  @ApiProperty({
    description: 'Animal vaccination status',
    example: true,
    required: false,
  })
  was_vaccinated?: boolean;

  @ApiProperty({
    description: 'Animal health status',
    example: 'Saudável',
    required: false,
  })
  health_status?: string;

  @ApiProperty({
    description: 'Additional observations',
    example: 'Animal muito querido pela família',
    required: false,
  })
  observations?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}

export class PuppiesKittensResponseDto {
  @ApiProperty({
    description: 'Record ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Form ID that this record belongs to',
    example: 'uuid-string',
  })
  form_id: string;

  @ApiProperty({
    description: 'Species (puppies or kittens)',
    example: 'puppies',
  })
  species: string;

  @ApiProperty({
    description: 'Number of births in last 12 months',
    example: 2,
    required: false,
  })
  births_last_12_months?: number;

  @ApiProperty({
    description: 'Total number born',
    example: 8,
    required: false,
  })
  total_born?: number;

  @ApiProperty({
    description: 'Number that survived',
    example: 7,
    required: false,
  })
  survived?: number;

  @ApiProperty({
    description: 'Number that died',
    example: 1,
    required: false,
  })
  died?: number;

  @ApiProperty({
    description: 'Number given away',
    example: 5,
    required: false,
  })
  given_away?: number;

  @ApiProperty({
    description: 'Number sold',
    example: 2,
    required: false,
  })
  sold?: number;

  @ApiProperty({
    description: 'Number kept',
    example: 0,
    required: false,
  })
  kept?: number;

  @ApiProperty({
    description: 'Date of last birth',
    example: '2024-01-01',
    required: false,
  })
  last_birth_date?: string;

  @ApiProperty({
    description: 'Castration plans',
    example: 'Planned for next month',
    required: false,
  })
  castration_plans?: string;

  @ApiProperty({
    description: 'Additional observations',
    example: 'All puppies were healthy',
    required: false,
  })
  observations?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}

export class AnimalAbsenceResponseDto {
  @ApiProperty({
    description: 'Record ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Form ID that this record belongs to',
    example: 'uuid-string',
  })
  form_id: string;

  @ApiProperty({
    description: 'Indicates if there are no animals currently',
    example: true,
  })
  no_animals_currently: boolean;

  @ApiProperty({
    description: 'Reason for not having animals',
    example: 'Recent loss of pet',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    description: 'Plans to acquire animals in the future',
    example: 'Planning to adopt a dog next year',
    required: false,
  })
  future_plans?: string;

  @ApiProperty({
    description: 'Date when last animal was lost/given away',
    example: '2023-12-01',
    required: false,
  })
  last_animal_date?: string;

  @ApiProperty({
    description: 'Previous experience with animals',
    example: 'Had dogs for 10 years',
    required: false,
  })
  previous_experience?: string;

  @ApiProperty({
    description: 'Additional observations',
    example: 'Family is currently traveling frequently',
    required: false,
  })
  observations?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}
