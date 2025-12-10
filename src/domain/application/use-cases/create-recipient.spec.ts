import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { CreateRecipientUseCase } from './create-recipient';
import { ConflictException } from '@nestjs/common';
import { makeRecipient } from 'test/factories/make-recipient';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: CreateRecipientUseCase;

describe('Create Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new CreateRecipientUseCase(inMemoryRecipientsRepository);
  });

  it('should be able to create a new recipient', async () => {
    const result = await sut.execute(
      makeRecipient({ email: 'johndoe@example.com' }),
    );

    expect(result.recipient).toBeTruthy();
    expect(result.recipient.id).toBeTruthy();
    expect(inMemoryRecipientsRepository.items).toHaveLength(1);
    expect(inMemoryRecipientsRepository.items[0].email).toEqual(
      'johndoe@example.com',
    );
  });

  it('should not be able to create a recipient with same email', async () => {
    const email = 'johndoe@example.com';

    await sut.execute(makeRecipient({ email }));

    await expect(() =>
      sut.execute(makeRecipient({ email })),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
