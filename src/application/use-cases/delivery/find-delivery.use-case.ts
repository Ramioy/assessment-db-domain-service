import { Injectable, Inject } from '@nestjs/common';
import { Delivery } from '@domain/models/delivery.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { IDeliveryRepository } from '@application/ports/out/delivery-repository.port';

@Injectable()
export class FindDeliveryUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly repository: IDeliveryRepository,
  ) {}

  async execute(id: number): Promise<Delivery> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('Delivery', id);
    }
    return entity;
  }
}
