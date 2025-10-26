import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { RegisterUserUseCase } from './register-student';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { UserRole } from '@/domain/enterprise/entities/user';

let sut: RegisterUserUseCase;
let usersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;

describe('Register User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterUserUseCase(usersRepository, fakeHasher);
  });

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      email: 'student@example.com',
      name: 'Student Name',
      password: 'teste123',
      document: '12345678900',
      role: UserRole.USER,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      user: usersRepository.items[0],
    });
  });

  it('should hash student password upon register', async () => {
    const password = 'teste123';

    const result = await sut.execute({
      email: 'student@example.com',
      name: 'Student Name',
      password,
      document: '12345678900',
      role: UserRole.USER,
    });

    const hashedPassword = await fakeHasher.hash(password);

    expect(result.isRight()).toBeTruthy();
    expect(usersRepository.items[0].password).toEqual(hashedPassword);
  });
});
