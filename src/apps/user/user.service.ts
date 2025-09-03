import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { RegisterUserDto, UpdateUserDto } from './dto/in';
import { UserRole } from '../../shared/enums';
import { UserResponseDto } from './dto/out';
import { CurrentUserDto, PaginatedDataDto } from 'src/shared';
import { CityRepository } from '../city/repositories/city.repository';
import { hashPassword } from 'src/shared/utils';
import { City } from 'src/apps/city/entities/city.entity';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly cityRepository: CityRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  checkIfCurrentUserCanSetRoleToUser(
    currentUser: CurrentUserDto,
    role: UserRole,
  ): void {
    if (
      currentUser.role !== UserRole.ADMINISTRATOR &&
      role !== UserRole.RESEARCHER
    ) {
      throw new BadRequestException(
        'Somente administradores podem criar usuários não pesquisadores',
      );
    }
  }

  checkIfCurrentUserCanSetCityToUser(
    currentUser: CurrentUserDto,
    cityIds: string[],
    role: UserRole,
  ): void {
    if (role !== UserRole.ADMINISTRATOR && cityIds.length === 0)
      throw new BadRequestException(
        'Usuário deve ter acesso a pelo menos uma cidade',
      );

    if (role === UserRole.CLIENT && cityIds.length > 1)
      throw new BadRequestException(
        'Usuários do tipo cliente só podem ter acesso a uma cidade',
      );

    if (currentUser.role !== UserRole.ADMINISTRATOR) {
      cityIds.forEach((city) => {
        if (!currentUser.cityIds.includes(city))
          throw new BadRequestException('Usuário não tem acesso a essa cidade');
      });
    }
  }

  checkIfPassedClientInstitution(role: UserRole, institution?: string) {
    if (role === UserRole.CLIENT && !institution) {
      throw new BadRequestException('Instituição é obrigatória para clientes');
    }
  }

  async checkIfEmailHasAlreadyBeenRegistered(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('E-mail já cadastrado');
    }
  }

  async checkIfCurrentUserHasAccessToUser(
    currentUser: CurrentUserDto,
    userId: string,
    user?: User | null,
  ): Promise<void> {
    if (currentUser.role === UserRole.ADMINISTRATOR) {
      return;
    }

    if (!user) {
      user = await this.userRepository.findById(userId);
    }

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (user.role !== UserRole.RESEARCHER) {
      throw new BadRequestException(
        'Somente administradores podem acessar usuários não pesquisadores',
      );
    }

    user.cities.forEach((city) => {
      if (!currentUser.cityIds.includes(city.id)) {
        throw new BadRequestException('Usuário não tem acesso a esse usuário');
      }
    });
  }

  private generateRandomPassword(): string {
    return randomBytes(32).toString('hex');
  }

  async register(
    user: CurrentUserDto,
    dto: RegisterUserDto,
  ): Promise<Partial<User>> {
    this.checkIfCurrentUserCanSetRoleToUser(user, dto.role);
    this.checkIfPassedClientInstitution(dto.role, dto.institution);
    this.checkIfCurrentUserCanSetCityToUser(user, dto.cityIds, dto.role);
    await this.checkIfEmailHasAlreadyBeenRegistered(dto.email);
    const password = this.generateRandomPassword();

    const hashedPassword = await hashPassword(password);

    const { id } = await this.userRepository.create({
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
      institution: dto.institution,
      passwordHash: hashedPassword,
      role: dto.role,
      cities: dto.cityIds.map((cityId) => ({ id: cityId }) as City),
    });

    try {
      const loginUrl = this.configService.get<string>(
        'API_BASE_URL',
        'http://localhost:3001',
      );

      await this.emailService.sendWelcomeEmail({
        name: dto.name,
        email: dto.email,
        password,
        loginUrl,
      });

      this.logger.log(`Welcome email sent to new user: ${dto.email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${dto.email}:`, error);
    }

    return {
      id,
    };
  }

  async findById(user: CurrentUserDto, id: string): Promise<User | null> {
    const userFound = await this.userRepository.findById(id);
    await this.checkIfCurrentUserHasAccessToUser(user, id, userFound);

    return userFound;
  }

  async findAllWithPagination({
    user,
    page = 1,
    limit = 10,
    search,
    role,
    active,
  }: {
    user: CurrentUserDto;
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    active?: boolean;
  }): Promise<PaginatedDataDto<UserResponseDto>> {
    let cityIds: string[] = [];
    if (user.role !== UserRole.ADMINISTRATOR) {
      cityIds = (await this.cityRepository.findByUserId(user.id)).map(
        (city) => city.id,
      );
    }

    const { users, total } = await this.userRepository.findAllWithPagination({
      page,
      limit,
      search,
      role,
      active,
      cityIds,
    });

    return new PaginatedDataDto(
      users.map(this.formatUserForList),
      total,
      limit,
      page,
    );
  }

  formatUserForList(this: void, user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      institution: user.institution,
      role: user.role,
      active: user.active,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      cityNames: user.cities?.map((city) => city.name),
    };
  }

  async update(
    user: CurrentUserDto,
    id: string,
    dto: UpdateUserDto,
  ): Promise<void> {
    this.checkIfCurrentUserCanSetRoleToUser(user, dto.role);
    this.checkIfPassedClientInstitution(dto.role, dto.institution);
    this.checkIfCurrentUserCanSetCityToUser(user, dto.cityIds, dto.role);
    await this.checkIfCurrentUserHasAccessToUser(user, id);

    await this.userRepository.update(id, {
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
      institution: dto.institution,
      role: dto.role,
      active: dto.active,
      cities: dto.cityIds.map((cityId) => ({ id: cityId }) as City),
    });
    return;
  }

  async delete(user: CurrentUserDto, id: string): Promise<void> {
    if (user.id === id) {
      throw new BadRequestException(
        'Você não pode remover seu próprio usuário',
      );
    }
    await this.checkIfCurrentUserHasAccessToUser(user, id);
    await this.userRepository.delete(id);
  }

  async toggleStatus(user: CurrentUserDto, id: string): Promise<void> {
    if (user.id === id) {
      throw new BadRequestException(
        'Você não pode alterar o status do seu próprio usuário',
      );
    }

    const targetUser = await this.userRepository.findById(id);
    if (!targetUser) {
      throw new BadRequestException('Usuário não encontrado');
    }

    await this.checkIfCurrentUserHasAccessToUser(user, id, targetUser);

    await this.userRepository.update(id, {
      active: !targetUser.active,
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
