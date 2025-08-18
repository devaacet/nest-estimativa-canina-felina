import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { CityQuestion } from './entities/city-question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityRepository } from './repositories/city.repository';

@Module({
  imports: [TypeOrmModule.forFeature([City, CityQuestion])],
  controllers: [CityController],
  providers: [CityService, CityRepository],
  exports: [CityService, CityRepository],
})
export class CityModule {}
