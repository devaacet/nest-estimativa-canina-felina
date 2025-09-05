import { Injectable } from '@nestjs/common';
import { Workbook, Worksheet } from 'exceljs';
import { Form } from '../entities/form.entity';
import * as Enums from '../../../shared/enums';

@Injectable()
export class ExcelExportService {
  private readonly PORTUGUESE_HEADERS = {
    // Main form headers (from form-flow.md)
    main: {
      id: 'ID',
      formType: 'Tipo de Formulário',
      status: 'Status',
      currentStep: 'Etapa Atual',

      // Step 1 - Initial Information
      interviewerName: 'Nome do Entrevistador',
      interviewDate: 'Data da Entrevista',
      censusSectorCode: 'Código do Setor Censitário',
      interviewStatus: 'Status da Entrevista',
      addressStreet: 'Rua',
      addressNumber: 'N°',
      addressComplement: 'Complemento',
      residenceType: 'Tipo de Residência',

      // Step 2 - Socioeconomic Information
      educationLevel: 'Escolaridade do Entrevistado',
      childrenCount: 'Crianças (até 12 anos)',
      teensCount: 'Adolescentes (até 18 anos)',
      adultsCount: 'Adultos (até 60 anos)',
      elderlyCount: 'Idosos (acima de 60 anos)',
      housingType: 'Tipo de Moradia',
      monthlyIncome: 'Renda Familiar/Domiciliar Total Mensal',

      // Step 3 - Animal Information
      hasDogsCats: 'Tem cães ou gatos na residência no momento?',
      generalAnimalDestiny:
        'Quando tem animais na casa, em geral qual o destino?',
      strayAnimalsNeighborhood:
        'Algum animal sem tutor frequenta o quarteirão?',
      strayAnimalsCount: 'Quantos?',
      strayAnimalsSpecies: 'Qual a espécie?',
      strayAnimalsCondition: 'Qual a aparência do animal?',
      caresStreetAnimals: 'Você cuida de cães ou gatos "de rua"',
      careTypes: 'Que tipo de cuidado promove',
      vetFrequency:
        'Com que frequência você leva seu(s) animal(is) ao veterinário?',
      monthlyVetCost:
        'Você gasta, em média, quanto por mês com seu(s) animal(is)?',
      communityAnimals: 'No seu quarteirão, existem animais comunitários?',

      createdAt: 'Data de Criação',
      updatedAt: 'Data de Atualização',
      submittedAt: 'Data de Submissão',

      // Additional columns from relationships
      userName: 'Nome do Usuário',
      cityName: 'Nome da Cidade',
    },

    // Current animals headers (Step 4)
    currentAnimals: {
      formId: 'ID do Formulário',
      animalName: 'Nome do Animal',
      animalSpecies: 'Espécie',
      animalGender: 'Sexo',
      ageMonths: 'Idade (Meses)',
      ageYears: 'Idade (Anos)',
      castrationStatus: 'Castrado',
      castrationReason: 'Razão para não castração',
      interestedCastration: 'Tem interesse na castração?',
      isVaccinated: 'Vacinas em dia',
      vaccinationReason: 'Razão para não vacinação',
      streetAccessUnaccompanied: 'Acesso a rua desacompanhado',
      acquisitionMethod: 'Forma de aquisição',
      acquisitionTime: 'Tempo de aquisição',
      acquisitionState: 'Estado de aquisição',
      acquisitionCity: 'Município de aquisição',
      housingMethods: 'Forma de manutenção do animal na residência',
      animalBreed: 'Raça',
      hasMicrochip: 'Tem microchip?',
      interestedMicrochip: 'Tem interesse em microchip?',
      registrationOrder: 'Ordem de Cadastro',
    },

    // Previous animals headers (Step 5)
    previousAnimals: {
      formId: 'ID do Formulário',
      animalName: 'Nome do Animal',
      animalSpecies: 'Espécie',
      animalGender: 'Sexo',
      ageMonths: 'Idade (Meses)',
      ageYears: 'Idade (Anos)',
      castrationStatus: 'Castrado',
      castrationReason: 'Razão para não castração',
      isVaccinated: 'Vacinas em dia',
      vaccinationReason: 'Razão para não vacinação',
      acquisitionMethod: 'Forma de aquisição',
      destiny: 'Destino',
      registrationOrder: 'Ordem de Cadastro',
    },

    // Puppies/kittens headers (Step 6)
    puppiesKittens: {
      formId: 'ID do Formulário',
      hadPuppiesLast12Months: 'Teve filhotes nos últimos 12 meses?',
      puppiesCount: 'Número de filhotes',
      areVaccinated: 'Foram/são vacinados?',
      vaccinationReason: 'Razão para não vacinação',
      origin: 'Qual foi/é a origem?',
      destiny: 'Qual foi/será o destino?',
    },

    // Animal absence headers (Step 7)
    animalAbsence: {
      formId: 'ID do Formulário',
      howWouldAcquire: 'Se você decidisse ter um animal, como faria?',
      castrationDecision: 'Se você tivesse um cão/gato, optaria pela castração',
      castrationReason: 'Razão para não castração',
      reasonForNotHaving: 'Qual o motivo de não ter animais?',
    },

    // City questions headers (Step 8)
    cityQuestions: {
      formId: 'ID do Formulário',
      questionText: 'Pergunta',
      responseText: 'Resposta',
      isRequired: 'Obrigatória',
    },
  };

  // Enum value mappings to Portuguese based on form-flow.md
  private readonly ENUM_TRANSLATIONS: Record<string, string> = {
    // FormStatus
    [Enums.FormStatus.DRAFT]: 'Rascunho',
    [Enums.FormStatus.COMPLETED]: 'Completo',
    [Enums.FormStatus.SUBMITTED]: 'Enviado',

    // InterviewStatus
    [Enums.InterviewStatus.ATTENDED]: 'Atendida',
    [Enums.InterviewStatus.REFUSED]: 'Recusada',
    [Enums.InterviewStatus.CLOSED_HOUSE]: 'Casa fechada',

    // ResidenceType
    [Enums.ResidenceType.HOUSE]: 'Casa',
    [Enums.ResidenceType.APARTMENT]: 'Apartamento',
    [Enums.ResidenceType.OTHERS]: 'Outros',

    // EducationLevel
    [Enums.EducationLevel.NONE]: 'Não há',
    [Enums.EducationLevel.ELEMENTARY]: 'Fundamental',
    [Enums.EducationLevel.HIGH_SCHOOL]: 'Médio',
    [Enums.EducationLevel.HIGHER]: 'Superior',
    [Enums.EducationLevel.TECHNICAL]: 'Técnico',

    // CastrationDecision
    [Enums.CastrationDecision.YES]: 'Sim',
    [Enums.CastrationDecision.NO]: 'Não',
    [Enums.CastrationDecision.DONT_KNOW]: 'Não sei',

    // HousingType
    [Enums.HousingType.OWNED]: 'Própria',
    [Enums.HousingType.RENTED]: 'Alugada',
    [Enums.HousingType.PROVIDED]: 'Cedida',

    // IncomeRange
    [Enums.IncomeRange.ZERO_TO_2K]: '0-2mil',
    [Enums.IncomeRange.TWO_TO_5K]: '2mil-5mil',
    [Enums.IncomeRange.FIVE_TO_10K]: '5mil-10mil',
    [Enums.IncomeRange.ABOVE_10K]: 'acima de 10mil',

    // VetFrequency
    [Enums.VetFrequency.MORE_THAN_ONCE_YEAR]: 'Mais de 1 vez por ano',
    [Enums.VetFrequency.ONCE_YEAR]: '1 vez por ano',
    [Enums.VetFrequency.WHEN_SICK]: 'Quando apresenta algum problema de saúde',
    [Enums.VetFrequency.RARELY_NEVER]: 'Raramente/nunca',

    // AnimalSpecies
    [Enums.AnimalSpecies.DOG]: 'Cachorro',
    [Enums.AnimalSpecies.CAT]: 'Gato',
    [Enums.AnimalSpecies.HORSE]: 'Equinos',

    // AnimalGender
    [Enums.AnimalGender.FEMALE]: 'Fêmea',
    [Enums.AnimalGender.MALE]: 'Macho',

    // AnimalCondition
    [Enums.AnimalCondition.HEALTHY]: 'saudável',
    [Enums.AnimalCondition.SICK]: 'doente',
    [Enums.AnimalCondition.INJURED]: 'ferido',

    // CastrationStatus
    [Enums.CastrationStatus.YES_MORE_THAN_YEAR]: 'Sim, mais de um ano',
    [Enums.CastrationStatus.YES_LESS_THAN_YEAR]: 'Sim, menos de um ano',

    // CastrationReason
    [Enums.CastrationReason.NEVER_THOUGHT]: 'Nunca pensou sobre o assunto',
    [Enums.CastrationReason.COST]: 'Custo da castração',
    [Enums.CastrationReason.LACK_TIME]: 'Falta de tempo',
    [Enums.CastrationReason.WANTS_OFFSPRING]: 'Quer crias do animal',
    [Enums.CastrationReason.DANGEROUS]: 'É perigoso para o animal',

    // VaccinationReason
    [Enums.VaccinationReason.NOT_NECESSARY]: 'Não acha necessário',

    // AcquisitionMethod
    [Enums.AcquisitionMethod.ADOPTED]: 'Adotado',
    [Enums.AcquisitionMethod.BOUGHT]: 'Comprado',
    [Enums.AcquisitionMethod.OWN_ANIMAL_OFFSPRING]:
      'Animal próprio que deu cria',
    [Enums.AcquisitionMethod.GIFTED]: 'Ganhado',

    // AcquisitionTime
    [Enums.AcquisitionTime.MORE_THAN_YEAR]: 'Mais de um ano',
    [Enums.AcquisitionTime.LESS_THAN_YEAR]: 'Menos de um ano',

    // AnimalHousing
    [Enums.AnimalHousing.KENNEL_CATTERY]: 'Canil/Gatil',
    [Enums.AnimalHousing.INSIDE_HOUSE]: 'Dentro da residência',
    [Enums.AnimalHousing.LOOSE_YARD]: 'Solto no quintal',
    [Enums.AnimalHousing.CHAINED]: 'Preso por corrente',

    // AnimalBreed
    [Enums.AnimalBreed.WITH_BREED]: 'Com raça',
    [Enums.AnimalBreed.MIXED_BREED]: 'Sem raça definida (SRD)',

    // AnimalDestiny
    [Enums.AnimalDestiny.DONATED]: 'Doado',
    [Enums.AnimalDestiny.DIED]: 'Morreu',
    [Enums.AnimalDestiny.SOLD]: 'Vendido',
    [Enums.AnimalDestiny.DISAPPEARED]: 'Sumiu',
    [Enums.AnimalDestiny.ABANDONED]: 'Abandonou',

    // CareType
    [Enums.CareType.SHELTER]: 'Abrigo',
    [Enums.CareType.FOOD]: 'Alimentação',
    [Enums.CareType.VETERINARY_CARE]: 'Cuidados Veterinários',

    // HypotheticalAcquisition
    [Enums.HypotheticalAcquisition.ADOPT_OWN_INITIATIVE]:
      'adotaria por iniciativa própria',
    [Enums.HypotheticalAcquisition.BUY_KENNEL]:
      'compraria de algum canil/gatil',
    [Enums.HypotheticalAcquisition.ONLY_IF_GIFTED]:
      'só teria se ganhasse de alguém',
    [Enums.HypotheticalAcquisition.NEVER]: 'não teria em hipótese nenhuma',

    // NoAnimalsReason
    [Enums.NoAnimalsReason.DONT_LIKE]: 'Não gosta',
    [Enums.NoAnimalsReason.LIKE_NO_INTEREST]:
      'Gosta, mas nunca teve interesse em ter animais',
  };

  async generateFormsExcel(forms: Form[]): Promise<Buffer> {
    const workbook = new Workbook();

    // Set workbook properties
    workbook.creator = 'Pet Research System';
    workbook.lastModifiedBy = 'Pet Research System';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Create main forms sheet
    this.createMainFormsSheet(workbook, forms);

    // Create current animals sheet
    this.createCurrentAnimalsSheet(workbook, forms);

    // Create previous animals sheet
    this.createPreviousAnimalsSheet(workbook, forms);

    // Create puppies/kittens sheet
    this.createPuppiesKittensSheet(workbook, forms);

    // Create animal absence sheet
    this.createAnimalAbsenceSheet(workbook, forms);

    // Create city questions sheet
    this.createCityQuestionsSheet(workbook, forms);

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private createMainFormsSheet(workbook: Workbook, forms: Form[]): void {
    const worksheet = workbook.addWorksheet('Formulários');

    // Add headers
    const headers = Object.values(this.PORTUGUESE_HEADERS.main);
    worksheet.addRow(headers);

    // Style header row
    this.styleHeaderRow(worksheet, 1);

    // Add data rows
    forms.forEach((form) => {
      const row = [
        form.id,
        this.formatDate(form.interviewDate),
        this.translateEnum(form.status),
        form.currentStep,

        // Step 1
        form.interviewerName,
        this.formatDate(form.interviewDate),
        form.censusSectorCode,
        this.translateEnum(form.interviewStatus),
        form.addressStreet,
        form.addressNumber,
        form.addressComplement || '',
        this.translateEnum(form.residenceType),

        // Step 2
        this.translateEnum(form.educationLevel),
        form.childrenCount,
        form.teensCount,
        form.adultsCount,
        form.elderlyCount,
        this.translateEnum(form.housingType),
        this.translateEnum(form.monthlyIncome),

        // Step 3
        this.formatBoolean(form.hasDogsCats),
        form.generalAnimalDestiny || '',
        this.formatBoolean(form.strayAnimalsNeighborhood),
        form.strayAnimalsCount,
        this.translateEnum(form.strayAnimalsSpecies),
        this.translateEnum(form.strayAnimalsCondition),
        this.formatBoolean(form.caresStreetAnimals),
        this.formatArray(form.careTypes),
        this.translateEnum(form.vetFrequency),
        form.monthlyVetCost || '',
        this.formatBoolean(form.communityAnimals),

        this.formatDate(form.createdAt),
        this.formatDate(form.updatedAt),
        form.submittedAt ? this.formatDate(form.submittedAt) : '',

        // Related data
        form.user?.name || '',
        form.city?.name || '',
      ];

      worksheet.addRow(row);
    });

    // Auto-fit columns
    this.autoFitColumns(worksheet);
  }

  private createCurrentAnimalsSheet(workbook: Workbook, forms: Form[]): void {
    const worksheet = workbook.addWorksheet('Animais Atuais');

    // Add headers
    const headers = Object.values(this.PORTUGUESE_HEADERS.currentAnimals);
    worksheet.addRow(headers);

    // Style header row
    this.styleHeaderRow(worksheet, 1);

    // Add data rows
    forms.forEach((form) => {
      if (form.currentAnimals?.length > 0) {
        form.currentAnimals.forEach((animal) => {
          const row = [
            form.id,
            animal.name || '',
            this.translateEnum(animal.species),
            this.translateEnum(animal.gender),
            animal.ageMonths || '',
            animal.ageYears || '',
            this.translateEnum(animal.castrationStatus),
            this.translateEnumArray(animal.castrationReason),
            this.formatBoolean(animal.interestedCastration),
            this.formatBoolean(animal.isVaccinated),
            this.translateEnumArray(animal.vaccinationReason),
            this.formatBoolean(animal.streetAccessUnaccompanied),
            this.translateEnum(animal.acquisitionMethod),
            this.translateEnum(animal.acquisitionTime),
            animal.acquisitionState || '',
            animal.acquisitionCity || '',
            this.formatArray(animal.housingMethods),
            this.translateEnum(animal.animalBreed),
            this.formatBoolean(animal.hasMicrochip),
            this.formatBoolean(animal.interestedMicrochip),
            animal.registrationOrder,
          ];

          worksheet.addRow(row);
        });
      }
    });

    // Auto-fit columns
    this.autoFitColumns(worksheet);
  }

  private createPreviousAnimalsSheet(workbook: Workbook, forms: Form[]): void {
    const worksheet = workbook.addWorksheet('Animais Anteriores');

    // Add headers
    const headers = Object.values(this.PORTUGUESE_HEADERS.previousAnimals);
    worksheet.addRow(headers);

    // Style header row
    this.styleHeaderRow(worksheet, 1);

    // Add data rows
    forms.forEach((form) => {
      if (form.previousAnimals?.length > 0) {
        form.previousAnimals.forEach((animal) => {
          const row = [
            form.id,
            animal.name || '',
            this.translateEnum(animal.species),
            this.translateEnum(animal.gender),
            animal.ageMonths || '',
            animal.ageYears || '',
            this.translateEnum(animal.castrated),
            this.translateEnumArray(animal.castrationReason),
            this.formatBoolean(animal.isVaccinated),
            this.translateEnumArray(animal.vaccinationReason),
            this.translateEnum(animal.acquisitionMethod),
            this.translateEnum(animal.destiny),
            animal.registrationOrder,
          ];

          worksheet.addRow(row);
        });
      }
    });

    // Auto-fit columns
    this.autoFitColumns(worksheet);
  }

  private createPuppiesKittensSheet(workbook: Workbook, forms: Form[]): void {
    const worksheet = workbook.addWorksheet('Filhotes');

    // Add headers
    const headers = Object.values(this.PORTUGUESE_HEADERS.puppiesKittens);
    worksheet.addRow(headers);

    // Style header row
    this.styleHeaderRow(worksheet, 1);

    // Add data rows
    forms.forEach((form) => {
      if (form.puppiesKittens) {
        const puppies = form.puppiesKittens;
        const row = [
          form.id,
          this.formatBoolean(puppies.hadPuppiesLast12Months),
          puppies.puppyCount || '',
          this.formatBoolean(puppies.puppiesVaccinated),
          this.translateEnumArray(puppies.vaccinationReason),
          this.translateEnum(puppies.puppiesOrigin),
          this.translateEnum(puppies.puppiesDestiny),
        ];

        worksheet.addRow(row);
      }
    });

    // Auto-fit columns
    this.autoFitColumns(worksheet);
  }

  private createAnimalAbsenceSheet(workbook: Workbook, forms: Form[]): void {
    const worksheet = workbook.addWorksheet('Ausência de Animais');

    // Add headers
    const headers = Object.values(this.PORTUGUESE_HEADERS.animalAbsence);
    worksheet.addRow(headers);

    // Style header row
    this.styleHeaderRow(worksheet, 1);

    // Add data rows
    forms.forEach((form) => {
      if (form.animalAbsence) {
        const absence = form.animalAbsence;
        const row = [
          form.id,
          this.translateEnum(absence.hypotheticalAcquisition),
          this.translateEnum(absence.castrationDecision),
          this.translateEnumArray(absence.castrationReason),
          this.formatArray(absence.noAnimalsReasons), // This is array, may need special handling
        ];

        worksheet.addRow(row);
      }
    });

    // Auto-fit columns
    this.autoFitColumns(worksheet);
  }

  private createCityQuestionsSheet(workbook: Workbook, forms: Form[]): void {
    const worksheet = workbook.addWorksheet('Questionário da Cidade');

    // Add headers
    const headers = Object.values(this.PORTUGUESE_HEADERS.cityQuestions);
    worksheet.addRow(headers);

    // Style header row
    this.styleHeaderRow(worksheet, 1);

    // Add data rows
    forms.forEach((form) => {
      if (form.questionResponses?.length > 0) {
        form.questionResponses.forEach((response) => {
          const row = [
            form.id,
            response.question?.questionText || '',
            response.responseText || '',
            this.formatBoolean(response.question?.required),
          ];

          worksheet.addRow(row);
        });
      }
    });

    // Auto-fit columns
    this.autoFitColumns(worksheet);
  }

  private styleHeaderRow(worksheet: Worksheet, rowNumber: number): void {
    const headerRow = worksheet.getRow(rowNumber);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6F3FF' },
    };
    headerRow.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  }

  private autoFitColumns(worksheet: Worksheet): void {
    worksheet.columns.forEach((column) => {
      if (column && column.eachCell) {
        let maxLength = 0;
        column.eachCell({ includeEmpty: false }, (cell) => {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          const cellLength = cell.value ? cell.value.toString().length : 0;
          maxLength = Math.max(maxLength, cellLength);
        });
        column.width = Math.min(maxLength + 2, 50); // Max width of 50
      }
    });
  }

  private formatDate(date?: Date | string): string {
    if (!date) return '';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('pt-BR');
    } catch {
      return String(date);
    }
  }

  private formatBoolean(value?: boolean): string {
    if (value === null || value === undefined) return '';
    return value ? 'Sim' : 'Não';
  }

  private translateEnum(value?: string): string {
    if (!value) return '';
    return this.ENUM_TRANSLATIONS[value] || value;
  }

  private translateEnumArray(values?: Array<string>): string {
    if (!values) return '';
    return values
      .map((value) => this.ENUM_TRANSLATIONS[value] || value)
      .join('; ');
  }

  private formatArray(value?: Array<string>): string {
    if (!value) return '';
    return value.join('; ');
  }
}
