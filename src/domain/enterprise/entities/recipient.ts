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

  public update(params: Partial<RecipientProps>) {
    // Filtra chaves que são undefined para não "apagar" dados existentes
    const validParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined),
    );

    Object.assign(this.props, validParams);
    this.touch();
  }

  // Helper para atualizar a data de modificação
  private touch() {
    this.props.updatedAt = new Date();
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
