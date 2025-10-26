import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { AuthenticateUserUseCase } from './authenticate-user';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeUser } from 'test/factories/make-user';

let sut: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUserUseCase(
      usersRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to register a new user', async () => {
    const user = makeUser({
      document: '12345678900',
      password: await fakeHasher.hash('teste123'),
    });

    usersRepository.items.push(user);

    const result = await sut.execute({
      document: '12345678900',
      password: 'teste123',
    });

    if (result.isLeft()) {
      throw new Error('Test failed: expected a Right result');
    }

    expect(result.isRight()).toBe(true);
    expect(result.value.accessToken).toEqual(expect.any(String));
  });
});
