import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { EditRecipientUseCase } from './edit-recipient';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { makeRecipient } from 'test/factories/make-recipient';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: EditRecipientUseCase;

describe('Edit Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new EditRecipientUseCase(inMemoryRecipientsRepository);
  });

  it('should be able to edit a recipient', async () => {
    const recipient = makeRecipient();

    await inMemoryRecipientsRepository.create(recipient);

    const newData = {
      recipientId: recipient.id.toString(),
      name: 'John Doe Updated',
      email: 'johnupdated@example.com',
      city: 'New City',
      complement: 'Apt 101',
      neighborhood: 'New Neighborhood',
      number: '456',
      state: 'NS',
      street: 'New Street',
      zipCode: '98765-432',
    };

    await sut.execute(newData);

    const { recipientId, ...dataToCompare } = newData;

    expect(inMemoryRecipientsRepository.items[0]).toMatchObject({
      props: dataToCompare,
    });

    expect(inMemoryRecipientsRepository.items[0].id.toString()).toEqual(
      recipientId,
    );
  });

  it('should not be able to edit a non-existent recipient', async () => {
    await expect(() =>
      sut.execute({
        recipientId: 'non-existent-id',
        name: 'John Doe',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
