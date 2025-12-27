import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { DeleteRecipientUseCase } from './delete-recipient';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { makeRecipient } from 'test/factories/make-recipient';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: DeleteRecipientUseCase;

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository);
  });

  it('should be able to delete a recipient', async () => {
    const recipient = makeRecipient();
    await inMemoryRecipientsRepository.create(recipient);

    await sut.execute({
      recipientId: recipient.id.toString(),
    });

    expect(inMemoryRecipientsRepository.items).toHaveLength(1);

    expect(inMemoryRecipientsRepository.items[0].deletedAt).toEqual(
      expect.any(Date),
    );
  });

  it('should not be able to delete a non-existent recipient', async () => {
    await expect(() =>
      sut.execute({
        recipientId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
