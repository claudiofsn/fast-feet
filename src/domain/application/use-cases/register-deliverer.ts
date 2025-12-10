import { User, UserRole } from '@/domain/enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterDelivererUseCaseRequest {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

interface RegisterDelivererUseCaseResponse {
  user: User;
}

export class RegisterDelivererUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    email,
    password,
  }: RegisterDelivererUseCaseRequest): Promise<RegisterDelivererUseCaseResponse> {
    const userWithSameCpf = await this.usersRepository.findByCpf(cpf);
    if (userWithSameCpf) {
      throw new UserAlreadyExistsError(cpf);
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError(email);
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      cpf,
      email,
      passwordHash,
      roles: [UserRole.DELIVERER],
    });

    await this.usersRepository.create(user);

    return {
      user,
    };
  }
}
