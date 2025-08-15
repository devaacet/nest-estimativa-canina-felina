import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { CityQuestion } from './entities/city-question.entity';
import { CityRepository } from './repositories/city.repository';
import { CityQuestionRepository } from './repositories/city-question.repository';

@Module({
  imports: [TypeOrmModule.forFeature([City, CityQuestion])],
  controllers: [CityController],
  providers: [CityService, CityRepository, CityQuestionRepository],
  exports: [CityService, CityRepository, CityQuestionRepository, TypeOrmModule],
})
export class CityModule {}
