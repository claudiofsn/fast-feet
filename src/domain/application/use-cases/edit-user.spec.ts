import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { EditUserUseCase } from './edit-user';
import { User, UserRole } from '@/domain/enterprise/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { makeUser } from 'test/factories/make-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: EditUserUseCase;

describe('Edit User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new EditUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to edit a user', async () => {
    const user = User.create(
      {
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '12345678900',
        passwordHash: '123456',
      },
      new UniqueEntityID('user-1'),
    );

    await inMemoryUsersRepository.create(user);

    await sut.execute({
      userId: 'user-1',
      name: 'John Doe Updated',
      email: 'johnupdated@example.com',
    });

    expect(inMemoryUsersRepository.items[0].name).toEqual('John Doe Updated');
    expect(inMemoryUsersRepository.items[0].email).toEqual(
      'johnupdated@example.com',
    );
  });

  it('should not be able to edit a non-existent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent-id',
        name: 'John Doe',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to edit roles of a user', async () => {
    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    await sut.execute({
      userId: user.id.toString(),
      roles: [UserRole.ADMIN, UserRole.DELIVERER],
    });

    expect(inMemoryUsersRepository.items[0].roles).toEqual([
      UserRole.ADMIN,
      UserRole.DELIVERER,
    ]);
  });
});
