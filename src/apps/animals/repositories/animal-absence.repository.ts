import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimalAbsence } from '../entities/animal-absence.entity';
import { HypotheticalAcquisition } from '../../../shared/enums';

@Injectable()
export class AnimalAbsenceRepository {
  constructor(
    @InjectRepository(AnimalAbsence)
    private readonly absenceRepository: Repository<AnimalAbsence>,
  ) {}

  async findAll(): Promise<AnimalAbsence[]> {
    return this.absenceRepository.find({
      relations: ['form'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<AnimalAbsence | null> {
    return this.absenceRepository.findOne({
      where: { id },
      relations: ['form'],
    });
  }

  async findByFormId(formId: string): Promise<AnimalAbsence | null> {
    return this.absenceRepository.findOne({
      where: { form_id: formId },
      relations: ['form'],
    });
  }

  async findByHypotheticalAcquisition(
    acquisition: HypotheticalAcquisition,
  ): Promise<AnimalAbsence[]> {
    return this.absenceRepository.find({
      where: { hypothetical_acquisition: acquisition },
      relations: ['form'],
      order: { created_at: 'DESC' },
    });
  }

  async create(absenceData: Partial<AnimalAbsence>): Promise<AnimalAbsence> {
    const absence = this.absenceRepository.create(absenceData);
    return this.absenceRepository.save(absence);
  }

  async update(
    id: string,
    absenceData: Partial<AnimalAbsence>,
  ): Promise<AnimalAbsence> {
    await this.absenceRepository.update(id, absenceData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Animal absence record not found after update');
    }
    return updated;
  }

  async upsertByFormId(
    formId: string,
    absenceData: Partial<AnimalAbsence>,
  ): Promise<AnimalAbsence> {
    const existing = await this.findByFormId(formId);

    if (existing) {
      return this.update(existing.id, absenceData);
    } else {
      return this.create({ ...absenceData, form_id: formId });
    }
  }

  async delete(id: string): Promise<void> {
    await this.absenceRepository.delete(id);
  }

  async deleteByFormId(formId: string): Promise<void> {
    await this.absenceRepository.delete({ form_id: formId });
  }

  async count(): Promise<number> {
    return this.absenceRepository.count();
  }

  async countByHypotheticalAcquisition(
    acquisition: HypotheticalAcquisition,
  ): Promise<number> {
    return this.absenceRepository.count({
      where: { hypothetical_acquisition: acquisition },
    });
  }
}
