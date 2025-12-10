import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface RecipientProps {
  name: string;
  email: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get zipCode() {
    return this.props.zipCode;
  }
  get street() {
    return this.props.street;
  }
  get number() {
    return this.props.number;
  }
  get complement() {
    return this.props.complement;
  }
  get neighborhood() {
    return this.props.neighborhood;
  }
  get city() {
    return this.props.city;
  }
  get state() {
    return this.props.state;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<RecipientProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return recipient;
  }
}
