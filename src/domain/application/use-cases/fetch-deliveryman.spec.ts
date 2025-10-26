import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository';
import { FetchDeliverymanUseCase } from './fetch-deliveryman';
import { makeDeliveryman } from 'test/factories/make-deliveryman';

let sut: FetchDeliverymanUseCase;
let deliverymanRepository: InMemoryDeliverymanRepository;

describe('Fetch Deliveryman Use Case', () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    sut = new FetchDeliverymanUseCase(deliverymanRepository);
  });

  it('should be able to fetch a deliveryman by ID', async () => {
    const deliveryman1 = makeDeliveryman({ name: 'John Doe' });
    const deliveryman2 = makeDeliveryman({ name: 'Jane Doe' });
    const deliveryman3 = makeDeliveryman({ name: 'Jim Doe' });

    await deliverymanRepository.create(deliveryman1);
    await deliverymanRepository.create(deliveryman2);
    await deliverymanRepository.create(deliveryman3);

    const result = await sut.execute({ page: 1 });

    expect(result.value?.deliveryman).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'John Doe' }),
        expect.objectContaining({ name: 'Jane Doe' }),
        expect.objectContaining({ name: 'Jim Doe' }),
      ]),
    );
  });

  it('should be able to fetch a paginated list of deliverymen', async () => {
    for (let i = 1; i <= 25; i++) {
      await deliverymanRepository.create(
        makeDeliveryman({ name: `Deliveryman ${i}` }),
      );
    }

    const result = await sut.execute({ page: 2 });
    expect(result.value?.deliveryman).toHaveLength(5);
    expect(result.value?.deliveryman).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Deliveryman 21' }),
        expect.objectContaining({ name: 'Deliveryman 22' }),
        expect.objectContaining({ name: 'Deliveryman 23' }),
        expect.objectContaining({ name: 'Deliveryman 24' }),
        expect.objectContaining({ name: 'Deliveryman 25' }),
      ]),
    );
  });
});
