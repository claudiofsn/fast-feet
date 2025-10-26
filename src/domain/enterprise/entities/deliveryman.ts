import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface DeliverymanProps {
  name: string;
  email: string;
  document: string;
  password: string;
  createdAt: Date;
}

export class Deliveryman extends Entity<DeliverymanProps> {
  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get document() {
    return this.props.document;
  }

  set document(document: string) {
    this.props.document = document;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<DeliverymanProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const deliveryman = new Deliveryman(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return deliveryman;
  }
}
