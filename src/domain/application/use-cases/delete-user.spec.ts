import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { DeleteUserUseCase } from './delete-user';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { makeUser } from 'test/factories/make-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteUserUseCase;

describe('Delete User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new DeleteUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to delete a user', async () => {
    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    await sut.execute({
      userId: user.id.toString(),
    });

    expect(inMemoryUsersRepository.items).toHaveLength(1);

    expect(inMemoryUsersRepository.items[0].deletedAt).toEqual(
      expect.any(Date),
    );
  });

  it('should not be able to delete a non-existent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
