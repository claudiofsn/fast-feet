import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { RegisterDelivererUseCase } from './register-deliverer';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: RegisterDelivererUseCase;

describe('Register Deliverer', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterDelivererUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to register a new deliverer', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678900',
      email: 'john@example.com',
      password: '123456',
    });

    expect(result.user.id).toBeTruthy();
    expect(inMemoryUsersRepository.items).toHaveLength(1);
    expect(inMemoryUsersRepository.items[0].email).toEqual('john@example.com');
  });

  it('should not be able to register with same email', async () => {
    const email = 'john@example.com';

    await sut.execute({
      name: 'John Doe',
      cpf: '12345678900',
      email,
      password: '123456',
    });

    await expect(() =>
      sut.execute({
        name: 'John Doe 2',
        cpf: '98765432100',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
