import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateUserUseCase } from './authenticate-user';
import { User } from '@/domain/enterprise/entities/user';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { makeUser } from 'test/factories/make-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate', async () => {
    const user = makeUser({
      cpf: '12345678900',
      passwordHash: await fakeHasher.hash('123456'),
    });

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      cpf: '12345678900',
      password: '123456',
    });

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });

  it('should not be able to authenticate with wrong password', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '12345678900',
      passwordHash: await fakeHasher.hash('123456'),
    });

    await inMemoryUsersRepository.create(user);

    await expect(() =>
      sut.execute({
        cpf: '12345678900',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });

  it('should not be able to authenticate with wrong cpf', async () => {
    await expect(() =>
      sut.execute({
        cpf: 'wrong-cpf',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });
});
