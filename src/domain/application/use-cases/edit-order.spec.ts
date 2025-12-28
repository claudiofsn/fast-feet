import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { EditOrderUseCase } from './edit-order';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { makeOrder } from 'test/factories/make-order';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: EditOrderUseCase;

describe('Edit Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new EditOrderUseCase(inMemoryOrdersRepository);
  });

  it('should be able to edit a order', async () => {
    const order = makeOrder();

    await inMemoryOrdersRepository.create(order);

    const newData = {
      orderId: order.id.toString(),
      product: 'Updated Product',
      deliverymanId: null,
      signatureId: null,
      canceladedAt: null,
      startDate: null,
      endDate: null,
    };

    await sut.execute(newData);

    const { orderId, ...dataToCompare } = newData;

    expect(inMemoryOrdersRepository.items[0]).toMatchObject({
      props: dataToCompare,
    });

    expect(inMemoryOrdersRepository.items[0].id.toString()).toEqual(orderId);
  });

  it('should not be able to edit a non-existent order', async () => {
    await expect(() =>
      sut.execute({
        orderId: 'non-existent-id',
        product: 'Updated Product',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
