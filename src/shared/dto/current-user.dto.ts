import { UserRole } from '../enums';

export interface CurrentUserDto {
  id: string;
  role: UserRole;
  cityIds: string[];
}
