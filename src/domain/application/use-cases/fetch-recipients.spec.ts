import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { makeRecipient } from 'test/factories/make-recipient';
import { FetchRecipientsUseCase } from './fetch-recipients';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: FetchRecipientsUseCase;

describe('Fetch Recipients', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new FetchRecipientsUseCase(inMemoryRecipientsRepository);
  });

  it('should be able to fetch recipients', async () => {
    await inMemoryRecipientsRepository.create(makeRecipient());
    await inMemoryRecipientsRepository.create(makeRecipient());
    await inMemoryRecipientsRepository.create(makeRecipient());

    const result = await sut.execute({ page: 1 });

    expect(result.recipients).toHaveLength(3);
  });

  it('should be able to fetch paginated recipients', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRecipientsRepository.create(
        makeRecipient({ name: `Recipient ${i}` }),
      );
    }

    const result = await sut.execute({ page: 2 });

    expect(result.recipients).toHaveLength(2); // 22 total - 20 da pag 1 = 2 restantes
    expect(result.recipients[0].name).toEqual('Recipient 21');
  });
});
