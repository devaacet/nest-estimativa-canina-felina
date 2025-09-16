import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  AcquisitionMethod,
  AcquisitionTime,
  AnimalBreed,
  AnimalGender,
  AnimalHousing,
  AnimalSpecies,
  CastrationReason,
  CastrationStatus,
  VaccinationReason,
} from '../../../shared/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCurrentAnimalDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Nome do animal',
    example: 'Rex',
  })
  name?: string;

  @IsEnum(AnimalSpecies)
  @ApiPropertyOptional({
    description: 'Espécie do animal',
    enum: AnimalSpecies,
    example: AnimalSpecies.DOG,
  })
  species: AnimalSpecies;

  @IsOptional()
  @IsEnum(AnimalGender)
  @ApiPropertyOptional({
    description: 'Gênero do animal',
    enum: AnimalGender,
  })
  gender?: AnimalGender;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(11)
  @ApiPropertyOptional({
    description: 'Idade em meses do animal',
    example: 6,
    minimum: 0,
    maximum: 11,
  })
  ageMonths?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(30)
  @ApiPropertyOptional({
    description: 'Idade em anos do animal',
    example: 3,
    minimum: 0,
    maximum: 30,
  })
  ageYears?: number;

  @IsOptional()
  @IsEnum(CastrationStatus)
  @ApiPropertyOptional({
    description: 'Status de castração do animal',
    enum: CastrationStatus,
  })
  castrationStatus?: CastrationStatus;

  @IsOptional()
  @IsArray()
  @IsEnum(CastrationReason, { each: true })
  @ApiPropertyOptional({
    description: 'Razões para castração',
    enum: CastrationReason,
    isArray: true,
  })
  castrationReason?: CastrationReason[];

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Se tem interesse em castrar o animal',
    example: true,
  })
  interestedCastration?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Se o animal é vacinado',
    example: true,
  })
  isVaccinated?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(VaccinationReason, { each: true })
  @ApiPropertyOptional({
    description: 'Razões para vacinação',
    enum: VaccinationReason,
    isArray: true,
  })
  vaccinationReason?: VaccinationReason[];

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Se o animal tem acesso à rua desacompanhado',
    example: false,
  })
  streetAccessUnaccompanied?: boolean;

  @IsOptional()
  @IsEnum(AcquisitionMethod)
  @ApiPropertyOptional({
    description: 'Método de aquisição do animal',
    enum: AcquisitionMethod,
  })
  acquisitionMethod?: AcquisitionMethod;

  @IsOptional()
  @IsEnum(AcquisitionTime)
  @ApiPropertyOptional({
    description: 'Tempo de aquisição do animal',
    enum: AcquisitionTime,
  })
  acquisitionTime?: AcquisitionTime;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Estado onde o animal foi adquirido',
    example: 'São Paulo',
  })
  acquisitionState?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Cidade onde o animal foi adquirido',
    example: 'São Paulo',
  })
  acquisitionCity?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(AnimalHousing, { each: true })
  @ApiPropertyOptional({
    description: 'Métodos de acomodação do animal',
    enum: AnimalHousing,
    isArray: true,
  })
  housingMethods?: AnimalHousing[];

  @IsOptional()
  @IsEnum(AnimalBreed)
  @ApiPropertyOptional({
    description: 'Raça do animal',
    enum: AnimalBreed,
  })
  animalBreed?: AnimalBreed;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Se o animal tem microchip',
    example: false,
  })
  hasMicrochip?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Se tem interesse em colocar microchip no animal',
    example: true,
  })
  interestedMicrochip?: boolean;

  // Metadata
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'Ordem de registro do animal',
    example: 1,
  })
  registrationOrder?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Se o cartão do animal está minimizado na interface',
    example: false,
  })
  cardMinimized?: boolean;
}
