import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { CreateOrderUseCase } from './create-order';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { makeRecipient } from 'test/factories/make-recipient';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: CreateOrderUseCase;

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientsRepository,
    );
  });

  it('should be able to create a new order', async () => {
    const recipient = makeRecipient();

    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      product: 'New Product',
    });

    expect(result.order.product).toBe('New Product');
    expect(result.order.recipientId.toString()).toBe(recipient.id.toString());
  });

  it('should not be able to create a order with inexistent recipient', async () => {
    await expect(() =>
      sut.execute({
        product: 'New Product',
        recipientId: 'inexistent-recipient-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
