import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { ChangeUserPasswordUseCase } from './change-user-password';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/domain/enterprise/entities/user';
import { NotAllowedError } from './errors/not-allowed-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: ChangeUserPasswordUseCase;

describe('Change User Password', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new ChangeUserPasswordUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to change a user password', async () => {
    const admin = makeUser({ roles: [UserRole.ADMIN] });

    await inMemoryUsersRepository.create(admin);

    const target = makeUser();

    await inMemoryUsersRepository.create(target);

    await sut.execute({
      authorId: admin.id.toString(),
      userId: target.id.toString(),
      newPassword: 'new-password',
    });

    expect(inMemoryUsersRepository.items[1].passwordHash).toBe(
      'new-password-hashed',
    );
  });

  it('should not be able to change user password if author is not an admin', async () => {
    const nonAdmin = makeUser();
    await inMemoryUsersRepository.create(nonAdmin);

    const targetUser = makeUser();
    await inMemoryUsersRepository.create(targetUser);

    const result = sut.execute({
      authorId: nonAdmin.id.toString(),
      userId: targetUser.id.toString(),
      newPassword: 'any-password',
    });

    await expect(result).rejects.toBeInstanceOf(NotAllowedError);
  });

  it('should update the updatedAt field after changing password', async () => {
    const admin = makeUser({ roles: [UserRole.ADMIN] });
    await inMemoryUsersRepository.create(admin);

    const targetUser = makeUser();
    await inMemoryUsersRepository.create(targetUser);

    await sut.execute({
      authorId: admin.id.toString(),
      userId: targetUser.id.toString(),
      newPassword: 'new-password',
    });

    expect(inMemoryUsersRepository.items[1].updatedAt).toEqual(
      expect.any(Date),
    );
  });
});
