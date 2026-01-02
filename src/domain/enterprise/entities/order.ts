import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { OrderHasBeenDeliveredError } from '@/domain/application/use-cases/errors/order-has-been-delivered-error';
import { OrderHasntBeenWithdrawError } from '@/domain/application/use-cases/errors/order-hasnt-been-withdraw-error';

export interface OrderProps {
  recipientId: UniqueEntityID;
  product: string;
  latitude: number;
  longitude: number;
  deliverymanId: UniqueEntityID | null;
  signatureId: UniqueEntityID | null;
  canceladedAt: Date | null; // Quando algo saiu errado e o pedido foi cancelado ou devolvido
  startDate: Date | null; // Marca a data de retirada do pedido - quando o entregador iniciou a entrega
  endDate: Date | null; // Marca a data de entrega do pedido - quando o entregador finalizou a entrega
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Order extends Entity<OrderProps> {
  get product() {
    return this.props.product;
  }

  set product(product: string) {
    this.props.product = product;
    this.touch();
  }

  get latitude() {
    return this.props.latitude;
  }

  get longitude() {
    return this.props.longitude;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  set recipientId(recipientId: UniqueEntityID) {
    this.props.recipientId = recipientId;
    this.touch();
  }

  get deliverymanId() {
    return this.props.deliverymanId;
  }

  set deliverymanId(deliverymanId: UniqueEntityID | null) {
    this.props.deliverymanId = deliverymanId;
    this.touch();
  }

  get signatureId() {
    return this.props.signatureId;
  }

  set signatureId(signatureId: UniqueEntityID | null) {
    this.props.signatureId = signatureId;
    this.touch();
  }

  get canceladedAt() {
    return this.props.canceladedAt;
  }

  set canceladedAt(canceladedAt: Date | null) {
    this.props.canceladedAt = canceladedAt;
    this.touch();
  }

  get startDate() {
    return this.props.startDate;
  }

  set startDate(startDate: Date | null) {
    this.props.startDate = startDate;
    this.touch();
  }

  get endDate() {
    return this.props.endDate;
  }

  set endDate(endDate: Date | null) {
    this.props.endDate = endDate;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  return() {
    if (!this.props.startDate) {
      throw new OrderHasntBeenWithdrawError();
    }

    if (this.props.endDate) {
      throw new OrderHasBeenDeliveredError();
    }

    this.props.canceladedAt = new Date();
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  public update(params: Partial<OrderProps>) {
    // Filtra chaves que são undefined para não "apagar" dados existentes
    const validParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined),
    );

    Object.assign(this.props, validParams);
    this.touch();
  }

  static create(props: Optional<OrderProps, 'createdAt'>, id?: UniqueEntityID) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return order;
  }
}
