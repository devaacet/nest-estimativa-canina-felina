// User and System Enums
export enum UserRole {
  RESEARCHER = 'researcher',
  MANAGER = 'manager',
  ADMINISTRATOR = 'administrator',
  CLIENT = 'client',
}

export enum FormStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  SUBMITTED = 'submitted',
}

export enum StepType {
  INITIAL_INFO = 'initial_info',
  SOCIOECONOMIC_INFO = 'socioeconomic_info',
  ANIMAL_INFO = 'animal_info',
  CURRENT_ANIMALS = 'current_animals',
  PREVIOUS_ANIMALS = 'previous_animals',
  PUPPIES_KITTENS = 'puppies_kittens',
  ANIMAL_ABSENCE_INFO = 'animal_absence_info',
  EXTRA_INFO = 'extra_info',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

// Interview and Form Enums
export enum InterviewStatus {
  ATTENDED = 'attended',
  REFUSED = 'refused',
  CLOSED_HOUSE = 'closed_house',
}

export enum ResidenceType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  OTHERS = 'others',
}

export enum EducationLevel {
  NONE = 'none',
  ELEMENTARY = 'elementary',
  HIGH_SCHOOL = 'high_school',
  HIGHER = 'higher',
  TECHNICAL = 'technical',
  NO_RESPONSE = 'no_response',
}

export enum HousingType {
  OWNED = 'owned',
  RENTED = 'rented',
  PROVIDED = 'provided',
  NO_RESPONSE = 'no_response',
}

export enum IncomeRange {
  ZERO_TO_2K = '0_2k',
  TWO_TO_5K = '2k_5k',
  FIVE_TO_10K = '5k_10k',
  ABOVE_10K = 'above_10k',
  NO_RESPONSE = 'no_response',
}

// Animal Related Enums
export enum AnimalSpecies {
  DOG = 'dog',
  CAT = 'cat',
  HORSE = 'horse',
  OTHERS = 'others',
}

export enum AnimalGender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum AnimalCondition {
  HEALTHY = 'healthy',
  SICK = 'sick',
  INJURED = 'injured',
  OTHERS = 'others',
}

export enum CastrationStatus {
  NO = 'no',
  YES_MORE_THAN_YEAR = 'yes_more_than_year',
  YES_LESS_THAN_YEAR = 'yes_less_than_year',
}

export enum CastrationReason {
  NEVER_THOUGHT = 'never_thought',
  COST = 'cost',
  LACK_TIME = 'lack_time',
  WANTS_OFFSPRING = 'wants_offspring',
  DANGEROUS = 'dangerous',
}

export enum VaccinationReason {
  COST = 'cost',
  LACK_TIME = 'lack_time',
  NOT_NECESSARY = 'not_necessary',
}

export enum AcquisitionMethod {
  ADOPTED = 'adopted',
  BOUGHT = 'bought',
  OWN_ANIMAL_OFFSPRING = 'own_animal_offspring',
  GIFTED = 'gifted',
}

export enum AcquisitionTime {
  MORE_THAN_YEAR = 'more_than_year',
  LESS_THAN_YEAR = 'less_than_year',
}

export enum AnimalHousing {
  KENNEL_CATTERY = 'kennel_cattery',
  INSIDE_HOUSE = 'inside_house',
  LOOSE_YARD = 'loose_yard',
  CHAINED = 'chained',
}

export enum AnimalBreed {
  WITH_BREED = 'with_breed',
  MIXED_BREED = 'mixed_breed',
}

export enum AnimalDestiny {
  DONATED = 'donated',
  DIED = 'died',
  SOLD = 'sold',
  DISAPPEARED = 'disappeared',
  ABANDONED = 'abandoned',
}

export enum VetFrequency {
  MORE_THAN_ONCE_YEAR = 'more_than_once_year',
  ONCE_YEAR = 'once_year',
  WHEN_SICK = 'when_sick',
  RARELY_NEVER = 'rarely_never',
  NO_RESPONSE = 'no_response',
}

export enum CareType {
  SHELTER = 'shelter',
  FOOD = 'food',
  VETERINARY_CARE = 'veterinary_care',
  OTHERS = 'others',
}

export enum HypotheticalAcquisition {
  ADOPT_OWN_INITIATIVE = 'adopt_own_initiative',
  BUY_KENNEL = 'buy_kennel',
  ONLY_IF_GIFTED = 'only_if_gifted',
  NEVER = 'never',
}

export enum NoAnimalsReason {
  NEVER_THOUGHT = 'never_thought',
  DONT_LIKE = 'dont_like',
  LIKE_NO_INTEREST = 'like_no_interest',
  COST = 'cost',
  LACK_TIME = 'lack_time',
}

export enum CastrationDecision {
  NO = 'no',
  YES = 'yes',
  DONT_KNOW = 'dont_know',
}
