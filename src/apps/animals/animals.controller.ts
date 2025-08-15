import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import {
  BulkCreateAnimalsDto,
  CreateAnimalAbsenceDto,
  CreateCurrentAnimalDto,
  CreatePreviousAnimalDto,
  CreatePuppiesKittensDto,
  ReorderAnimalsDto,
  UpdateCurrentAnimalDto,
} from './dto/in';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Animals')
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  // Current Animals endpoints
  @Get('current/form/:formId')
  @ApiOperation({ summary: 'Get current animals by form ID' })
  @ApiResponse({
    status: 200,
    description: 'Current animals retrieved successfully',
  })
  async getCurrentAnimalsByFormId(@Param('formId') formId: string) {
    const animals =
      await this.animalsService.findCurrentAnimalsByFormId(formId);

    return {
      success: true,
      data: { animals },
    };
  }

  @Get('current/:id')
  @ApiOperation({ summary: 'Get current animal by ID' })
  @ApiResponse({
    status: 200,
    description: 'Current animal retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Animal not found' })
  async getCurrentAnimalById(@Param('id') id: string) {
    const animal = await this.animalsService.findCurrentAnimalById(id);

    return {
      success: true,
      data: { animal },
    };
  }

  @Post('current')
  @ApiOperation({ summary: 'Create current animal' })
  @ApiResponse({
    status: 201,
    description: 'Current animal created successfully',
  })
  async createCurrentAnimal(@Body() animalData: CreateCurrentAnimalDto) {
    await this.animalsService.validateCurrentAnimalData(animalData);
    const animal = await this.animalsService.createCurrentAnimal(animalData);

    return {
      success: true,
      data: { animal },
    };
  }

  @Put('current/:id')
  @ApiOperation({ summary: 'Update current animal' })
  @ApiResponse({
    status: 200,
    description: 'Current animal updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Animal not found' })
  async updateCurrentAnimal(
    @Param('id') id: string,
    @Body() animalData: UpdateCurrentAnimalDto,
  ) {
    await this.animalsService.validateCurrentAnimalData(animalData);
    const animal = await this.animalsService.updateCurrentAnimal(
      id,
      animalData,
    );

    return {
      success: true,
      data: { animal },
    };
  }

  @Delete('current/:id')
  @ApiOperation({ summary: 'Delete current animal' })
  @ApiResponse({
    status: 200,
    description: 'Current animal deleted successfully',
  })
  async deleteCurrentAnimal(@Param('id') id: string) {
    await this.animalsService.deleteCurrentAnimal(id);

    return {
      success: true,
      data: { message: 'Animal atual excluído com sucesso' },
    };
  }

  // Previous Animals endpoints
  @Get('previous/form/:formId')
  @ApiOperation({ summary: 'Get previous animals by form ID' })
  @ApiResponse({
    status: 200,
    description: 'Previous animals retrieved successfully',
  })
  async getPreviousAnimalsByFormId(@Param('formId') formId: string) {
    const animals =
      await this.animalsService.findPreviousAnimalsByFormId(formId);

    return {
      success: true,
      data: { animals },
    };
  }

  @Post('previous')
  @ApiOperation({ summary: 'Create previous animal' })
  @ApiResponse({
    status: 201,
    description: 'Previous animal created successfully',
  })
  async createPreviousAnimal(@Body() animalData: CreatePreviousAnimalDto) {
    const animal = await this.animalsService.createPreviousAnimal(animalData);

    return {
      success: true,
      data: { animal },
    };
  }

  @Put('previous/:id')
  @ApiOperation({ summary: 'Update previous animal' })
  @ApiResponse({
    status: 200,
    description: 'Previous animal updated successfully',
  })
  async updatePreviousAnimal(
    @Param('id') id: string,
    @Body() animalData: CreatePreviousAnimalDto,
  ) {
    const animal = await this.animalsService.updatePreviousAnimal(
      id,
      animalData,
    );

    return {
      success: true,
      data: { animal },
    };
  }

  @Delete('previous/:id')
  @ApiOperation({ summary: 'Delete previous animal' })
  @ApiResponse({
    status: 200,
    description: 'Previous animal deleted successfully',
  })
  async deletePreviousAnimal(@Param('id') id: string) {
    await this.animalsService.deletePreviousAnimal(id);

    return {
      success: true,
      data: { message: 'Animal anterior excluído com sucesso' },
    };
  }

  // Puppies/Kittens endpoints
  @Get('puppies-kittens/form/:formId')
  @ApiOperation({ summary: 'Get puppies/kittens by form ID' })
  @ApiResponse({
    status: 200,
    description: 'Puppies/kittens retrieved successfully',
  })
  async getPuppiesKittensByFormId(@Param('formId') formId: string) {
    const puppiesKittens =
      await this.animalsService.findPuppiesKittensByFormId(formId);

    return {
      success: true,
      data: { puppiesKittens },
    };
  }

  @Post('puppies-kittens')
  @ApiOperation({ summary: 'Create puppies/kittens record' })
  @ApiResponse({
    status: 201,
    description: 'Puppies/kittens record created successfully',
  })
  async createPuppiesKittens(@Body() puppiesData: CreatePuppiesKittensDto) {
    const puppiesKittens =
      await this.animalsService.createPuppiesKittens(puppiesData);

    return {
      success: true,
      data: { puppiesKittens },
    };
  }

  @Put('puppies-kittens/:id')
  @ApiOperation({ summary: 'Update puppies/kittens record' })
  @ApiResponse({
    status: 200,
    description: 'Puppies/kittens record updated successfully',
  })
  async updatePuppiesKittens(
    @Param('id') id: string,
    @Body() puppiesData: CreatePuppiesKittensDto,
  ) {
    const puppiesKittens = await this.animalsService.updatePuppiesKittens(
      id,
      puppiesData,
    );

    return {
      success: true,
      data: { puppiesKittens },
    };
  }

  @Delete('puppies-kittens/:id')
  @ApiOperation({ summary: 'Delete puppies/kittens record' })
  @ApiResponse({
    status: 200,
    description: 'Puppies/kittens record deleted successfully',
  })
  async deletePuppiesKittens(@Param('id') id: string) {
    await this.animalsService.deletePuppiesKittens(id);

    return {
      success: true,
      data: { message: 'Registro de filhotes excluído com sucesso' },
    };
  }

  // Animal Absence endpoints
  @Get('absence/form/:formId')
  @ApiOperation({ summary: 'Get animal absence info by form ID' })
  @ApiResponse({
    status: 200,
    description: 'Animal absence info retrieved successfully',
  })
  async getAnimalAbsenceByFormId(@Param('formId') formId: string) {
    const animalAbsence =
      await this.animalsService.findAnimalAbsenceByFormId(formId);

    return {
      success: true,
      data: { animalAbsence },
    };
  }

  @Post('absence')
  @ApiOperation({ summary: 'Create animal absence record' })
  @ApiResponse({
    status: 201,
    description: 'Animal absence record created successfully',
  })
  async createAnimalAbsence(@Body() absenceData: CreateAnimalAbsenceDto) {
    const animalAbsence =
      await this.animalsService.createAnimalAbsence(absenceData);

    return {
      success: true,
      data: { animalAbsence },
    };
  }

  @Put('absence/form/:formId')
  @ApiOperation({ summary: 'Upsert animal absence record by form ID' })
  @ApiResponse({
    status: 200,
    description: 'Animal absence record saved successfully',
  })
  async upsertAnimalAbsence(
    @Param('formId') formId: string,
    @Body() absenceData: CreateAnimalAbsenceDto,
  ) {
    const animalAbsence = await this.animalsService.upsertAnimalAbsence(
      formId,
      absenceData,
    );

    return {
      success: true,
      data: { animalAbsence },
    };
  }

  @Delete('absence/:id')
  @ApiOperation({ summary: 'Delete animal absence record' })
  @ApiResponse({
    status: 200,
    description: 'Animal absence record deleted successfully',
  })
  async deleteAnimalAbsence(@Param('id') id: string) {
    await this.animalsService.deleteAnimalAbsence(id);

    return {
      success: true,
      data: {
        message: 'Informações de ausência de animais excluídas com sucesso',
      },
    };
  }

  // Statistics endpoints
  @Get('statistics/overview')
  @ApiOperation({ summary: 'Get animals statistics overview' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getAnimalStatistics() {
    const statistics = await this.animalsService.getAnimalStatistics();

    return {
      success: true,
      data: { statistics },
    };
  }

  // Form overview endpoint
  @Get('form/:formId/overview')
  @ApiOperation({ summary: 'Get complete animals overview for a form' })
  @ApiResponse({
    status: 200,
    description: 'Form animals overview retrieved successfully',
  })
  async getFormAnimalsOverview(@Param('formId') formId: string) {
    const overview = await this.animalsService.getFormAnimalsOverview(formId);

    return {
      success: true,
      data: overview,
    };
  }

  // Bulk operations
  @Post('current/bulk')
  @ApiOperation({ summary: 'Create multiple current animals' })
  @ApiResponse({
    status: 201,
    description: 'Current animals created successfully',
  })
  async bulkCreateCurrentAnimals(@Body() bulkData: BulkCreateAnimalsDto) {
    const animals = await this.animalsService.bulkCreateCurrentAnimals(
      bulkData.formId,
      bulkData.animalsData,
    );

    return {
      success: true,
      data: { animals },
    };
  }

  @Put('current/form/:formId/reorder')
  @ApiOperation({ summary: 'Reorder current animals' })
  @ApiResponse({ status: 200, description: 'Animals reordered successfully' })
  async reorderCurrentAnimals(
    @Param('formId') formId: string,
    @Body() reorderData: ReorderAnimalsDto,
  ) {
    await this.animalsService.reorderCurrentAnimals(
      formId,
      reorderData.animalOrders,
    );

    return {
      success: true,
      data: { message: 'Animais reordenados com sucesso' },
    };
  }

  // UI State endpoints
  @Put('current/:id/toggle-minimized')
  @ApiOperation({ summary: 'Toggle animal card minimized state' })
  @ApiResponse({ status: 200, description: 'Card state toggled successfully' })
  async toggleAnimalCardMinimized(@Param('id') id: string) {
    const animal = await this.animalsService.toggleAnimalCardMinimized(id);

    return {
      success: true,
      data: { animal },
    };
  }

  // Cleanup endpoint
  @Delete('form/:formId/all')
  @ApiOperation({ summary: 'Delete all animals for a form' })
  @ApiResponse({
    status: 200,
    description: 'All form animals deleted successfully',
  })
  async deleteAllFormAnimals(@Param('formId') formId: string) {
    await this.animalsService.deleteAllFormAnimals(formId);

    return {
      success: true,
      data: { message: 'Todos os animais do formulário foram excluídos' },
    };
  }
}
