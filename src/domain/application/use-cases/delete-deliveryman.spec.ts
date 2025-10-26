import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository';
import { DeleteDeliverymanUseCase } from './delete-deliveryman';
import { makeDeliveryman } from 'test/factories/make-deliveryman';

let sut: DeleteDeliverymanUseCase;
let deliverymanRepository: InMemoryDeliverymanRepository;

describe('Delete Deliveryman', () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    sut = new DeleteDeliverymanUseCase(deliverymanRepository);
  });

  it('should be able to delete a deliveryman', async () => {
    const deliveryman = makeDeliveryman();
    await deliverymanRepository.create(deliveryman);

    await sut.execute({ deliverymanId: deliveryman.id.toString() });

    expect(deliverymanRepository.items).toHaveLength(0);
  });

  it('should be able to delete the specified deliveryman', async () => {
    const deliveryman = makeDeliveryman();
    const anotherDeliveryman = makeDeliveryman();

    await deliverymanRepository.create(deliveryman);
    await deliverymanRepository.create(anotherDeliveryman);

    await sut.execute({ deliverymanId: deliveryman.id.toString() });

    expect(deliverymanRepository.items).toHaveLength(1);
    expect(deliverymanRepository.items).toEqual([anotherDeliveryman]);
  });
});
