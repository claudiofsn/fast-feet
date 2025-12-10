import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { EditUserUseCase } from './edit-user';
import { User } from '@/domain/enterprise/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: EditUserUseCase;

describe('Edit Deliverer', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new EditUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to edit a deliverer', async () => {
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

  it('should not be able to edit a non-existent deliverer', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent-id',
        name: 'John Doe',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
